import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { CreateMemberDto } from '@/modules/member/dto/create-member.dto';
import { SearchMemberDto } from '@/modules/member/dto/search-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from '@/modules/member/entities/member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MemberService {
  @InjectRepository(MemberEntity)
  private memberRepository: Repository<MemberEntity>;

  create(createMemberDto: CreateMemberDto) {
    return this.memberRepository.save(createMemberDto);
  }


  findAll(query: SearchMemberDto) {
    return this.memberRepository.find({
      where: Object.assign(query, {
        isDeleted: false,
      }),
      order: { createdAt: 'DESC' },
      relations: ['room_info', 'user_info'],
      select: {
        id: true,
        room_id: true,
        user_id: true,
        createdAt: true,
        user_info: {
          username: true,
          email: true,
          id: true,
          createdAt: true,
          updatedAt: true
        },
        room_info: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true
        },
      },
    });
  }


  async remove(id: string) {
    const member = await this.memberRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
    if (!member) {
      throw new HttpException('该成员不存在', 401);
    }
    member.isDeleted = true;
    return this.memberRepository.save(member);
  }
}
