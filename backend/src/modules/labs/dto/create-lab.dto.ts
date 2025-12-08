import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';

export class CreateLabDto {
  @IsString()
  @MaxLength(50)
  labCode: string;

  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  labAdminUserId?: number;
}
