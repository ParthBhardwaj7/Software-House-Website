import { Module } from '@nestjs/common';
import { TeamMembersController } from './team-members.controller';
import { TeamMembersService } from './team-members.service';
import { AdminTeamMembersController } from './admin-team-members.controller';

@Module({
  controllers: [TeamMembersController, AdminTeamMembersController],
  providers: [TeamMembersService],
  exports: [TeamMembersService],
})
export class TeamMembersModule {}
