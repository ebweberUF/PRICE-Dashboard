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
import { Study } from './study.entity';

export type StudyRole = 'pi' | 'coordinator' | 'researcher' | 'viewer';

@Entity('study_user_access')
@Unique(['userId', 'studyId'])
@Index('idx_study_user_access_user', ['userId'])
@Index('idx_study_user_access_study', ['studyId'])
export class StudyUserAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.studyAccess)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'study_id' })
  studyId: number;

  @ManyToOne(() => Study, (study) => study.userAccess)
  @JoinColumn({ name: 'study_id' })
  study: Study;

  @Column({
    type: 'varchar',
    length: 50,
  })
  role: StudyRole;

  @CreateDateColumn({ name: 'granted_at' })
  grantedAt: Date;

  @Column({ name: 'granted_by', nullable: true })
  grantedBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'granted_by' })
  grantedByUser: User;
}
