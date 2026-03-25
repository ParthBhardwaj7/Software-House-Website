import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        message: dto.message,
        source: dto.source,
        serviceInterest: dto.serviceInterest,
        consentAccepted: dto.consentAccepted ?? false,
      },
    });
  }

  /** Footer newsletter — idempotent per email + source */
  async createNewsletterSignup(email: string) {
    const existing = await this.prisma.lead.findFirst({
      where: { email, source: 'newsletter' },
    });
    if (existing) {
      return { ok: true as const, duplicate: true };
    }
    await this.prisma.lead.create({
      data: {
        name: 'Newsletter',
        email,
        message: 'Footer newsletter signup',
        source: 'newsletter',
        consentAccepted: false,
      },
    });
    return { ok: true as const, duplicate: false };
  }

  async findAll() {
    return this.prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
