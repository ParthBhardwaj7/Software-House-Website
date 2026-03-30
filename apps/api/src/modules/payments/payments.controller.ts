import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  Req,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import type { Request } from 'express';
import { CreateRazorpayOrderDto } from './dto/create-razorpay-order.dto';
import { VerifyRazorpayPaymentDto } from './dto/verify-razorpay-payment.dto';
import { RazorpayService } from './razorpay.service';
import { RazorpayWebhookPersistenceService } from './razorpay-webhook-persistence.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly razorpay: RazorpayService,
    private readonly webhookPersistence: RazorpayWebhookPersistenceService,
  ) {}

  @Post('razorpay/order')
  async createRazorpayOrder(@Body() dto: CreateRazorpayOrderDto) {
    const receipt =
      dto.receipt?.trim() ||
      `wh_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`.slice(0, 40);
    const notes: Record<string, string> = {};
    if (dto.customerEmail) notes.email = dto.customerEmail;
    if (dto.customerName) notes.name = dto.customerName;
    if (dto.notes?.trim()) notes.description = dto.notes.trim();

    const order = await this.razorpay.createOrder(dto.amountPaise, receipt, notes);
    return {
      orderId: order.id,
      amountPaise: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    };
  }

  /** Confirms checkout success using Razorpay’s HMAC (orderId|paymentId). */
  @Post('razorpay/verify')
  verifyRazorpayPayment(@Body() dto: VerifyRazorpayPaymentDto) {
    const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!secret) {
      throw new ServiceUnavailableException('Payments not configured');
    }
    const body = `${dto.orderId}|${dto.paymentId}`;
    const expected = createHmac('sha256', secret).update(body).digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(dto.signature, 'utf8');
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException('Invalid payment signature');
    }
    return { ok: true };
  }

  @Post('razorpay/webhook')
  @HttpCode(200)
  handleRazorpayWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-razorpay-signature') signature: string | undefined,
  ) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
    if (!secret) {
      throw new UnauthorizedException('Webhook not configured');
    }
    if (!signature || !req.rawBody) {
      throw new UnauthorizedException('Missing webhook signature or body');
    }
    const expected = createHmac('sha256', secret).update(req.rawBody).digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(signature, 'utf8');
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(req.rawBody.toString('utf8'));
    } catch {
      this.logger.warn('Webhook body is not valid JSON after signature OK');
      return { ok: true };
    }
    if (parsed && typeof parsed === 'object' && 'event' in parsed) {
      const ev = (parsed as { event?: string }).event;
      if (ev) this.logger.log(`Webhook event: ${ev}`);
    }
    void this.webhookPersistence.persistVerifiedWebhook(parsed);
    return { ok: true };
  }
}
