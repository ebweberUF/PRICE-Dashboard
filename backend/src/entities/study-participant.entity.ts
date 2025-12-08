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
  Unique,
} from 'typeorm';
import { Study } from './study.entity';
import { ParticipantVisit } from './participant-visit.entity';
import { ParticipantDataStatus } from './participant-data-status.entity';

export type ParticipantStatus =
  | 'screened'
  | 'enrolled'
  | 'active'
  | 'withdrawn'
  | 'completed';

/**
 * Study Participant entity - uses CODED IDs and RELATIVE DATES only.
 * No PHI is stored in this entity.
 */
@Entity('study_participants')
@Unique(['studyId', 'subjectId'])
@Index('idx_participants_study', ['studyId'])
@Index('idx_participants_subject', ['subjectId'])
@Index('idx_participants_status', ['status'])
export class StudyParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'study_id' })
  studyId: number;

  @ManyToOne(() => Study, (study) => study.participants)
  @JoinColumn({ name: 'study_id' })
  study: Study;

  /**
   * Coded subject ID (e.g., "PAIN001", "CP-042") - NOT a real identifier.
   * This is the REDCap record_id or similar coded identifier.
   */
  @Column({ name: 'subject_id', length: 50 })
  subjectId: string;

  /**
   * Always 0 - enrollment is Day 0.
   * All other dates are relative to this baseline.
   */
  @Column({ name: 'enrollment_day', default: 0 })
  enrollmentDay: number;

  /**
   * Age in years at enrollment (NOT date of birth).
   * The date of birth is never stored.
   */
  @Column({ name: 'age_at_enrollment', nullable: true })
  ageAtEnrollment: number;

  @Column({ length: 20, nullable: true })
  gender: string;

  @Column({ name: 'race_ethnicity', length: 100, nullable: true })
  raceEthnicity: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'screened',
  })
  status: ParticipantStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ParticipantVisit, (visit) => visit.participant)
  visits: ParticipantVisit[];

  @OneToMany(() => ParticipantDataStatus, (status) => status.participant)
  dataStatus: ParticipantDataStatus[];
}
