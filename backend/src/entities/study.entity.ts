import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Lab } from './lab.entity';
import { User } from './user.entity';
import { StudyParticipant } from './study-participant.entity';
import { StudyUserAccess } from './study-user-access.entity';
import { StudyDataSource } from './study-data-source.entity';

@Entity('studies')
@Index('idx_studies_lab', ['labId'])
@Index('idx_studies_active', ['active'])
export class Study {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'lab_id' })
  labId: number;

  @ManyToOne(() => Lab, (lab) => lab.studies)
  @JoinColumn({ name: 'lab_id' })
  lab: Lab;

  @Column({ name: 'study_code', unique: true, length: 50 })
  studyCode: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'irb_number', length: 50, nullable: true })
  irbNumber: string;

  @Column({ name: 'pi_user_id', nullable: true })
  piUserId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'pi_user_id' })
  principalInvestigator: User;

  @Column({ name: 'enrollment_target', nullable: true })
  enrollmentTarget: number;

  @Column({ name: 'start_year', nullable: true })
  startYear: number;

  @Column({ name: 'end_year', nullable: true })
  endYear: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, unknown>;

  @OneToMany(() => StudyParticipant, (participant) => participant.study)
  participants: StudyParticipant[];

  @OneToMany(() => StudyUserAccess, (access) => access.study)
  userAccess: StudyUserAccess[];

  @OneToMany(() => StudyDataSource, (source) => source.study)
  dataSources: StudyDataSource[];
}
