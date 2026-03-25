import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LeadsService } from './leads.service';

@Controller('admin/leads')
@UseGuards(AuthGuard('jwt'))
export class AdminLeadsController {
  constructor(private leadsService: LeadsService) {}

  @Get()
  findAll() {
    return this.leadsService.findAll();
  }
}
