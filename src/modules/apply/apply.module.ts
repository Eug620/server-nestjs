import { Module } from '@nestjs/common';
import { ApplyService } from '@/modules/apply/apply.service';
import { ApplyController } from '@/modules/apply/apply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplyEntity } from '@/modules/apply/entities/apply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApplyEntity])], // 关联数据库
  controllers: [ApplyController],
  providers: [ApplyService],
})
export class ApplyModule {}
