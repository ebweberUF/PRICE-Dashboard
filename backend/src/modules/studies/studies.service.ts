import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Study, StudyUserAccess, StudyRole } from '../../entities';
import { CreateStudyDto, UpdateStudyDto } from './dto';

@Injectable()
export class StudiesService {
  constructor(
    @InjectRepository(Study)
    private readonly studyRepository: Repository<Study>,
    @InjectRepository(StudyUserAccess)
    private readonly studyUserAccessRepository: Repository<StudyUserAccess>,
  ) {}

  /**
   * Find all active studies
   */
  async findAll(): Promise<Study[]> {
    return this.studyRepository.find({
      where: { active: true },
      relations: ['lab', 'principalInvestigator'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Find studies by lab
   */
  async findByLab(labId: number): Promise<Study[]> {
    return this.studyRepository.find({
      where: { labId, active: true },
      relations: ['principalInvestigator'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Find studies accessible by a specific user
   */
  async findByUser(userId: number): Promise<Study[]> {
    const access = await this.studyUserAccessRepository.find({
      where: { userId },
      relations: ['study', 'study.lab'],
    });
    return access.map((a) => a.study).filter((study) => study.active);
  }

  /**
   * Find study by ID
   */
  async findById(id: number): Promise<Study> {
    const study = await this.studyRepository.findOne({
      where: { id },
      relations: ['lab', 'principalInvestigator', 'participants', 'dataSources'],
    });
    if (!study) {
      throw new NotFoundException(`Study with ID ${id} not found`);
    }
    return study;
  }

  /**
   * Find study by code
   */
  async findByCode(studyCode: string): Promise<Study | null> {
    return this.studyRepository.findOne({
      where: { studyCode },
      relations: ['lab', 'principalInvestigator'],
    });
  }

  /**
   * Create a new study
   */
  async create(createStudyDto: CreateStudyDto): Promise<Study> {
    // Check for duplicate study code
    const existing = await this.findByCode(createStudyDto.studyCode);
    if (existing) {
      throw new ConflictException(
        `Study with code ${createStudyDto.studyCode} already exists`,
      );
    }

    const study = this.studyRepository.create(createStudyDto);
    return this.studyRepository.save(study);
  }

  /**
   * Update a study
   */
  async update(id: number, updateStudyDto: UpdateStudyDto): Promise<Study> {
    const study = await this.findById(id);
    Object.assign(study, updateStudyDto);
    return this.studyRepository.save(study);
  }

  /**
   * Deactivate a study (soft delete)
   */
  async deactivate(id: number): Promise<void> {
    const study = await this.findById(id);
    study.active = false;
    await this.studyRepository.save(study);
  }

  /**
   * Grant user access to a study
   */
  async grantAccess(
    studyId: number,
    userId: number,
    role: StudyRole,
    grantedBy?: number,
  ): Promise<StudyUserAccess> {
    // Check if access already exists
    const existing = await this.studyUserAccessRepository.findOne({
      where: { studyId, userId },
    });

    if (existing) {
      // Update existing access
      existing.role = role;
      return this.studyUserAccessRepository.save(existing);
    }

    // Create new access
    const access = this.studyUserAccessRepository.create({
      studyId,
      userId,
      role,
      grantedBy,
    });
    return this.studyUserAccessRepository.save(access);
  }

  /**
   * Revoke user access to a study
   */
  async revokeAccess(studyId: number, userId: number): Promise<void> {
    await this.studyUserAccessRepository.delete({ studyId, userId });
  }

  /**
   * Get user's role in a study
   */
  async getUserRole(studyId: number, userId: number): Promise<StudyRole | null> {
    const access = await this.studyUserAccessRepository.findOne({
      where: { studyId, userId },
    });
    return access?.role || null;
  }

  /**
   * Check if user has access to a study
   */
  async hasAccess(studyId: number, userId: number): Promise<boolean> {
    const role = await this.getUserRole(studyId, userId);
    return role !== null;
  }

  /**
   * Get all users with access to a study
   */
  async getStudyUsers(studyId: number): Promise<StudyUserAccess[]> {
    return this.studyUserAccessRepository.find({
      where: { studyId },
      relations: ['user'],
      order: { role: 'ASC' },
    });
  }

  /**
   * Get study statistics (participant counts by status)
   */
  async getStudyStats(id: number): Promise<{
    total: number;
    screened: number;
    enrolled: number;
    active: number;
    completed: number;
    withdrawn: number;
  }> {
    const study = await this.studyRepository.findOne({
      where: { id },
      relations: ['participants'],
    });

    if (!study) {
      throw new NotFoundException(`Study with ID ${id} not found`);
    }

    const participants = study.participants || [];

    return {
      total: participants.length,
      screened: participants.filter((p) => p.status === 'screened').length,
      enrolled: participants.filter((p) => p.status === 'enrolled').length,
      active: participants.filter((p) => p.status === 'active').length,
      completed: participants.filter((p) => p.status === 'completed').length,
      withdrawn: participants.filter((p) => p.status === 'withdrawn').length,
    };
  }
}
