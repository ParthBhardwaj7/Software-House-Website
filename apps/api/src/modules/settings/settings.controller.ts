import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('website')
  async getWebsite() {
    return this.settingsService.getMany([
      'websiteName',
      'contactEmail',
      'phoneNumber',
      'footerConfig',
      'tagline',
      'addressLine',
      'logoUrl',
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
