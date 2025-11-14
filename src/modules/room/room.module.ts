import { Module } from '@nestjs/common';
import { RoomService } from '@/modules/room/room.service';
import { RoomController } from '@/modules/room/room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '@/modules/room/entities/room.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, UserEntity])], // 关联数据库
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule { }
