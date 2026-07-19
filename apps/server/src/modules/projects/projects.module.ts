import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProjectsService],
  exports: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}