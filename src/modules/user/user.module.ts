/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2025-11-02 08:12:26
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2025-11-02 08:38:32
 * @FilePath     : /server-nestjs/src/user/user.module.ts
 * @Description  : filename
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
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
