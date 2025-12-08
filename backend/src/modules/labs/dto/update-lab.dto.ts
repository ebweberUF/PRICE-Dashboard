import { IsString, IsOptional, IsNumber, IsBoolean, MaxLength } from 'class-validator';

export class UpdateLabDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  labAdminUserId?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
