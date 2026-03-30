import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Applies Nest Throttler only to public POST endpoints that accept form-like traffic
 * (contact, newsletter, Razorpay order creation). Other routes are not rate-limited here.
 */
@Injectable()
export class PublicFormsThrottlerGuard extends ThrottlerGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{
      method?: string;
      originalUrl?: string;
      url?: string;
    }>();
    if (req.method !== 'POST') return true;
    const raw = req.originalUrl || req.url || '';
    const path = raw.split('?')[0];
    const applies =
      path === '/leads' ||
      path === '/leads/newsletter' ||
      path === '/payments/razorpay/order' ||
      path === '/payments/razorpay/verify';
    if (!applies) return true;
    return (await super.canActivate(context)) as boolean;
  }
}
