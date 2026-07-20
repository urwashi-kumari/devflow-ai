 import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getProjectStats(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const totalTasks = await this.prisma.task.count({
      where: {
        projectId,
      },
    });

    const todo = await this.prisma.task.count({
      where: {
        projectId,
        status: 'TODO',
      },
    });

    const inProgress = await this.prisma.task.count({
      where: {
        projectId,
        status: 'IN_PROGRESS',
      },
    });

    const done = await this.prisma.task.count({
      where: {
        projectId,
        status: 'DONE',
      },
    });

    const highPriority = await this.prisma.task.count({
      where: {
        projectId,
        priority: 'HIGH',
      },
    });

    const overdue = await this.prisma.task.count({
      where: {
        projectId,
        dueDate: {
          lt: new Date(),
        },
        status: {
          not: 'DONE',
        },
      },
    });

    const members = await this.prisma.projectMember.count({
      where: {
        projectId,
      },
    });

    return {
      totalTasks,
      todo,
      inProgress,
      done,
      highPriority,
      overdue,
      members,
    };
  }

  async getUserStats(userId: string) {
    const assignedTasks = await this.prisma.task.count({
      where: {
        assigneeId: userId,
      },
    });

    const completedTasks = await this.prisma.task.count({
      where: {
        assigneeId: userId,
        status: 'DONE',
      },
    });

    const pendingTasks = await this.prisma.task.count({
      where: {
        assigneeId: userId,
        status: {
          not: 'DONE',
        },
      },
    });

    return {
      assignedTasks,
      completedTasks,
      pendingTasks,
    };
  }

  async getRecentActivities(projectId: string) {
    return this.prisma.activity.findMany({
  where: {
    projectId,
  },
  include: {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    task: {
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
      },
    },
  },
  orderBy: {
    createdAt: 'desc',
  },
  take: 10,
});
  }
}