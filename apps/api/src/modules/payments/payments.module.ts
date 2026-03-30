import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { RazorpayService } from './razorpay.service';
import { RazorpayWebhookPersistenceService } from './razorpay-webhook-persistence.service';

@Module({
  controllers: [PaymentsController],
  providers: [RazorpayService, RazorpayWebhookPersistenceService],
})
export class PaymentsModule {}
