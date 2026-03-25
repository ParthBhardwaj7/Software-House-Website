import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async findPublished() {
    return this.prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug, published: true },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async findAll() {
    return this.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async create(dto: CreateBlogDto) {
    return this.prisma.blogPost.create({
      data: {
        ...dto,
        slug: dto.slug || dto.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      },
    });
  }

  async update(id: string, dto: UpdateBlogDto) {
    await this.findOne(id);
    return this.prisma.blogPost.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.blogPost.delete({ where: { id } });
  }
}
