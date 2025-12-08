import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Study, StudyUserAccess, StudyDataSource } from '../../entities';
import { StudiesService } from './studies.service';
import { StudiesController } from './studies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Study, StudyUserAccess, StudyDataSource])],
  providers: [StudiesService],
  controllers: [StudiesController],
  exports: [StudiesService],
})
export class StudiesModule {}
