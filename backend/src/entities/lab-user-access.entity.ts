import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Lab } from './lab.entity';

export type LabRole = 'admin' | 'member' | 'viewer';

@Entity('lab_user_access')
@Unique(['userId', 'labId'])
@Index('idx_lab_user_access_user', ['userId'])
@Index('idx_lab_user_access_lab', ['labId'])
export class LabUserAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.labAccess)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'lab_id' })
  labId: number;

  @ManyToOne(() => Lab, (lab) => lab.userAccess)
  @JoinColumn({ name: 'lab_id' })
  lab: Lab;

  @Column({
    type: 'varchar',
    length: 50,
  })
  role: LabRole;

  @CreateDateColumn({ name: 'granted_at' })
  grantedAt: Date;

  @Column({ name: 'granted_by', nullable: true })
  grantedBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'granted_by' })
  grantedByUser: User;
}
