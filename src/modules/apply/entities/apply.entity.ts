import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { RoomEntity } from '@/modules/room/entities/room.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
/**
 * 申请 实体
 */
@Entity('apply')
export class ApplyEntity {
    /**
     * 主键
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * 用户ID
     */
    @Column({ type: 'varchar', length: 100, default: '' })
    user_id: string;

    /**
     * 房间ID
     */
    @Column({ nullable: true })
    room_id: string;

    /**
     * 被申请用户ID
     */
    @Column({ nullable: true })
    apply_user_id: string;

    /**
     * 申请状态
     */
    @Column({ type: 'boolean', default: false })
    status: boolean;

    /**
     * 创建时间
     */
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    /**
     * 处理状态
     */
    @Column({ type: 'boolean', default: false })
    handle_status: boolean;

    /**
     * 更新时间
     */
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    /**
     * 删除状态
     */
    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    /**
     * 用户信息
     */
    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user_info: UserEntity;

    /**
     * 房间
     */
    @ManyToOne(() => RoomEntity, (room) => room.id, { nullable: true })
    @JoinColumn({ name: 'room_id' })
    room_info: RoomEntity;

    /**
     * 被申请用户
     */
    @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
    @JoinColumn({ name: 'apply_user_id' })
    apply_user_info: UserEntity;
}
