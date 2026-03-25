import { Controller, Get } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private testimonialsService: TestimonialsService) {}

  @Get()
  findAll() {
    return this.testimonialsService.findAll();
  }
}
