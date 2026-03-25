import { Controller, Get } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';

@Controller('team-members')
export class TeamMembersController {
  constructor(private teamMembersService: TeamMembersService) {}

  @Get()
  findAll() {
    return this.teamMembersService.findAllPublic();
  }
}
