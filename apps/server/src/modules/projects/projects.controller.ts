import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createProject(@Req() req: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(req.user.userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getMyProjects(@Req() req: any) {
    return this.projectsService.getMyProjects(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getProjectById(@Req() req: any, @Param('id') id: string) {
    return this.projectsService.getProjectById(req.user.userId, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateProject(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(req.user.userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteProject(@Req() req: any, @Param('id') id: string) {
    return this.projectsService.deleteProject(req.user.userId, id);
  }
}