import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { WsJwtAuthGuard } from '@/socket/socket.guard'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from '@/modules/friend/entities/friend.entity';
import { MemberEntity } from '@/modules/member/entities/member.entity';
@WebSocketGateway({
  path: '/websocket',
  serveClient: true,
  namespace: '/',
  cors: {
    origin: '*',
  },
}) // 指定端口号8030
// @WebSocketGateway() // 默认使用服务所用端口-3000
@UseGuards(WsJwtAuthGuard) // 对整个网关的连接应用认证守卫
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('SocketGateway');
  private users = new Map<string, Socket>();

  constructor(
    @InjectRepository(FriendEntity)
    private friendRepository: Repository<FriendEntity>,
    @InjectRepository(MemberEntity)
    private memberRepository: Repository<MemberEntity>,
  ){}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    if (!client.data.user) return
    // 从用户房间中移除用户
    this.handleResigerRooms(client,'leave');
    // 获取当前用户所有好友，并通知当前用户已下线
    await this.handleStatus(client, false);
    // 从用户映射中移除用户
    this.users.delete(client.data.user.id);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('message', { message: `Welcome to the WebSocket server!`, timestamp: Date.now() });
  }

  /**   
   * 接收客户端发送的消息
   * @param client 
   * @param message 
   */
  @SubscribeMessage('message')
  handleMessage(client: Socket, message: string): void {
    console.log('Message from client:', message);
  }


  /**   
   * 发送信息到指定用户
   * @param client 
   * @param message 
   */
  @SubscribeMessage('user')
  handleMessageUser(client: Socket, message: { sender: string, message: string }): void {
    // 需要记录用户id和对应的client映射关系才能实现
    const receiver = this.users.get(message.sender);
    const msg = Object.assign({}, message, { 
      sender: client.data.user.id, // 发送方id
      receiver: message.sender, // 接收方id
      timestamp: Date.now() // 消息发送时间
    });
    if (receiver) {
      receiver.emit('user', msg); // 发送给指定用户
    } else {
      this.logger.error(`User ${message.sender} not found`);
    }
    client.emit('sender', msg); // 回显给发送方
    // TODO 记录用户之间的消息记录 - 数据库
    // { message, sender: client.data.user.id, receiver: message.sender, timestamp: Date.now() }
  }


  /**
   * 发送信息到指定房间
   * @param client 
   * @param message 
   */
  @SubscribeMessage('room')
  handleMessageRoom(client: Socket, message: { room: string, message: string }): void {
    // client.to(message.room).emit('msg2client', message); // 发送给除了自己之外的房间内成员 - 群公告
    this.wss.to(message.room).emit('room', Object.assign({}, message, {
      sender: client.data.user.id, // 发送方id
      timestamp: Date.now() // 消息发送时间
    })); // 发送给房间内所有成员包括自己
  }

  /**
 * 初始化用户
 * @param client 
 * @param room 
 */
  @SubscribeMessage('init')
  async handleInit(client: Socket): Promise<void> {
    this.logger.log(`init 当前用户信息: id: ${client.data.user.id}, username: ${client.data.user.username}`);
    // 记录用户id和对应的client映射关系
    this.users.set(client.data.user.id, client);
    
    // 获取当前用户所有好友，并通知当前用户已上线
    await this.handleStatus(client, true);
 
    // 获取当前用户所有房间，通知当前用户已加入房间
    await this.handleResigerRooms(client);
  }


  /**
   * 初始化用户所加入的房间
   * @param client 
   */
  async handleResigerRooms(client: Socket, type: 'join' | 'leave' = 'join') {
    const rooms = await this.memberRepository.find({
      where: {
        user_id: client.data.user.id,
      },
      relations: ['room_info'],
    });
    rooms.forEach(async room => {
      // 加入房间/离开房间
      client[type](room.room_id);

      // 获取当前房间所有成员
      const sockets = await this.wss.in(room.room_id).fetchSockets();
      // 通知房间内所有成员当前房间活跃用户
      this.wss.to(room.room_id).emit('online', {
        room: room.room_id,
        users: sockets.map(socket => socket.data.user?.id),
        timestamp: Date.now() // 消息发送时间
      }); // 发送给房间内所有成员包括自己

      // 
      client.emit(type, { room: room.room_id, message: `You have ${type} room: ${room.room_info.name}` });
    });
  }

  /**
   * 通知所有好友当前用户状态
   * @param client 当前用户
   * @param status 当前用户状态
   */
  async handleStatus(client: Socket, status: boolean) {
    const friends = await this.friendRepository.find({
      where: {
        creator: client.data.user.id,
      },
    });
    const onlineFriends:string[] = [];
    // 通知所有好友当前用户状态
    friends.forEach(friend => {
      const receiver = this.users.get(friend.friend_id);
      if (receiver) {
        onlineFriends.push(friend.friend_id);
        receiver.emit('status', {
          friend: friend.creator,
          status,
          timestamp: Date.now() // 消息发送时间
        }); // 发送给房间内所有成员包括自己
      } else {
        this.logger.error(`User ${friend.friend_id} not found`);
      }
    });

    // 如果是上线状态，通知当前用户所有在线好友
    status && client.emit('onlineFriends', {
      users: onlineFriends,
      timestamp: Date.now() // 消息发送时间
    });
  }
}
