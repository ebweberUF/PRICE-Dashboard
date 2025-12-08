import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Lab } from './lab.entity';
import { Study } from './study.entity';

/**
 * Audit log for user actions.
 * Tracks what users do in the system (NOT individual PHI access
 * since we only store coded IDs).
 */
@Entity('audit_log')
@Index('idx_audit_user', ['userId'])
@Index('idx_audit_timestamp', ['timestamp'])
@Index('idx_audit_study', ['studyId'])
@Index('idx_audit_lab', ['labId'])
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 100 })
  action: string;

  @Column({ name: 'resource_type', length: 50, nullable: true })
  resourceType: string;

  @Column({ name: 'resource_id', nullable: true })
  resourceId: number;

  @Column({ name: 'lab_id', nullable: true })
  labId: number;

  @ManyToOne(() => Lab)
  @JoinColumn({ name: 'lab_id' })
  lab: Lab;

  @Column({ name: 'study_id', nullable: true })
  studyId: number;

  @ManyToOne(() => Study)
  @JoinColumn({ name: 'study_id' })
  study: Study;

  @Column({ name: 'ip_address', type: 'inet', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, unknown>;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  timestamp: Date;
}
