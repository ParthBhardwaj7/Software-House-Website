import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { AdminServicesController } from './admin-services.controller';

@Module({
  controllers: [ServicesController, AdminServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
