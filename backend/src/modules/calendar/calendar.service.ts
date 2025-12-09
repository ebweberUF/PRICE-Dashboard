import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Not, In } from 'typeorm';
import { CalendarEvent } from '../../entities/calendar-event.entity';
import { Study } from '../../entities/study.entity';
import {
  SyncEventDto,
  BulkSyncDto,
  QueryEventsDto,
  CalendarStatsResponse,
} from './dto';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  constructor(
    @InjectRepository(CalendarEvent)
    private readonly calendarRepository: Repository<CalendarEvent>,
    @InjectRepository(Study)
    private readonly studyRepository: Repository<Study>,
  ) {}

  /**
   * Sync a single event from Power Automate
   */
  async syncEvent(dto: SyncEventDto): Promise<CalendarEvent> {
    // Look up study by code if provided
    let studyId: number | null = null;
    if (dto.studyCode) {
      const study = await this.studyRepository.findOne({
        where: { studyCode: dto.studyCode },
      });
      if (study) {
        studyId = study.id;
      }
    }

    // Upsert logic - update if exists, create if not
    const existing = await this.calendarRepository.findOne({
      where: { sharepointEventId: dto.sharepointEventId },
    });

    const eventData: Partial<CalendarEvent> = {
      sharepointEventId: dto.sharepointEventId,
      title: dto.title,
      description: dto.description,
      location: dto.location,
      eventStart: new Date(dto.eventStart),
      eventEnd: new Date(dto.eventEnd),
      allDay: dto.allDay || false,
      studyId: studyId ?? undefined,
      studyCode: dto.studyCode,
      eventType: dto.eventType,
      category: dto.category,
      isRecurring: dto.isRecurring || false,
      recurrencePattern: dto.recurrencePattern,
      organizerName: dto.organizerName,
      organizerEmail: dto.organizerEmail,
      rawData: dto.rawData,
      lastSyncedAt: new Date(),
      active: true,
    };

    if (existing) {
      Object.assign(existing, eventData);
      this.logger.log(`Updated event: ${dto.sharepointEventId}`);
      return this.calendarRepository.save(existing);
    }

    const event = this.calendarRepository.create(eventData as CalendarEvent);
    this.logger.log(`Created event: ${dto.sharepointEventId}`);
    return this.calendarRepository.save(event);
  }

  /**
   * Bulk sync events from Power Automate
   */
  async bulkSync(
    dto: BulkSyncDto,
  ): Promise<{ synced: number; errors: string[] }> {
    const errors: string[] = [];
    let synced = 0;

    const syncedIds: string[] = [];

    for (const eventDto of dto.events) {
      try {
        await this.syncEvent(eventDto);
        syncedIds.push(eventDto.sharepointEventId);
        synced++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        errors.push(`Failed to sync ${eventDto.sharepointEventId}: ${errorMsg}`);
      }
    }

    // If full sync, mark events not in the sync list as inactive
    if (dto.fullSync && syncedIds.length > 0) {
      await this.calendarRepository.update(
        { sharepointEventId: Not(In(syncedIds)), active: true },
        { active: false },
      );
      this.logger.log(`Full sync: marked events not in sync list as inactive`);
    }

    this.logger.log(
      `Bulk sync completed: ${synced} synced, ${errors.length} errors`,
    );
    return { synced, errors };
  }

  /**
   * Query events with filters
   */
  async findEvents(query: QueryEventsDto): Promise<CalendarEvent[]> {
    const qb = this.calendarRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.study', 'study')
      .where('event.active = :active', { active: true });

    if (query.studyId) {
      qb.andWhere('event.studyId = :studyId', { studyId: query.studyId });
    }

    if (query.studyCode) {
      qb.andWhere('event.studyCode = :studyCode', { studyCode: query.studyCode });
    }

    if (query.startDate) {
      qb.andWhere('event.eventStart >= :startDate', {
        startDate: new Date(query.startDate),
      });
    }

    if (query.endDate) {
      qb.andWhere('event.eventEnd <= :endDate', {
        endDate: new Date(query.endDate),
      });
    }

    if (query.eventType) {
      qb.andWhere('event.eventType = :eventType', { eventType: query.eventType });
    }

    qb.orderBy('event.eventStart', 'DESC');

    if (query.limit) {
      qb.take(query.limit);
    }

    if (query.offset) {
      qb.skip(query.offset);
    }

    return qb.getMany();
  }

  /**
   * Get calendar statistics for dashboard
   */
  async getStats(year?: number, studyId?: number): Promise<CalendarStatsResponse> {
    const baseQb = this.calendarRepository
      .createQueryBuilder('event')
      .where('event.active = :active', { active: true });

    if (year) {
      baseQb.andWhere('EXTRACT(YEAR FROM event.eventStart) = :year', { year });
    }

    if (studyId) {
      baseQb.andWhere('event.studyId = :studyId', { studyId });
    }

    // Total count
    const totalEvents = await baseQb.getCount();

    // Events by study
    const byStudyQb = this.calendarRepository
      .createQueryBuilder('event')
      .select('event.studyId', 'studyId')
      .addSelect('event.studyCode', 'studyCode')
      .addSelect('study.name', 'studyName')
      .addSelect('COUNT(*)::int', 'eventCount')
      .leftJoin('event.study', 'study')
      .where('event.active = :active', { active: true });

    if (year) {
      byStudyQb.andWhere('EXTRACT(YEAR FROM event.eventStart) = :year', { year });
    }

    const byStudyRaw = await byStudyQb
      .groupBy('event.studyId')
      .addGroupBy('event.studyCode')
      .addGroupBy('study.name')
      .orderBy('"eventCount"', 'DESC')
      .getRawMany();

    // Events by month
    const byMonthQb = this.calendarRepository
      .createQueryBuilder('event')
      .select('EXTRACT(YEAR FROM event.eventStart)::int', 'year')
      .addSelect('EXTRACT(MONTH FROM event.eventStart)::int', 'month')
      .addSelect('COUNT(*)::int', 'eventCount')
      .where('event.active = :active', { active: true });

    if (studyId) {
      byMonthQb.andWhere('event.studyId = :studyId', { studyId });
    }

    const byMonthRaw = await byMonthQb
      .groupBy('EXTRACT(YEAR FROM event.eventStart)')
      .addGroupBy('EXTRACT(MONTH FROM event.eventStart)')
      .orderBy('year', 'DESC')
      .addOrderBy('month', 'DESC')
      .limit(12)
      .getRawMany();

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Events by type
    const byEventTypeQb = this.calendarRepository
      .createQueryBuilder('event')
      .select("COALESCE(event.eventType, 'Uncategorized')", 'eventType')
      .addSelect('COUNT(*)::int', 'eventCount')
      .where('event.active = :active', { active: true });

    if (year) {
      byEventTypeQb.andWhere('EXTRACT(YEAR FROM event.eventStart) = :year', { year });
    }

    if (studyId) {
      byEventTypeQb.andWhere('event.studyId = :studyId', { studyId });
    }

    const byEventTypeRaw = await byEventTypeQb
      .groupBy('event.eventType')
      .orderBy('"eventCount"', 'DESC')
      .getRawMany();

    // Date range
    const dateRangeQb = this.calendarRepository
      .createQueryBuilder('event')
      .select('MIN(event.eventStart)', 'earliest')
      .addSelect('MAX(event.eventEnd)', 'latest')
      .where('event.active = :active', { active: true });

    const dateRange = await dateRangeQb.getRawOne();

    return {
      totalEvents,
      byStudy: byStudyRaw.map((r) => ({
        studyId: r.studyId,
        studyCode: r.studyCode,
        studyName: r.studyName,
        eventCount: parseInt(r.eventCount, 10),
      })),
      byMonth: byMonthRaw.map((r) => ({
        year: r.year,
        month: r.month,
        monthName: monthNames[r.month - 1],
        eventCount: parseInt(r.eventCount, 10),
      })),
      byEventType: byEventTypeRaw.map((r) => ({
        eventType: r.eventType,
        eventCount: parseInt(r.eventCount, 10),
      })),
      dateRange: {
        earliest: dateRange?.earliest || null,
        latest: dateRange?.latest || null,
      },
    };
  }

  /**
   * Get upcoming events
   */
  async getUpcoming(limit: number = 10): Promise<CalendarEvent[]> {
    const now = new Date();
    return this.calendarRepository.find({
      where: {
        active: true,
        eventStart: MoreThanOrEqual(now),
      },
      order: { eventStart: 'ASC' },
      take: limit,
      relations: ['study'],
    });
  }

  /**
   * Get event by ID
   */
  async findById(id: number): Promise<CalendarEvent> {
    const event = await this.calendarRepository.findOne({
      where: { id },
      relations: ['study'],
    });
    if (!event) {
      throw new NotFoundException(`Calendar event with ID ${id} not found`);
    }
    return event;
  }

  /**
   * Delete (soft delete) an event by SharePoint ID
   */
  async delete(sharepointEventId: string): Promise<void> {
    const result = await this.calendarRepository.update(
      { sharepointEventId },
      { active: false },
    );
    if (result.affected === 0) {
      this.logger.warn(`Event not found for deletion: ${sharepointEventId}`);
    } else {
      this.logger.log(`Deleted event: ${sharepointEventId}`);
    }
  }
}
