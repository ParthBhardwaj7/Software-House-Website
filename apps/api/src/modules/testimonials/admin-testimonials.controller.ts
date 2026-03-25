import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Controller('admin/testimonials')
@UseGuards(AuthGuard('jwt'))
export class AdminTestimonialsController {
  constructor(private testimonialsService: TestimonialsService) {}

  @Get()
  findAll() {
    return this.testimonialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }
}
