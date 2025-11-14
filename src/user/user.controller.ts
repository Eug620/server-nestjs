/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2025-11-02 08:12:26
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2025-11-02 11:18:18
 * @FilePath     : /server-nestjs/src/user/user.controller.ts
 * @Description  : filename
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { Controller, Get, Post, Body, Patch, Param, Delete,Req, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/auth.guard';
import { UserService } from '@/user/user.service';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { UserRo } from '@/user/user.service';
@Controller('user')
// @UseGuards(JwtAuthGuard) // 整个控制器的接口都需要鉴权
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard) // 仅该接口需要鉴权
  async findAll(@Query() query, @Req() request): Promise<UserRo> {
    // 从req上面获取解析token里面的信息
    console.log(request.user)
    return await this.userService.findAll(query.page, query.pageSize);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) // 仅该接口需要鉴权
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) // 仅该接口需要鉴权
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@Req() request) {
    return this.userService.update(id, updateUserDto,request.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // 仅该接口需要鉴权
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('login')
  login(@Body() createUserDto: CreateUserDto) {
    return this.userService.login(createUserDto.username, createUserDto.password);
  }
}
