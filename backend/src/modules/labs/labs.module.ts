import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lab, LabUserAccess } from '../../entities';
import { LabsService } from './labs.service';
import { LabsController } from './labs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lab, LabUserAccess])],
  providers: [LabsService],
  controllers: [LabsController],
  exports: [LabsService],
})
export class LabsModule {}
