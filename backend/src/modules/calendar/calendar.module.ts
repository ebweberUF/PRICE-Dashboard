import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEvent } from '../../entities/calendar-event.entity';
import { Study } from '../../entities/study.entity';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { ApiKeyGuard } from './guards/api-key.guard';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEvent, Study])],
  providers: [CalendarService, ApiKeyGuard],
  controllers: [CalendarController],
  exports: [CalendarService],
})
export class CalendarModule {}
