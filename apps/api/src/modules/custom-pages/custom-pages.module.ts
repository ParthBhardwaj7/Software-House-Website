import { Module } from '@nestjs/common';
import { CustomPagesController } from './custom-pages.controller';
import { AdminCustomPagesController } from './admin-custom-pages.controller';
import { CustomPagesService } from './custom-pages.service';

@Module({
  controllers: [CustomPagesController, AdminCustomPagesController],
  providers: [CustomPagesService],
  exports: [CustomPagesService],
})
export class CustomPagesModule {}
