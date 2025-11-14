import { Injectable, HttpException } from '@nestjs/common';
import { CreateRoomDto } from '@/room/dto/create-room.dto';
import { UpdateRoomDto } from '@/room/dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '@/room/entities/room.entity';
import { UserInfo } from '@/user/user.service';

export interface RoomRo {
  list: RoomEntity[];
  count: number;
  totalPages: number;
  currentPage: number;
}

@Injectable()
export class RoomService {
  @InjectRepository(RoomEntity)
  private readonly roomRepository: Repository<RoomEntity>;

  async create(createRoomDto: CreateRoomDto, user: UserInfo): Promise<string> {
    await this.roomRepository.save(Object.assign(createRoomDto, {
      creator: user.id,
    }));
    return '创建房间成功';
  }
  async findMineAll(page: number = 1, pageSize: number = 10,user: UserInfo): Promise<RoomRo>{
        // 从数据库查询所有房间
    const [posts, totalCount] = await this.roomRepository.findAndCount({
      skip: (page - 1) * pageSize, // 分页偏移量
      take: pageSize, // 每页显示的记录数
      where: {
        creator: user.id,
      },
      order: {
        createdAt: 'ASC',
      },
      select: {
        id: true,
        name: true,
        description: true,
        creator: true,
        user_info: {
          username: true,
          email: true,
          id: true,
          createdAt: true,
          updatedAt: true
        },
        createdAt: true,
        updatedAt: true,
      },
      relations: ['user_info'],

    });
    return {
      list: posts,
      count: totalCount,
      totalPages: Math.ceil(totalCount / pageSize), // 计算总页数
      currentPage: page, // 当前页
    };
  }

  async findAll(page: number = 1, pageSize: number = 10): Promise<RoomRo> {
    // 从数据库查询所有房间
    const [posts, totalCount] = await this.roomRepository.findAndCount({
      skip: (page - 1) * pageSize, // 分页偏移量
      take: pageSize, // 每页显示的记录数
      order: {
        createdAt: 'ASC',
      },
      select: {
        id: true,
        name: true,
        description: true,
        creator: true,
        user_info: {
          username: true,
          email: true,
          id: true,
          createdAt: true,
          updatedAt: true
        },
        createdAt: true,
        updatedAt: true,
      },
      relations: ['user_info'],

    });
    return {
      list: posts,
      count: totalCount,
      totalPages: Math.ceil(totalCount / pageSize), // 计算总页数
      currentPage: page, // 当前页
    };
  }

  async findOne(id: string) {
    const room = await this.roomRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        creator: true,
        user_info: {
          username: true,
          email: true,
          id: true,
          createdAt: true,
          updatedAt: true
        },
        createdAt: true,
        updatedAt: true,
      },
      relations: ['user_info']
    });
    if (!room) {
      throw new HttpException(`id为${id}的房间不存在`, 401);
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      throw new HttpException(`id为${id}的房间不存在`, 401);
    }
    const updateRoomDtoCopy = { ...updateRoomDto };
    updateRoomDto.name && (updateRoomDtoCopy.name = updateRoomDto.name);
    updateRoomDto.description && (updateRoomDtoCopy.description = updateRoomDto.description);
    const updatePost = this.roomRepository.merge(room, updateRoomDtoCopy);
    await this.roomRepository.save(updatePost);
    return '更新房间成功'
  }

  async remove(id: string) {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      throw new HttpException(`id为${id}的房间不存在`, 401);
    }
    await this.roomRepository.remove(room);
    return '删除房间成功'
  }
}
