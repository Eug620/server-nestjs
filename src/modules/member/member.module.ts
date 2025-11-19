import { Module } from '@nestjs/common';
import { MemberService } from '@/modules/member/member.service';
import { MemberController } from '@/modules/member/member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from '@/modules/member/entities/member.entity';
import { RoomEntity } from '@/modules/room/entities/room.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity, RoomEntity, UserEntity])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
