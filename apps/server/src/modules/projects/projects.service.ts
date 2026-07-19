import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(userId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        githubRepo: dto.githubRepo,
        githubBranch: dto.githubBranch,
        organizationId: dto.organizationId,
        ownerId: userId,
      },
    });
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

    return this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...dto,
      },
    });
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