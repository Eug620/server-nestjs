import { Controller, Get, Post, Body, Patch, Param, Delete,Req, Query, UseGuards } from '@nestjs/common';
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
import { extname } from 'path';

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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB限制
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx)$/)) {
        return callback(new Error('Only image and document files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  uploadSingleFile(
    @UploadedFile(
      new ParseFilePipe({ // 暂时去除文件类型校验
        // validators: [
        //   new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
        //   new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' }),
        // ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return {
      message: 'File uploaded successfully',
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      // path: file.path,
    };
  }
}
