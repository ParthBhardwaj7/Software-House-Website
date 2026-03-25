import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  liveUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];
}
