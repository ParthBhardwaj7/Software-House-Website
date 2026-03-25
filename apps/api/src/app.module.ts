import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { LeadsModule } from './modules/leads/leads.module';
import { ServicesModule } from './modules/services/services.module';
import { SettingsModule } from './modules/settings/settings.module';
import { TeamMembersModule } from './modules/team/team-members.module';
import { CustomPagesModule } from './modules/custom-pages/custom-pages.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    BlogsModule,
    ProjectsModule,
    TestimonialsModule,
    LeadsModule,
    ServicesModule,
    SettingsModule,
    TeamMembersModule,
    CustomPagesModule,
  ],
})
export class AppModule {}
