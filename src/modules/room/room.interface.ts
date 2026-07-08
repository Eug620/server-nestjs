import { RoomEntity } from '@/modules/room/entities/room.entity';



export interface RoomRo {
  rows: RoomEntity[];
  total: number;
}