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