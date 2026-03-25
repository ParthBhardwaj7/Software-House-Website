import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(3)
  message: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  serviceInterest?: string;

  @IsOptional()
  @IsBoolean()
  consentAccepted?: boolean;
}
