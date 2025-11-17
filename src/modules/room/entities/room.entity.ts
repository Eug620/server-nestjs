import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '@/modules/user/entities/user.entity'
import { ApplyEntity } from '@/modules/apply/entities/apply.entity'
/**
 * 房间实体
 */
@Entity('room')
export class RoomEntity {
    @PrimaryGeneratedColumn('uuid') // 自动生成uuid
    id: string;

    // 房间名称
    @Column({ type: 'varchar', length: 100, unique: true }) // 唯一
    name: string;

    // 房间描述
    @Column({ type: 'varchar', length: 100 }) // 唯一
    description: string;

    // 创建人
    @Column({ type: 'varchar', length: 100 })
    creator: string;

    // 房间创建人信息
    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'creator'})
    user_info: UserEntity;


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;
}
