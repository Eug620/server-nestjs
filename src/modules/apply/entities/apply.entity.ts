import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
    @Column({ type: 'varchar', length: 100 })
    user_id: string;

    /**
     * 房间ID
     */
    @Column({ type: 'varchar', length: 100 })
    room_id: string;

    /**
     * 被申请用户ID
     */
    @Column({ type: 'varchar', length: 100 })
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
}
