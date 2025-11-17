import { Injectable } from '@nestjs/common';
import { CreateApplyDto } from '@/modules/apply/dto/create-apply.dto';
import { UpdateApplyDto } from '@/modules/apply/dto/update-apply.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplyEntity } from '@/modules/apply/entities/apply.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { FriendEntity } from '@/modules/friend/entities/friend.entity';
import { MemberEntity } from '@/modules/member/entities/member.entity';

@Injectable()
export class ApplyService {
  // 申请服务
  @InjectRepository(ApplyEntity)
  private applyRepository: Repository<ApplyEntity>
  // 好友服务
  @InjectRepository(FriendEntity)
  private friendRepository: Repository<FriendEntity>
  // 房间成员服务
  @InjectRepository(MemberEntity)
  private memberRepository: Repository<MemberEntity>

  async create(createApplyDto: CreateApplyDto, user_id: string) {
    // let 
    const apply = await this.applyRepository.findOne({
      where: Object.assign(createApplyDto, { user_id, isDeleted: false, handle_status: false }),
    })
    if (apply) {
      throw new HttpException('已存在相同申请', 401);
    }
    return this.applyRepository.save(Object.assign(createApplyDto, { user_id }));
  }

  findAll(userId: string) {
    return this.applyRepository.find({
      where: { user_id: userId, isDeleted: false }, 
      order: { createdAt: 'DESC' },
      relations: ['user_info', 'room_info', 'apply_user_info'],
      select: {
        id: true,
        user_id: true,
        room_id: true,
        apply_user_id: true,
        status: true,
        createdAt: true,
        handle_status: true,
        updatedAt: true,
        user_info: {
          id: true,
          username: true,
          email: true,
        },
        room_info: {
          id: true,
          name: true,
          description: true,
        },
        apply_user_info: {
          id: true,
          username: true,
          email: true,
        },
      }
    });
  }

  findRoomAll(room_id: string) {
    return this.applyRepository.find({
      where: { room_id, isDeleted: false, handle_status: false }, 
      order: { createdAt: 'DESC' },
      relations: ['user_info', 'room_info', 'apply_user_info'],
      select: {
        id: true,
        user_id: true,
        room_id: true,
        apply_user_id: true,
        status: true,
        createdAt: true,
        handle_status: true,
        updatedAt: true,
        user_info: {
          id: true,
          username: true,
          email: true,
        },
        room_info: {
          id: true,
          name: true,
          description: true,
        },
        apply_user_info: {
          id: true,
          username: true,
          email: true,
        },
      }
    });
  }

  findApplyAll(userId: string) {
    return this.applyRepository.find({
      where: { apply_user_id: userId, isDeleted: false }, 
      order: { createdAt: 'DESC' },
      relations: ['user_info', 'room_info', 'apply_user_info'],
      select: {
        id: true,
        user_id: true,
        room_id: true,
        apply_user_id: true,
        status: true,
        createdAt: true,
        handle_status: true,
        updatedAt: true,
        user_info: {
          id: true,
          username: true,
          email: true,
        },
        room_info: {
          id: true,
          name: true,
          description: true,
        },
        apply_user_info: {
          id: true,
          username: true,
          email: true,
        },
      }
    });
  }

  async update(id: string, updateApplyDto: UpdateApplyDto, userId: string) {
    // 检查是否存在
    const apply = await this.applyRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['user_info', 'room_info', 'apply_user_info'],
    });
    if (!apply) {
      throw new HttpException('申请不存在', 401);
    }
    if (apply.handle_status) {
      throw new HttpException('已处理，不能再操作', 401);
    }

    if (apply.apply_user_id && apply.apply_user_id !== userId) {
      throw new HttpException('不是被申请人，不能操作', 401);
    }
    if (apply.apply_user_id) {
      // todo 申请好友时，判断是否是好友
      if (updateApplyDto.status) {
        // 同意好友申请时，判断是否是好友
        this.friendRepository.save([
          {
            creator: apply.apply_user_id,
            friend_id: apply.user_id,
          },
          {
            creator: apply.user_id,
            friend_id: apply.apply_user_id,
          },
        ])
      }
    }

    if (apply.room_id && apply.room_info?.creator !== userId) {
      throw new HttpException('不是房间创建人，不能操作', 401);
    }
    if (apply.room_id) {
      // todo 申请加入房间时，判断是否是房间成员
      if (updateApplyDto.status) {
        // 同意加入房间时，判断是否是房间成员
        this.memberRepository.save({
          room_id: apply.room_id,
          user_id: apply.user_id,
        })
      }
    }

    return this.applyRepository.update(id, updateApplyDto);
  }

  async remove(id: string) {
    // 检查是否存在
    const apply = await this.applyRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!apply) {
      throw new HttpException('申请不存在', 401);
    }
    if (apply.handle_status) {
      throw new HttpException('已处理，不能再操作', 401);
    }
    return this.applyRepository.save(Object.assign(apply, { isDeleted: true }));
  }
}
