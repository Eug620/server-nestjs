import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendEntity } from './entities/friend.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendEntity, UserEntity])], // 关联数据库
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
