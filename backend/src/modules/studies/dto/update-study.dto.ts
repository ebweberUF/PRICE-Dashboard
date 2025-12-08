import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class UpdateStudyDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  irbNumber?: string;

  @IsOptional()
  @IsNumber()
  piUserId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  enrollmentTarget?: number;

  @IsOptional()
  @IsNumber()
  @Min(2000)
  @Max(2100)
  startYear?: number;

  @IsOptional()
  @IsNumber()
  @Min(2000)
  @Max(2100)
  endYear?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
