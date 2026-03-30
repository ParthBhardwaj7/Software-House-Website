import { IsString, MaxLength, MinLength } from 'class-validator';

export class VerifyRazorpayPaymentDto {
  @IsString()
  @MinLength(4)
  @MaxLength(64)
  orderId!: string;

  @IsString()
  @MinLength(4)
  @MaxLength(64)
  paymentId!: string;

  @IsString()
  @MinLength(4)
  @MaxLength(200)
  signature!: string;
}
