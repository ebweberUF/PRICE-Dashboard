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
import { Study } from './study.entity';

@Entity('calendar_events')
@Index('idx_calendar_events_study', ['studyId'])
@Index('idx_calendar_events_study_code', ['studyCode'])
@Index('idx_calendar_events_start', ['eventStart'])
@Index('idx_calendar_events_type', ['eventType'])
@Index('idx_calendar_events_active', ['active'])
export class CalendarEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sharepoint_event_id', unique: true, length: 255 })
  sharepointEventId: string;

  @Column({ length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500, nullable: true })
  location: string;

  @Column({ name: 'event_start', type: 'timestamptz' })
  eventStart: Date;

  @Column({ name: 'event_end', type: 'timestamptz' })
  eventEnd: Date;

  @Column({ name: 'all_day', default: false })
  allDay: boolean;

  @Column({ name: 'study_id', nullable: true })
  studyId: number;

  @ManyToOne(() => Study, { nullable: true })
  @JoinColumn({ name: 'study_id' })
  study: Study;

  @Column({ name: 'study_code', length: 50, nullable: true })
  studyCode: string;

  @Column({ name: 'event_type', length: 100, nullable: true })
  eventType: string;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ name: 'is_recurring', default: false })
  isRecurring: boolean;

  @Column({ name: 'recurrence_pattern', type: 'jsonb', nullable: true })
  recurrencePattern: Record<string, unknown>;

  @Column({ name: 'organizer_name', length: 255, nullable: true })
  organizerName: string;

  @Column({ name: 'organizer_email', length: 255, nullable: true })
  organizerEmail: string;

  @Column({ name: 'last_synced_at', type: 'timestamptz', default: () => 'NOW()' })
  lastSyncedAt: Date;

  @Column({ name: 'sync_source', length: 50, default: 'power_automate' })
  syncSource: string;

  @Column({ name: 'raw_data', type: 'jsonb', nullable: true })
  rawData: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: true })
  active: boolean;
}
