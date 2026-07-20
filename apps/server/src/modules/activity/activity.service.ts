import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async logActivity(
    action: string,
    userId: string,
    projectId?: string,
    taskId?: string,
  ) {
    return this.prisma.activity.create({
      data: {
        action,
        userId,
        projectId,
        taskId,
      },
    });
  }

  async getAllActivities() {
    return this.prisma.activity.findMany({
      include: {
        user: true,
        project: true,
        task: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getProjectActivities(projectId: string) {
    return this.prisma.activity.findMany({
      where: {
        projectId,
      },
      include: {
        user: true,
        task: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTaskActivities(taskId: string) {
    return this.prisma.activity.findMany({
      where: {
        taskId,
      },
      include: {
        user: true,
        project: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}