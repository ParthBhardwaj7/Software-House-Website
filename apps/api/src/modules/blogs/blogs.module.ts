import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { AdminBlogsController } from './admin-blogs.controller';

@Module({
  controllers: [BlogsController, AdminBlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
