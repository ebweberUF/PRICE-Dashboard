import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LabsService } from './labs.service';
import { CreateLabDto, UpdateLabDto } from './dto';
import { Lab, LabUserAccess } from '../../entities';

@Controller('labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  /**
   * Get all active labs
   * GET /api/labs
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Lab[]> {
    return this.labsService.findAll();
  }

  /**
   * Get lab by ID
   * GET /api/labs/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Lab> {
    return this.labsService.findById(id);
  }

  /**
   * Create a new lab
   * POST /api/labs
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLabDto: CreateLabDto): Promise<Lab> {
    return this.labsService.create(createLabDto);
  }

  /**
   * Update a lab
   * PUT /api/labs/:id
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLabDto: UpdateLabDto,
  ): Promise<Lab> {
    return this.labsService.update(id, updateLabDto);
  }

  /**
   * Deactivate a lab
   * DELETE /api/labs/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.labsService.deactivate(id);
  }

  /**
   * Get all users with access to a lab
   * GET /api/labs/:id/users
   */
  @Get(':id/users')
  @HttpCode(HttpStatus.OK)
  async getLabUsers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LabUserAccess[]> {
    return this.labsService.getLabUsers(id);
  }
}
