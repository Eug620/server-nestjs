// socket.module.ts
import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { MemberEntity } from '@/modules/member/entities/member.entity';
import { FriendEntity } from '@/modules/friend/entities/friend.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FriendEntity, MemberEntity])],
  providers: [SocketGateway],
  exports: [SocketGateway], // 关键：导出以便其他模块使用
})
export class SocketModule {}