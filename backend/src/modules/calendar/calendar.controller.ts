import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ApiKeyGuard } from './guards/api-key.guard';
import {
  SyncEventDto,
  BulkSyncDto,
  QueryEventsDto,
  CalendarStatsResponse,
} from './dto';
import { CalendarEvent } from '../../entities/calendar-event.entity';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  // =========================================
  // SYNC ENDPOINTS (Protected by API Key)
  // =========================================

  /**
   * Sync a single event from Power Automate
   * POST /api/calendar/sync
   */
  @Post('sync')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async syncEvent(@Body() dto: SyncEventDto): Promise<CalendarEvent> {
    return this.calendarService.syncEvent(dto);
  }

  /**
   * Bulk sync events from Power Automate
   * POST /api/calendar/sync/bulk
   */
  @Post('sync/bulk')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async bulkSync(
    @Body() dto: BulkSyncDto,
  ): Promise<{ synced: number; errors: string[] }> {
    return this.calendarService.bulkSync(dto);
  }

  /**
   * Delete an event (mark inactive)
   * DELETE /api/calendar/sync/:sharepointEventId
   */
  @Delete('sync/:sharepointEventId')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEvent(
    @Param('sharepointEventId') sharepointEventId: string,
  ): Promise<void> {
    return this.calendarService.delete(sharepointEventId);
  }

  // =========================================
  // PUBLIC READ ENDPOINTS
  // =========================================

  /**
   * Get events with filters
   * GET /api/calendar/events
   */
  @Get('events')
  @HttpCode(HttpStatus.OK)
  async getEvents(@Query() query: QueryEventsDto): Promise<CalendarEvent[]> {
    return this.calendarService.findEvents(query);
  }

  /**
   * Get event by ID
   * GET /api/calendar/events/:id
   */
  @Get('events/:id')
  @HttpCode(HttpStatus.OK)
  async getEventById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CalendarEvent> {
    return this.calendarService.findById(id);
  }

  /**
   * Get upcoming events
   * GET /api/calendar/upcoming
   */
  @Get('upcoming')
  @HttpCode(HttpStatus.OK)
  async getUpcoming(@Query('limit') limit?: string): Promise<CalendarEvent[]> {
    return this.calendarService.getUpcoming(limit ? parseInt(limit, 10) : 10);
  }

  /**
   * Get calendar statistics for dashboard
   * GET /api/calendar/stats
   */
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats(
    @Query('year') year?: string,
    @Query('studyId') studyId?: string,
  ): Promise<CalendarStatsResponse> {
    return this.calendarService.getStats(
      year ? parseInt(year, 10) : undefined,
      studyId ? parseInt(studyId, 10) : undefined,
    );
  }
}
