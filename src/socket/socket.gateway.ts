/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2025-11-01 13:38:38
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2025-11-02 12:46:18
 * @FilePath     : /server-nestjs/src/socket/socket.gateway.ts
 * @Description  : filename
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { WsJwtAuthGuard } from './socket.guard'
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

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    const user = client.data.user;
    console.log(`用户id: ${user}`,);
    console.log(`用户username: ${user}`,);
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('message', { message: 'Welcome to the WebSocket server!' });
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
  @SubscribeMessage('msgToUser')
  handleMessageUser(client: Socket, message: { sender: string, room: string, message: string }): void {
    // 需要记录用户id和对应的client映射关系才能实现
    // Map<userId -> client>
  }


  /**
   * 发送信息到指定房间
   * @param client 
   * @param message 
   */
  @SubscribeMessage('msgToRoom')
  handleMessageRoom(client: Socket, message: { sender: string, room: string, message: string }): void {
    // client.to(message.room).emit('msg2client', message); // 发送给除了自己之外的房间内成员
    console.log('msgToRoom-当前用户信息:',client.data.user)
    this.wss.to(message.room).emit('msg2client', message); // 发送给房间内所有成员包括自己
  }

  /**
   * 加入房间
   * @param client 
   * @param room 
   */
  @SubscribeMessage('join')
  handleJoin(client: Socket, room: string): void {
    client.join(room);
    client.emit('join', { room, message: `You have joined room: ${room}` });
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
}
