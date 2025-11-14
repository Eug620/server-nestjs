import { Module } from '@nestjs/common';
import { RoomService } from '@/room/room.service';
import { RoomController } from '@/room/room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '@/room/entities/room.entity';
import { UserEntity } from '@/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, UserEntity])], // 关联数据库
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule { }
