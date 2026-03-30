import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService {
  private readonly client: Razorpay | null;

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    this.client =
      keyId && keySecret ? new Razorpay({ key_id: keyId, key_secret: keySecret }) : null;
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  async createOrder(
    amountPaise: number,
    receipt: string,
    notes?: Record<string, string>,
  ): Promise<{ id: string; amount: number; currency: string; receipt: string }> {
    if (!this.client) {
      throw new ServiceUnavailableException(
        'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the API.',
      );
    }
    const order = await this.client.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt,
      notes: notes ?? {},
    });
    return {
      id: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      receipt: order.receipt ?? receipt,
    };
  }
}
