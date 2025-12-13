import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { WsJwtAuthGuard } from '@/socket/socket.guard'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from '@/modules/friend/entities/friend.entity';
@WebSocketGateway(3001, {
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
  private userRooms = new Map<string, Set<string>>();

  constructor(
    @InjectRepository(FriendEntity)
    private friendRepository: Repository<FriendEntity>,
  ){}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // 如果用户存在，从所有房间中移除用户
    if (client.data.user) {
      this.users.delete(client.data.user.id);
      // 获取当前用户所有好友，并通知当前用户已下线
  
      // 获取当前用户所有房间，通知当前用户已退出房间
      const rooms = this.userRooms.get(client.data.user.id);
      if (rooms) {
        rooms.forEach(async room => {
          client.leave(room);
          const sockets = await this.wss.in(room).fetchSockets();
          // 通知房间内所有成员当前用户已加入房间
          this.wss.to(room).emit('online', {
            room,
            users: sockets.map(socket => socket.data.user?.id),
            timestamp: Date.now() // 消息发送时间
          }); // 发送给房间内所有成员包括自己
        });

        // 从用户房间映射中删除用户
        this.userRooms.delete(client.data.user.id);
      }
    }
    // 获取当前用户所有好友，并通知当前用户已下线
    await this.handleStatus(client.data.user.id, false);
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
   * 加入房间
   * @param client 
   * @param room 
   */
  @SubscribeMessage('join')
  async handleJoin(client: Socket, room: string): Promise<void> {
    console.log('[join-room]','用户名：',client.data.user?.username,'房间id：',room)
    client.join(room);
    // 记录用户加入的房间
    this.userRooms.set(client.data.user.id, (this.userRooms.get(client.data.user.id) || new Set()).add(room));
    // 获取当前房间所有成员
    const sockets = await this.wss.in(room).fetchSockets();
    // this.wss.socketsJoin(room);
    // client.send({ room, message: `You have joined room: ${room}` });


    // 通知房间内所有成员当前用户已加入房间
    this.wss.to(room).emit('online', {
      room,
      users: sockets.map(socket => socket.data.user?.id),
      timestamp: Date.now() // 消息发送时间
    }); // 发送给房间内所有成员包括自己

    // 加入房间
    // client.emit('join', { room, message: `You have joined room: ${room}` });
  }


  /**
   * 离开房间
   * @param client 
   * @param room 
   */
  @SubscribeMessage('leave')
  handleLeave(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leave', { room, message: `You have left room: ${room}` });
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
    await this.handleStatus(client.data.user.id, true);
    // 获取当前用户所有房间，通知当前用户已加入房间

  }

  /**
   * 通知所有好友当前用户状态
   * @param id 用户id
   */
  async handleStatus(creator: string, status: boolean) {
    const friends = await this.friendRepository.find({
      where: {
        creator,
      },
    });
    // 通知所有好友当前用户状态
    friends.forEach(friend => {
      const receiver = this.users.get(friend.friend_id);
      if (receiver) {
        receiver.emit('status', {
          friend: friend.creator,
          status,
          timestamp: Date.now() // 消息发送时间
        }); // 发送给房间内所有成员包括自己
      } else {
        this.logger.error(`User ${friend.friend_id} not found`);
      }
    });
  }
}
