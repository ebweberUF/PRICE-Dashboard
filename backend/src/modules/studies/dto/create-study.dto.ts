import {
  IsString,
  IsOptional,
  IsNumber,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreateStudyDto {
  @IsNumber()
  labId: number;

  @IsString()
  @MaxLength(50)
  studyCode: string;

  @IsString()
  @MaxLength(255)
  name: string;

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
}
