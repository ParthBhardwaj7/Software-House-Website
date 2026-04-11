import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { parseAndValidateFooterConfigJson } from './footer-config.validation';
import {
  parseAndValidateMarketingDeliveryJson,
  parseAndValidateMarketingHomeJson,
} from './marketing-content.validation';
import { parseAndValidateSocialLinksJson } from './social-links.validation';
import { SettingsService } from './settings.service';

const MAX_ABOUT = 100_000;
const MAX_MARKETING_HOME = 50_000;
const MAX_MARKETING_DELIVERY = 120_000;

class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  websiteName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(320)
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  phoneNumber?: string;

  /** Stringified JSON — validated server-side */
  @IsOptional()
  @IsString()
  footerConfig?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  tagline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  addressLine?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  logoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  faviconUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  siteDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  seoTitleSuffix?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_ABOUT)
  aboutPageContent?: string;

  /** "true" / "false" */
  @IsOptional()
  @IsString()
  @MaxLength(10)
  enableBoatCursor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  whatsappNumber?: string;

  @IsOptional()
  @IsString()
  socialLinks?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_MARKETING_HOME)
  marketingHomeJson?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_MARKETING_DELIVERY)
  marketingDeliveryJson?: string;
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
      'tagline',
      'addressLine',
      'logoUrl',
      'faviconUrl',
      'siteDescription',
      'seoTitleSuffix',
      'aboutPageContent',
      'enableBoatCursor',
      'whatsappNumber',
      'socialLinks',
      'marketingHomeJson',
      'marketingDeliveryJson',
    ]);
  }

  @Put()
  async update(@Body() dto: UpdateSettingsDto) {
    const data: Record<string, string> = {};
    if (dto.websiteName != null) data.websiteName = String(dto.websiteName).trim().slice(0, 200);
    if (dto.contactEmail != null) data.contactEmail = String(dto.contactEmail).trim().slice(0, 320);
    if (dto.phoneNumber != null) data.phoneNumber = String(dto.phoneNumber).trim().slice(0, 80);
    if (dto.footerConfig != null && dto.footerConfig.trim() !== '') {
      data.footerConfig = parseAndValidateFooterConfigJson(dto.footerConfig);
    }
    if (dto.tagline != null) data.tagline = String(dto.tagline).trim().slice(0, 500);
    if (dto.addressLine != null) data.addressLine = String(dto.addressLine).trim().slice(0, 500);
    if (dto.logoUrl != null) data.logoUrl = String(dto.logoUrl).trim().slice(0, 2000);
    if (dto.faviconUrl != null) data.faviconUrl = String(dto.faviconUrl).trim().slice(0, 2000);
    if (dto.siteDescription != null) data.siteDescription = String(dto.siteDescription).trim().slice(0, 500);
    if (dto.seoTitleSuffix != null) data.seoTitleSuffix = String(dto.seoTitleSuffix).trim().slice(0, 120);
    if (dto.aboutPageContent != null)
      data.aboutPageContent = String(dto.aboutPageContent).trim().slice(0, MAX_ABOUT);
    if (dto.enableBoatCursor != null) {
      const b = String(dto.enableBoatCursor).trim().toLowerCase();
      data.enableBoatCursor = b === 'true' || b === '1' || b === 'yes' ? 'true' : 'false';
    }
    if (dto.whatsappNumber != null)
      data.whatsappNumber = String(dto.whatsappNumber).trim().slice(0, 40);
    if (dto.socialLinks != null && dto.socialLinks.trim() !== '') {
      data.socialLinks = parseAndValidateSocialLinksJson(dto.socialLinks);
    }
    if (dto.marketingHomeJson != null && dto.marketingHomeJson.trim() !== '') {
      data.marketingHomeJson = parseAndValidateMarketingHomeJson(dto.marketingHomeJson);
    }
    if (dto.marketingDeliveryJson != null && dto.marketingDeliveryJson.trim() !== '') {
      data.marketingDeliveryJson = parseAndValidateMarketingDeliveryJson(dto.marketingDeliveryJson);
    }
    await this.settingsService.setMany(data);
    return this.settingsService.getMany([
      'websiteName',
      'contactEmail',
      'phoneNumber',
      'footerConfig',
      'tagline',
      'addressLine',
      'logoUrl',
      'faviconUrl',
      'siteDescription',
      'seoTitleSuffix',
      'aboutPageContent',
      'enableBoatCursor',
      'whatsappNumber',
      'socialLinks',
      'marketingHomeJson',
      'marketingDeliveryJson',
    ]);
  }
}
