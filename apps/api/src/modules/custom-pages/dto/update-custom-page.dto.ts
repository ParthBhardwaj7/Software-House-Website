import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateCustomPageDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, {
    message: 'slug: letters, numbers, hyphens only',
  })
  @MaxLength(120)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  navLabel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  headline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  subheadline?: string | null;

  @IsOptional()
  @IsBoolean()
  showInNav?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  navSortOrder?: number;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  metaTitle?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  metaDescription?: string | null;

  @IsOptional()
  @IsArray()
  blocks?: unknown[];
}
