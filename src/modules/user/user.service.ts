import { Injectable, HttpException } from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';


import { UserEntity } from '@/modules/user/entities/user.entity';

export interface UserRo {
  list: UserEntity[];
  count: number;
  totalPages: number;
  currentPage: number;
}

export interface UserInfo {
  id: string
  username: string
  password: string
  email: string
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService, // 注入 JWT 服务
    private configService: ConfigService, // 注入配置服务
    
  ) { }

  async findeByWhere(where: object, errMsg: string) {
    try {
    const queryUser = await this.userRepository.findOne({ where: { ...where } });
    if (queryUser) {
      throw new HttpException(errMsg, 401);
    }
    }catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, 401);
    }

  }

  async create(createUserDto: CreateUserDto): Promise<string> {
    await this.findeByWhere({ username: createUserDto.username }, '用户名已存在');
    await this.findeByWhere({ email: createUserDto.email }, '邮箱已被注册');

    await this.userRepository.save(Object.assign(createUserDto, {
      password: await bcrypt.hash(createUserDto.password, 8)
    }));
    return '创建用户成功'

  }

  async findAll(page: number = 1, pageSize: number = 10): Promise<UserRo> {
    const [posts, totalCount] = await this.userRepository.findAndCount({
      skip: (page - 1) * pageSize, // 分页偏移量
      take: pageSize, // 每页显示的记录数
      order: { createdAt: 'DESC' },
      where: { isDeleted: false },
      select: ['username', 'id', 'email', 'createdAt', 'updatedAt']
    });

    return {
      list: posts,
      count: totalCount,
      totalPages: Math.ceil(totalCount / pageSize), // 计算总页数
      currentPage: page, // 当前页
    };
  }

  async findOne(id: string): Promise<UserInfo> {
    const userInfo = await this.userRepository.findOne({ where: { id, isDeleted: false }, select: ['username', 'id', 'email', 'createdAt', 'updatedAt'] })
    if (!userInfo) {
      throw new HttpException('该用户不存在', 401);
    }
    return userInfo
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: UserInfo) {
    const existUser = await this.userRepository.findOne({ where: { id, isDeleted: false } });
    if (!existUser) {
      throw new HttpException(`id为${id}的用户不存在`, 401);
    }

    if (user.id !== id) {
      throw new HttpException('您没有权限更新该用户', 401);
    }

    const updateUserDtoCopy = { ...updateUserDto };
    updateUserDto.username && await this.findeByWhere({ username: updateUserDto.username }, '用户名已存在');
    updateUserDto.email && await this.findeByWhere({ email: updateUserDto.email }, '邮箱已被注册');
    updateUserDto.password && (updateUserDtoCopy.password = await bcrypt.hash(updateUserDto.password, 8));
    
    const updatePost = this.userRepository.merge(existUser, updateUserDtoCopy);
    await this.userRepository.save(updatePost);
    return '更新用户成功'
  }

  async remove(id: string) {
    const existUser = await this.userRepository.findOne({ where: { id, isDeleted: false } });
    if (!existUser) {
      throw new HttpException(`id为${id}的用户不存在`, 401);
    }
    existUser.isDeleted = true;
    await this.userRepository.save(existUser);
    return '删除用户成功'
  }


  /**
   * 验证用户并生成 Token
   * @param username 用户名
   * @param password 密码
   */
  async login(username: string, password: string) {
    // 1. 查询用户是否存在
    const user = await this.userRepository.findOne({ where: { username, isDeleted: false } });
    if (!user) {
      throw new HttpException('用户名或密码错误', 401);
    }

    // 2. 验证密码（假设密码在数据库中是加密存储的）
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('用户名或密码错误', 401);
    }

    
    // 4. 生成并返回 Token
    return Object.assign(user,{
      // 3. 生成 JWT  payload（存储用户关键信息，避免敏感数据）
      access_token: this.jwtService.sign({ id: user.id, username: user.username }), // 生成 Token
      token_type: 'Bearer',
      expires_in: this.configService.get('JWT_EXPIRES_IN'), // 与 JWT 配置的过期时间一致（秒）
      password: undefined,
      isDeleted: undefined,
    });

  }

}
