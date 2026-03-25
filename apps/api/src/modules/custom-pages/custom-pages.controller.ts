import { Controller, Get, Param } from '@nestjs/common';
import { CustomPagesService } from './custom-pages.service';

@Controller('custom-pages')
export class CustomPagesController {
  constructor(private customPagesService: CustomPagesService) {}

  @Get('nav')
  nav() {
    return this.customPagesService.findNavItems();
  }

  @Get('sitemap')
  sitemapSlugs() {
    return this.customPagesService.findPublishedSitemapSlugs();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.customPagesService.findPublishedBySlug(slug);
  }
}
