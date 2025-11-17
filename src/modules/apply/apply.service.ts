import { Injectable } from '@nestjs/common';
import { CreateApplyDto } from '@/modules/apply/dto/create-apply.dto';
import { UpdateApplyDto } from '@/modules/apply/dto/update-apply.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplyEntity } from '@/modules/apply/entities/apply.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

@Injectable()
export class ApplyService {
  @InjectRepository(ApplyEntity)
  private applyRepository: Repository<ApplyEntity>
  async create(createApplyDto: CreateApplyDto, user_id: string) {
    // let 
    const apply = await this.applyRepository.findOne({
      where: Object.assign(createApplyDto, { user_id, isDeleted: false }),
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

  findRoomAll(roomId: string) {
    return this.applyRepository.find({
      where: { room_id: roomId, isDeleted: false }, 
      order: { createdAt: 'DESC' },
    });
  }

  findApplyAll(userId: string) {
    return this.applyRepository.find({
      where: { apply_user_id: userId, isDeleted: false }, 
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateApplyDto: UpdateApplyDto, userId: string) {
    // 检查是否存在
    const apply = await this.applyRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!apply) {
      throw new Error('申请不存在');
    }
    if (apply.handle_status) {
      throw new Error('已处理，不能再操作');
    }

    if (apply.apply_user_id && apply.apply_user_id !== userId) {
      throw new Error('不是申请人，不能操作');
    }
    return this.applyRepository.update(id, updateApplyDto);
  }

  async remove(id: string) {
    // 检查是否存在
    const apply = await this.applyRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!apply) {
      throw new Error('申请不存在');
    }
    if (apply.handle_status) {
      throw new Error('已处理，不能再操作');
    }
    return this.applyRepository.save(Object.assign(apply, { isDeleted: true }));
  }
}
