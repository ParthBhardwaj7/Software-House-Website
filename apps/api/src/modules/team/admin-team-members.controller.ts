import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Controller('admin/team-members')
@UseGuards(AuthGuard('jwt'))
export class AdminTeamMembersController {
  constructor(private teamMembersService: TeamMembersService) {}

  @Get()
  findAll() {
    return this.teamMembersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamMembersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTeamMemberDto) {
    return this.teamMembersService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    return this.teamMembersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamMembersService.remove(id);
  }
}
