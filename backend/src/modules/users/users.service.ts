import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Find all active users
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { active: true },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Find user by UFID (from Shibboleth)
   */
  async findByUfid(ufid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { ufid } });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Create or update user from Shibboleth login
   */
  async upsertFromShibboleth(shibbolethData: {
    ufid: string;
    email: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    affiliation?: string;
  }): Promise<User> {
    let user = await this.findByUfid(shibbolethData.ufid);

    if (user) {
      // Update existing user
      user.email = shibbolethData.email;
      user.firstName = shibbolethData.firstName || user.firstName;
      user.lastName = shibbolethData.lastName || user.lastName;
      user.displayName = shibbolethData.displayName || user.displayName;
      user.affiliation = shibbolethData.affiliation || user.affiliation;
      user.lastLogin = new Date();
    } else {
      // Create new user
      user = this.userRepository.create({
        ...shibbolethData,
        lastLogin: new Date(),
        active: true,
      });
    }

    return this.userRepository.save(user);
  }

  /**
   * Update user's last login timestamp
   */
  async updateLastLogin(id: number): Promise<void> {
    await this.userRepository.update(id, { lastLogin: new Date() });
  }

  /**
   * Deactivate a user (soft delete)
   */
  async deactivate(id: number): Promise<void> {
    const user = await this.findById(id);
    user.active = false;
    await this.userRepository.save(user);
  }

  /**
   * Reactivate a user
   */
  async reactivate(id: number): Promise<void> {
    await this.userRepository.update(id, { active: true });
  }
}
