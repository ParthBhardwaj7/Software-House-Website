import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateFaqDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  question?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20_000)
  answer?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
