import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { LabUserAccess } from './lab-user-access.entity';
import { StudyUserAccess } from './study-user-access.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  ufid: string;

  @Column({ length: 255 })
  email: string;

  @Column({ name: 'first_name', length: 100, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  lastName: string;

  @Column({ name: 'display_name', length: 255, nullable: true })
  displayName: string;

  @Column({ length: 100, nullable: true })
  affiliation: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => LabUserAccess, (access) => access.user)
  labAccess: LabUserAccess[];

  @OneToMany(() => StudyUserAccess, (access) => access.user)
  studyAccess: StudyUserAccess[];
}
