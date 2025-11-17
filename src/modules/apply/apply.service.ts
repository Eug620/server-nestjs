import { Injectable } from '@nestjs/common';
import { CreateApplyDto } from '@/modules/apply/dto/create-apply.dto';
import { UpdateApplyDto } from '@/modules/apply/dto/update-apply.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplyEntity } from '@/modules/apply/entities/apply.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApplyService {
  @InjectRepository(ApplyEntity)
  private applyRepository: Repository<ApplyEntity>
  create(createApplyDto: CreateApplyDto, user_id: string) {
    return this.applyRepository.save(Object.assign(createApplyDto, { user_id }));
  }

  findAll(userId: string) {
    return this.applyRepository.find({
      where: { user_id: userId }, 
      order: { createdAt: 'DESC' },
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

  async update(id: string, updateApplyDto: UpdateApplyDto) {
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
