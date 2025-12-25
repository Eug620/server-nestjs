import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/auth.guard';
import { UserService } from '@/modules/user/user.service';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { UserRo, UserInfo } from '@/modules/user/user.interface';
// upload.controller.ts
import {
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, basename } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('user')
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

  @Get('/search')
  @UseGuards(JwtAuthGuard) // 仅该接口需要鉴权
  async searchAll(@Query('username') username: string): Promise<UserInfo[]> {
    // 从req上面获取解析token里面的信息
    return await this.userService.searchAll(username);
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard) // 仅该接口需要鉴权
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) // 仅该接口需要鉴权
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() request) {
    return this.userService.update(id, updateUserDto, request.user);
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

  @Post('upload')
  @UseGuards(JwtAuthGuard) // 仅该接口需要鉴权
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req: any, file, callback) => {
        try {
          // 从请求中获取用户ID
          const userId = req.user.id;
          // 创建用户专属目录
          const userUploadDir = `./public/${userId}`;
          // 检查目录是否存在，不存在则创建
          if (!existsSync(userUploadDir)) {
            mkdirSync(userUploadDir, { recursive: true });
          }
          callback(null, userUploadDir);
        } catch (error) {
          callback(new Error(`Failed to create upload directory: ${error.message}`), 'error');
        }
      },
      filename: (req: any, file, callback) => {
        const uniqueSuffix = Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 10, // 10MB限制
    },
    fileFilter: (req, file, callback) => {
      // 定义允许的文件类型
      const allowedTypes = /\.(jpg|jpeg|png|gif|pdf|doc|docx|xlsx|xls|csv|txt|rar|zip)$/;
      // 检查文件扩展名是否在允许列表中
      const ext = extname(file.originalname).toLowerCase();
      if (!allowedTypes.test(ext)) {
        callback(new HttpException('File type not allowed', HttpStatus.BAD_REQUEST), false);
        return;
      }
      // // 检查MIME类型
      // const allowedMimes = [
      //   'image/jpeg', 
      //   'image/png', 
      //   'image/gif', 
      //   'application/pdf', 
      //   'application/msword', 
      //   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      //   'application/vnd.ms-excel', 
      //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      //   'text/csv', 
      //   'text/plain', 
      //   'application/rar', 
      //   'application/zip'
      // ];
      // if (!allowedMimes.includes(file.mimetype)) {
      //   callback(new HttpException('File type not allowed', HttpStatus.BAD_REQUEST), false);
      //   return;
      // }
      callback(null, true);
    },
  }))
  uploadSingleFile(
    @Req() request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10, message: 'File size must be less than 10MB' }),
          // new FileTypeValidator({ 
          //   fileType: /\.(jpg|jpeg|png|gif|pdf|doc|docx)$/, 
          //   message: 'File type must be one of: jpg, jpeg, png, gif, pdf, doc, docx'
          // }),
        ],
        exceptionFactory: (error) => {
          console.log(error);
          return new HttpException({
            message: error || 'File upload failed',
          }, HttpStatus.BAD_REQUEST);
        },
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      return {
        message: 'File uploaded successfully',
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        path: file.path,
        userId: request.user.id
      };
    } catch (error) {
      throw new HttpException({
        message: 'File upload failed',
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}