import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateProjectDto } from './dto/create-project.dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
  ) {}

  async createProject(userId: string, dto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        githubRepo: dto.githubRepo,
        githubBranch: dto.githubBranch,
        ownerId: userId,
      },
    });

    await this.activityService.logActivity(
      `Created project "${project.name}"`,
      userId,
      project.id,
    );

    return project;
  }

  async getMyProjects(userId: string) {
    return this.prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getProjectById(userId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async updateProject(
    userId: string,
    projectId: string,
    dto: UpdateProjectDto,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const updatedProject = await this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...dto,
      },
    });

    await this.activityService.logActivity(
      `Updated project "${updatedProject.name}"`,
      userId,
      updatedProject.id,
    );

    return updatedProject;
  }

  async deleteProject(userId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.activityService.logActivity(
      `Deleted project "${project.name}"`,
      userId,
      project.id,
    );

    await this.prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return {
      message: 'Project deleted successfully',
    };
  }
}