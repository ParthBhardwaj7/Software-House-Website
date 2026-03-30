import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqsService {
  constructor(private prisma: PrismaService) {}

  findAllPublic() {
    return this.prisma.faq.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  findAllAdmin() {
    return this.prisma.faq.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.faq.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('FAQ not found');
    return row;
  }

  create(dto: CreateFaqDto) {
    return this.prisma.faq.create({
      data: {
        question: dto.question.trim(),
        answer: dto.answer.trim(),
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(id: string, dto: UpdateFaqDto) {
    await this.findOne(id);
    const data: Record<string, unknown> = {};
    if (dto.question !== undefined) data.question = dto.question.trim();
    if (dto.answer !== undefined) data.answer = dto.answer.trim();
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    return this.prisma.faq.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.faq.delete({ where: { id } });
  }
}
