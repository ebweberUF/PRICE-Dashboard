import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Study } from './study.entity';
import { LabUserAccess } from './lab-user-access.entity';

@Entity('labs')
export class Lab {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'lab_code', unique: true, length: 50 })
  labCode: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'lab_admin_user_id', nullable: true })
  labAdminUserId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'lab_admin_user_id' })
  labAdmin: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, unknown>;

  @OneToMany(() => Study, (study) => study.lab)
  studies: Study[];

  @OneToMany(() => LabUserAccess, (access) => access.lab)
  userAccess: LabUserAccess[];
}
