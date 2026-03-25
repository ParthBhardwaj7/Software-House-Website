import { Controller, Get, Param } from '@nestjs/common';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Get()
  findAll() {
    return this.blogsService.findPublished();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }
}
