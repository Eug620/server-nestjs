import { UserEntity } from '@/modules/user/entities/user.entity';

export interface UserRo {
  rows: UserEntity[];
  total: number;
}

export interface UserInfo {
  id: string
  username: string
  password: string
  email: string
  createdAt: Date
  updatedAt: Date
}