import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

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
