
import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';


@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid') // 自动生成uuid
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true }) // 唯一
    username: string;

    @Column({ type: 'varchar', length: 100 })
    password: string;

    @Column({ type: 'varchar', length: 100, unique: true }) // 唯一
    email: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
