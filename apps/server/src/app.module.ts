import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
//import { TaskDependenciesModule } from './task-dependencies/task-dependencies.module';
import { TaskDependenciesModule } from './modules/task-dependencies/task-dependencies.module';
import { ProjectMembersModule } from './modules/project-members/project-members.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    WorkspaceModule,
    ProjectsModule,
    TasksModule,
    AiModule,
    NotificationsModule,
    HealthModule,
    UsersModule,
    PrismaModule,
    TaskDependenciesModule,
    ProjectMembersModule,
    CommentsModule,
    AttachmentsModule,
  ],
})
export class AppModule {}