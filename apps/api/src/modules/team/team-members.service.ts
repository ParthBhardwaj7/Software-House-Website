import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Injectable()
export class TeamMembersService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic() {
    return this.prisma.teamMember.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findAll() {
    return this.findAllPublic();
  }

  async findOne(id: string) {
    const member = await this.prisma.teamMember.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('Team member not found');
    return member;
  }

  async create(dto: CreateTeamMemberDto) {
    return this.prisma.teamMember.create({
      data: {
        name: dto.name,
        role: dto.role,
        bio: dto.bio,
        photoUrl: dto.photoUrl,
        sortOrder: dto.sortOrder ?? 0,
        linkedinUrl: dto.linkedinUrl,
        githubUrl: dto.githubUrl,
      },
    });
  }

  async update(id: string, dto: UpdateTeamMemberDto) {
    await this.findOne(id);
    return this.prisma.teamMember.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.teamMember.delete({ where: { id } });
  }
}
