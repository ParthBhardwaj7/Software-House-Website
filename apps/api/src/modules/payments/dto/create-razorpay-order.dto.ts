import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRazorpayOrderDto {
  @Type(() => Number)
  @IsInt()
  @Min(100)
  @Max(50_000_000)
  amountPaise!: number;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  receipt?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  customerName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
