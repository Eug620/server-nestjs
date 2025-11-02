import { Injectable, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';


import { UserEntity } from './entities/user.entity';

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
        private configService: ConfigService
    
  ) { }

  async create(createUserDto: CreateUserDto): Promise<string> {
    const queryUserByName = await this.userRepository.findOne({ where: { username: createUserDto.username } });
    if (queryUserByName) {
      throw new HttpException('用户名已存在', 401);
    }
    const queryUserByEmail = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (queryUserByEmail) {
      throw new HttpException('邮箱已被注册', 401);
    }

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
    const userInfo = await this.userRepository.findOne({ where: { id }, select: ['username', 'id', 'email', 'createdAt', 'updatedAt'] })
    if (!userInfo) {
      throw new HttpException('该用户不存在', 401);
    }
    return userInfo
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existUser = await this.userRepository.findOne({ where: { id } });
    if (!existUser) {
      throw new HttpException(`id为${id}的用户不存在`, 401);
    }
    const updatePost = this.userRepository.merge(existUser, updateUserDto);
    await this.userRepository.save(updatePost);
    return '更新用户成功'
  }

  async remove(id: string) {
    const existUser = await this.userRepository.findOne({ where: { id } });
    if (!existUser) {
      throw new HttpException(`id为${id}的用户不存在`, 401);
    }
    await this.userRepository.remove(existUser);
    return '删除用户成功'
  }


  /**
   * 验证用户并生成 Token
   * @param username 用户名
   * @param password 密码
   */
  async login(username: string, password: string) {
    // 1. 查询用户是否存在
    const user = await this.userRepository.findOne({ where: { username } });;
    if (!user) {
      throw new HttpException('用户名或密码错误', 401);
    }

    // 2. 验证密码（假设密码在数据库中是加密存储的）
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('用户名或密码错误', 401);
    }

    // 3. 生成 JWT  payload（存储用户关键信息，避免敏感数据）
    const payload = { id: user.id, username: user.username };

    // 4. 生成并返回 Token
    return {
      access_token: this.jwtService.sign(payload), // 生成 Token
      token_type: 'Bearer',
      expires_in: 60, // 与 JWT 配置的过期时间一致（秒）
    };

  }

}
