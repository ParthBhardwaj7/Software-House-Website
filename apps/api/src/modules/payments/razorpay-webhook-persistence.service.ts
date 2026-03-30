import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type PaymentEntity = {
  id?: string;
  amount?: number;
  currency?: string;
  status?: string;
  order_id?: string | null;
  email?: string | null;
  contact?: string | null;
  method?: string | null;
};

function readPaymentEntity(body: Record<string, unknown>): PaymentEntity | null {
  const payload = body.payload;
  if (!payload || typeof payload !== 'object') return null;
  const p = payload as Record<string, unknown>;
  const wrap = p.payment;
  if (!wrap || typeof wrap !== 'object') return null;
  const ent = (wrap as { entity?: unknown }).entity;
  if (!ent || typeof ent !== 'object') return null;
  return ent as PaymentEntity;
}

@Injectable()
export class RazorpayWebhookPersistenceService {
  private readonly logger = new Logger(RazorpayWebhookPersistenceService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persists payment.* webhook payloads after signature verification.
   * Swallows DB errors so Razorpay still gets 200 (avoid endless retries for bad rows).
   */
  async persistVerifiedWebhook(body: unknown): Promise<void> {
    if (!body || typeof body !== 'object') return;
    const o = body as Record<string, unknown>;
    const event = typeof o.event === 'string' ? o.event : '';
    if (!event.startsWith('payment.')) return;

    const ent = readPaymentEntity(o);
    const id = ent?.id;
    if (!id) return;

    const amountPaise = typeof ent.amount === 'number' ? ent.amount : 0;
    const currency = typeof ent.currency === 'string' && ent.currency ? ent.currency : 'INR';
    const status = typeof ent.status === 'string' ? ent.status : 'unknown';
    const orderId =
      typeof ent.order_id === 'string' && ent.order_id ? ent.order_id : null;
    const email = typeof ent.email === 'string' ? ent.email : null;
    const contact = typeof ent.contact === 'string' ? ent.contact : null;
    const method = typeof ent.method === 'string' ? ent.method : null;

    try {
      await this.prisma.razorpayPayment.upsert({
        where: { razorpayPaymentId: id },
        create: {
          razorpayPaymentId: id,
          razorpayOrderId: orderId,
          amountPaise,
          currency,
          status,
          eventType: event,
          customerEmail: email,
          customerContact: contact,
          method,
          rawEvent: o as object,
        },
        update: {
          razorpayOrderId: orderId,
          amountPaise,
          currency,
          status,
          eventType: event,
          customerEmail: email,
          customerContact: contact,
          method,
          rawEvent: o as object,
        },
      });
    } catch (e) {
      this.logger.error(`Failed to persist Razorpay webhook ${event} ${id}`, e);
    }
  }
}
