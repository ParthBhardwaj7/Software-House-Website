import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  problem?: string;

  @IsOptional()
  @IsString()
  solution?: string;

  @IsOptional()
  @IsString()
  outcome?: string;

  @IsOptional()
  @IsString()
  iconName?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
