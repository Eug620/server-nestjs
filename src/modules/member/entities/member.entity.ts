import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
