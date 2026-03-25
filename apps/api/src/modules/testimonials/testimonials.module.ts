import { Module } from '@nestjs/common';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';
import { AdminTestimonialsController } from './admin-testimonials.controller';

@Module({
  controllers: [TestimonialsController, AdminTestimonialsController],
  providers: [TestimonialsService],
  exports: [TestimonialsService],
})
export class TestimonialsModule {}
