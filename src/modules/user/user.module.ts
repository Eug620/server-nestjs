import { Module } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { UserController } from '@/modules/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/modules/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], // 关联数据库
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
