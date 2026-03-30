import { Controller, Get } from '@nestjs/common';
import { FaqsService } from './faqs.service';

@Controller('faqs')
export class FaqsController {
  constructor(private faqsService: FaqsService) {}

  @Get()
  findAll() {
    return this.faqsService.findAllPublic();
  }
}
