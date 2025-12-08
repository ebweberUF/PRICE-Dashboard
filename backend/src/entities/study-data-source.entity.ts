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

export type DataSourceType = 'redcap' | 'elab' | 'sharepoint' | 'xnat';

@Entity('study_data_sources')
@Index('idx_data_sources_study', ['studyId'])
export class StudyDataSource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'study_id' })
  studyId: number;

  @ManyToOne(() => Study, (study) => study.dataSources)
  @JoinColumn({ name: 'study_id' })
  study: Study;

  @Column({
    name: 'source_type',
    type: 'varchar',
    length: 50,
  })
  sourceType: DataSourceType;

  @Column({ name: 'source_name', length: 100, nullable: true })
  sourceName: string;

  /**
   * API endpoints, project IDs, field mappings, etc.
   * Does NOT contain credentials (those are in secrets.json).
   */
  @Column({ name: 'source_config', type: 'jsonb' })
  sourceConfig: Record<string, unknown>;

  /**
   * Reference to the key in secrets.json for this data source.
   * E.g., "apis.redcap.tokens.STUDY001"
   */
  @Column({ name: 'credentials_ref', length: 255, nullable: true })
  credentialsRef: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
