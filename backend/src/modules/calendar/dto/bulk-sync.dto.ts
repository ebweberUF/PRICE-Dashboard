import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { SyncEventDto } from './sync-event.dto';

export class BulkSyncDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncEventDto)
  events: SyncEventDto[];

  @IsOptional()
  @IsBoolean()
  fullSync?: boolean; // If true, marks missing events as inactive
}
