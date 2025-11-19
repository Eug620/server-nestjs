import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RoomEntity } from '@/modules/room/entities/room.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';

/**
 * 成员实体
 */
@Entity('member')
export class MemberEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 }) // 唯一
    user_id: string;

    @Column({ type: 'varchar', length: 100 }) // 唯一
    room_id: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    /**
     * 房间
     */
    @ManyToOne(() => RoomEntity, (room) => room.id, { nullable: true })
    @JoinColumn({ name: 'room_id' })
    room_info: RoomEntity;

    /**
     * 用户
     */
    @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user_info: UserEntity;
}
