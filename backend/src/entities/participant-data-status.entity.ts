import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { StudyParticipant } from './study-participant.entity';
import { ParticipantVisit } from './participant-visit.entity';

/**
 * Tracks whether data fields are complete - stores TRUE/FALSE only,
 * NOT the actual data values (which may contain PHI).
 */
@Entity('participant_data_status')
@Unique(['participantId', 'visitId', 'dataSource', 'instrumentName', 'fieldName'])
@Index('idx_data_status_participant', ['participantId'])
@Index('idx_data_status_complete', ['isComplete'])
export class ParticipantDataStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'participant_id' })
  participantId: number;

  @ManyToOne(() => StudyParticipant, (participant) => participant.dataStatus)
  @JoinColumn({ name: 'participant_id' })
  participant: StudyParticipant;

  @Column({ name: 'visit_id', nullable: true })
  visitId: number;

  @ManyToOne(() => ParticipantVisit)
  @JoinColumn({ name: 'visit_id' })
  visit: ParticipantVisit;

  @Column({ name: 'data_source', length: 50 })
  dataSource: string;

  @Column({ name: 'instrument_name', length: 100 })
  instrumentName: string;

  @Column({ name: 'field_name', length: 100 })
  fieldName: string;

  /**
   * Whether the field is complete (TRUE/FALSE).
   * Does NOT store the actual value to avoid storing PHI.
   */
  @Column({ name: 'is_complete' })
  isComplete: boolean;

  @Column({ name: 'last_checked', type: 'timestamp', default: () => 'NOW()' })
  lastChecked: Date;
}
