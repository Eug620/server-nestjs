import { Module } from '@nestjs/common';
import { MemberService } from '@/modules/member/member.service';
import { MemberController } from '@/modules/member/member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from '@/modules/member/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
