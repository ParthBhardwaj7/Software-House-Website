import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomPagesService } from './custom-pages.service';
import { CreateCustomPageDto } from './dto/create-custom-page.dto';
import { UpdateCustomPageDto } from './dto/update-custom-page.dto';

@Controller('admin/custom-pages')
@UseGuards(AuthGuard('jwt'))
export class AdminCustomPagesController {
  constructor(private customPagesService: CustomPagesService) {}

  @Get()
  findAll() {
    return this.customPagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customPagesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCustomPageDto) {
    return this.customPagesService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomPageDto) {
    return this.customPagesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customPagesService.remove(id);
  }
}
