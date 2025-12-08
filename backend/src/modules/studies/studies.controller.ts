import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StudiesService } from './studies.service';
import { CreateStudyDto, UpdateStudyDto } from './dto';
import { Study, StudyUserAccess } from '../../entities';

@Controller('studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  /**
   * Get all active studies
   * GET /api/studies
   * GET /api/studies?labId=1
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('labId') labId?: string): Promise<Study[]> {
    if (labId) {
      return this.studiesService.findByLab(parseInt(labId, 10));
    }
    return this.studiesService.findAll();
  }

  /**
   * Get study by ID
   * GET /api/studies/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Study> {
    return this.studiesService.findById(id);
  }

  /**
   * Get study statistics
   * GET /api/studies/:id/stats
   */
  @Get(':id/stats')
  @HttpCode(HttpStatus.OK)
  async getStudyStats(@Param('id', ParseIntPipe) id: number): Promise<{
    total: number;
    screened: number;
    enrolled: number;
    active: number;
    completed: number;
    withdrawn: number;
  }> {
    return this.studiesService.getStudyStats(id);
  }

  /**
   * Create a new study
   * POST /api/studies
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createStudyDto: CreateStudyDto): Promise<Study> {
    return this.studiesService.create(createStudyDto);
  }

  /**
   * Update a study
   * PUT /api/studies/:id
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudyDto: UpdateStudyDto,
  ): Promise<Study> {
    return this.studiesService.update(id, updateStudyDto);
  }

  /**
   * Deactivate a study
   * DELETE /api/studies/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.studiesService.deactivate(id);
  }

  /**
   * Get all users with access to a study
   * GET /api/studies/:id/users
   */
  @Get(':id/users')
  @HttpCode(HttpStatus.OK)
  async getStudyUsers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StudyUserAccess[]> {
    return this.studiesService.getStudyUsers(id);
  }
}
