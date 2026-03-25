import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomPageDto } from './dto/create-custom-page.dto';
import { UpdateCustomPageDto } from './dto/update-custom-page.dto';
import {
  assertSlugAllowed,
  parseAndValidateBlocks,
} from './custom-pages.blocks';

@Injectable()
export class CustomPagesService {
  constructor(private prisma: PrismaService) {}

  private normalizeSlug(slug: string): string {
    return slug.trim().toLowerCase();
  }

  async findNavItems() {
    return this.prisma.customPage.findMany({
      where: { published: true, showInNav: true },
      orderBy: [{ navSortOrder: 'asc' }, { navLabel: 'asc' }],
      select: { slug: true, navLabel: true, navSortOrder: true },
    });
  }

  async findPublishedSitemapSlugs() {
    const rows = await this.prisma.customPage.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    return rows;
  }

  async findPublishedBySlug(slug: string) {
    const s = this.normalizeSlug(slug);
    const page = await this.prisma.customPage.findFirst({
      where: { slug: s, published: true },
    });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async findAll() {
    return this.prisma.customPage.findMany({
      orderBy: [{ navSortOrder: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const page = await this.prisma.customPage.findUnique({ where: { id } });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async create(dto: CreateCustomPageDto) {
    const slug = this.normalizeSlug(dto.slug);
    assertSlugAllowed(slug);
    const blocks = parseAndValidateBlocks(dto.blocks);
    return this.prisma.customPage.create({
      data: {
        slug,
        navLabel: dto.navLabel.trim(),
        headline: dto.headline.trim(),
        subheadline: dto.subheadline?.trim() || null,
        showInNav: dto.showInNav ?? true,
        navSortOrder: dto.navSortOrder ?? 0,
        published: dto.published ?? false,
        metaTitle: dto.metaTitle?.trim() || null,
        metaDescription: dto.metaDescription?.trim() || null,
        blocks,
      },
    });
  }

  async update(id: string, dto: UpdateCustomPageDto) {
    await this.findOne(id);
    const data: Prisma.CustomPageUpdateInput = {};

    if (dto.slug !== undefined) {
      const slug = this.normalizeSlug(dto.slug);
      assertSlugAllowed(slug);
      const existing = await this.prisma.customPage.findUnique({
        where: { id },
        select: { slug: true },
      });
      if (existing && existing.slug !== slug) {
        const clash = await this.prisma.customPage.findUnique({
          where: { slug },
        });
        if (clash && clash.id !== id) throw new ConflictException('Slug already in use');
      }
      data.slug = slug;
    }
    if (dto.navLabel !== undefined) data.navLabel = dto.navLabel.trim();
    if (dto.headline !== undefined) data.headline = dto.headline.trim();
    if (dto.subheadline !== undefined)
      data.subheadline =
        dto.subheadline === null || dto.subheadline === ''
          ? null
          : dto.subheadline.trim();
    if (dto.showInNav !== undefined) data.showInNav = dto.showInNav;
    if (dto.navSortOrder !== undefined) data.navSortOrder = dto.navSortOrder;
    if (dto.published !== undefined) data.published = dto.published;
    if (dto.metaTitle !== undefined)
      data.metaTitle =
        dto.metaTitle === null || dto.metaTitle === ''
          ? null
          : dto.metaTitle.trim();
    if (dto.metaDescription !== undefined)
      data.metaDescription =
        dto.metaDescription === null || dto.metaDescription === ''
          ? null
          : dto.metaDescription.trim();
    if (dto.blocks !== undefined) data.blocks = parseAndValidateBlocks(dto.blocks);

    return this.prisma.customPage.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.customPage.delete({ where: { id } });
  }
}
