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
  create(createApplyDto: CreateApplyDto, userId: string) {
    return this.applyRepository.save(Object.assign(createApplyDto, { userId }));
  }

  findAll(userId: string) {
    return this.applyRepository.find({
      where: { user_id: userId }, 
      order: { createdAt: 'DESC' },
    });
  }

  findRoomAll(roomId: string) {
    return this.applyRepository.find({
      where: { room_id: roomId }, 
      order: { createdAt: 'DESC' },
    });
  }

  findApplyAll(userId: string) {
    return this.applyRepository.find({
      where: { apply_user_id: userId }, 
      order: { createdAt: 'DESC' },
    });
  }

  update(id: string, updateApplyDto: UpdateApplyDto) {
    return this.applyRepository.update(id, updateApplyDto);
  }

  remove(id: string) {
    return this.applyRepository.delete(id);
  }
}
