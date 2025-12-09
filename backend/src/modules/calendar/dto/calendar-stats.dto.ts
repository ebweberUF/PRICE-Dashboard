export interface StudyEventCount {
  studyId: number | null;
  studyCode: string | null;
  studyName: string | null;
  eventCount: number;
}

export interface MonthlyEventCount {
  year: number;
  month: number;
  monthName: string;
  eventCount: number;
}

export interface EventTypeCount {
  eventType: string;
  eventCount: number;
}

export interface CalendarStatsResponse {
  totalEvents: number;
  byStudy: StudyEventCount[];
  byMonth: MonthlyEventCount[];
  byEventType: EventTypeCount[];
  dateRange: {
    earliest: Date | null;
    latest: Date | null;
  };
}
