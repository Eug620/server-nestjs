import { RoomEntity } from '@/modules/room/entities/room.entity';



export interface RoomRo {
  list: RoomEntity[];
  count: number;
  totalPages: number;
  currentPage: number;
}