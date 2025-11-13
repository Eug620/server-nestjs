import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from './entities/room.entity';

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

  create(createRoomDto: CreateRoomDto) {
    return 'This action adds a new room';
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

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
