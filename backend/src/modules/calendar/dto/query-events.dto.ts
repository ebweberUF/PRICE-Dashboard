import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryEventsDto {
  @IsOptional()
  @IsString()
  studyCode?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  studyId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  eventType?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  offset?: number;
}
