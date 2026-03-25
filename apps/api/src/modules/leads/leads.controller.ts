import { Body, Controller, Post } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { NewsletterLeadDto } from './dto/newsletter-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Post('newsletter')
  subscribeNewsletter(@Body() dto: NewsletterLeadDto) {
    return this.leadsService.createNewsletterSignup(dto.email);
  }

  @Post()
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }
}
