import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lab, LabUserAccess, LabRole } from '../../entities';
import { CreateLabDto, UpdateLabDto } from './dto';

@Injectable()
export class LabsService {
  constructor(
    @InjectRepository(Lab)
    private readonly labRepository: Repository<Lab>,
    @InjectRepository(LabUserAccess)
    private readonly labUserAccessRepository: Repository<LabUserAccess>,
  ) {}

  /**
   * Find all active labs
   */
  async findAll(): Promise<Lab[]> {
    return this.labRepository.find({
      where: { active: true },
      relations: ['labAdmin'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Find labs accessible by a specific user
   */
  async findByUser(userId: number): Promise<Lab[]> {
    const access = await this.labUserAccessRepository.find({
      where: { userId },
      relations: ['lab'],
    });
    return access.map((a) => a.lab).filter((lab) => lab.active);
  }

  /**
   * Find lab by ID
   */
  async findById(id: number): Promise<Lab> {
    const lab = await this.labRepository.findOne({
      where: { id },
      relations: ['labAdmin', 'studies'],
    });
    if (!lab) {
      throw new NotFoundException(`Lab with ID ${id} not found`);
    }
    return lab;
  }

  /**
   * Find lab by code
   */
  async findByCode(labCode: string): Promise<Lab | null> {
    return this.labRepository.findOne({
      where: { labCode },
      relations: ['labAdmin'],
    });
  }

  /**
   * Create a new lab
   */
  async create(createLabDto: CreateLabDto): Promise<Lab> {
    // Check for duplicate lab code
    const existing = await this.findByCode(createLabDto.labCode);
    if (existing) {
      throw new ConflictException(
        `Lab with code ${createLabDto.labCode} already exists`,
      );
    }

    const lab = this.labRepository.create(createLabDto);
    return this.labRepository.save(lab);
  }

  /**
   * Update a lab
   */
  async update(id: number, updateLabDto: UpdateLabDto): Promise<Lab> {
    const lab = await this.findById(id);
    Object.assign(lab, updateLabDto);
    return this.labRepository.save(lab);
  }

  /**
   * Deactivate a lab (soft delete)
   */
  async deactivate(id: number): Promise<void> {
    const lab = await this.findById(id);
    lab.active = false;
    await this.labRepository.save(lab);
  }

  /**
   * Grant user access to a lab
   */
  async grantAccess(
    labId: number,
    userId: number,
    role: LabRole,
    grantedBy?: number,
  ): Promise<LabUserAccess> {
    // Check if access already exists
    const existing = await this.labUserAccessRepository.findOne({
      where: { labId, userId },
    });

    if (existing) {
      // Update existing access
      existing.role = role;
      return this.labUserAccessRepository.save(existing);
    }

    // Create new access
    const access = this.labUserAccessRepository.create({
      labId,
      userId,
      role,
      grantedBy,
    });
    return this.labUserAccessRepository.save(access);
  }

  /**
   * Revoke user access to a lab
   */
  async revokeAccess(labId: number, userId: number): Promise<void> {
    await this.labUserAccessRepository.delete({ labId, userId });
  }

  /**
   * Get user's role in a lab
   */
  async getUserRole(labId: number, userId: number): Promise<LabRole | null> {
    const access = await this.labUserAccessRepository.findOne({
      where: { labId, userId },
    });
    return access?.role || null;
  }

  /**
   * Check if user has access to a lab
   */
  async hasAccess(labId: number, userId: number): Promise<boolean> {
    const role = await this.getUserRole(labId, userId);
    return role !== null;
  }

  /**
   * Get all users with access to a lab
   */
  async getLabUsers(labId: number): Promise<LabUserAccess[]> {
    return this.labUserAccessRepository.find({
      where: { labId },
      relations: ['user'],
      order: { role: 'ASC' },
    });
  }
}
