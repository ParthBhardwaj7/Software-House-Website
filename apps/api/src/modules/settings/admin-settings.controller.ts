import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsOptional, IsString } from 'class-validator';
import { parseAndValidateFooterConfigJson } from './footer-config.validation';
import { SettingsService } from './settings.service';

class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  websiteName?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  /** Stringified JSON — validated server-side */
  @IsOptional()
  @IsString()
  footerConfig?: string;
}

@Controller('admin/settings')
@UseGuards(AuthGuard('jwt'))
export class AdminSettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  async get() {
    return this.settingsService.getMany([
      'websiteName',
      'contactEmail',
      'phoneNumber',
      'footerConfig',
    ]);
  }

  @Put()
  async update(@Body() dto: UpdateSettingsDto) {
    const data: Record<string, string> = {};
    if (dto.websiteName != null) data.websiteName = String(dto.websiteName);
    if (dto.contactEmail != null) data.contactEmail = String(dto.contactEmail);
    if (dto.phoneNumber != null) data.phoneNumber = String(dto.phoneNumber);
    if (dto.footerConfig != null && dto.footerConfig.trim() !== '') {
      data.footerConfig = parseAndValidateFooterConfigJson(dto.footerConfig);
    }
    await this.settingsService.setMany(data);
    return this.settingsService.getMany([
      'websiteName',
      'contactEmail',
      'phoneNumber',
      'footerConfig',
    ]);
  }
}
