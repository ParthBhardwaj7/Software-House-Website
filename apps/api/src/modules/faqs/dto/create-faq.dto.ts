import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @MaxLength(500)
  question!: string;

  @IsString()
  @MaxLength(20_000)
  answer!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
