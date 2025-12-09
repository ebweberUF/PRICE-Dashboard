import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsObject,
  MaxLength,
} from 'class-validator';

export class SyncEventDto {
  @IsString()
  @MaxLength(255)
  sharepointEventId: string;

  @IsString()
  @MaxLength(500)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @IsDateString()
  eventStart: string;

  @IsDateString()
  eventEnd: string;

  @IsOptional()
  @IsBoolean()
  allDay?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  studyCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  eventType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsObject()
  recurrencePattern?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  organizerName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  organizerEmail?: string;

  @IsOptional()
  @IsObject()
  rawData?: Record<string, unknown>;
}
