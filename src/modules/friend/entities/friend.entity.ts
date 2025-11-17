
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '@/modules/user/entities/user.entity';

@Entity('friend')
export class FriendEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 好友关系创建人
  @Column({ type: 'varchar', length: 100 }) 
  creator: string;

  // 好友关系创建人信息
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'creator'})
  user_info: UserEntity;


  // 好友关系创建人
  @Column({ type: 'varchar', length: 100 })
  friend_id: string;

  // 好友关系创建人信息
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'friend_id'})
  friend_info: UserEntity;

  // 好友关系创建时间
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // 是否删除
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
