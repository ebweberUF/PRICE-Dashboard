import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { StudyParticipant } from './study-participant.entity';

export type VisitStatus = 'scheduled' | 'completed' | 'missed' | 'cancelled';

/**
 * Participant Visit entity - uses RELATIVE DATES (days since enrollment).
 * No actual dates are stored.
 */
@Entity('participant_visits')
@Index('idx_visits_participant', ['participantId'])
@Index('idx_visits_status', ['status'])
export class ParticipantVisit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'participant_id' })
  participantId: number;

  @ManyToOne(() => StudyParticipant, (participant) => participant.visits)
  @JoinColumn({ name: 'participant_id' })
  participant: StudyParticipant;

  @Column({ name: 'visit_name', length: 100 })
  visitName: string;

  /**
   * Days since enrollment when visit was scheduled.
   * E.g., Week 1 = 7, Month 1 = 30.
   */
  @Column({ name: 'scheduled_day', nullable: true })
  scheduledDay: number;

  /**
   * Days since enrollment when visit was actually completed.
   * May differ from scheduledDay if visit happened early/late.
   */
  @Column({ name: 'completed_day', nullable: true })
  completedDay: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'scheduled',
  })
  status: VisitStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
