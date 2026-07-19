import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TaskDependenciesController } from './task-dependencies.controller';
import { TaskDependenciesService } from './task-dependencies.service';

@Module({
  imports: [PrismaModule],
  controllers: [TaskDependenciesController],
  providers: [TaskDependenciesService],
})
export class TaskDependenciesModule {}