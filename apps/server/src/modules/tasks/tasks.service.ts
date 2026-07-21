import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createTask(dto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        projectId: dto.projectId,
      },
    });

    const project = await this.prisma.project.findUnique({
      where: {
        id: task.projectId,
      },
    });

    if (project) {
      await this.activityService.logActivity(
        `Created task "${task.title}"`,
        project.ownerId,
        project.id,
        task.id,
      );
    }

    return task;
  }

  async getTasks(projectId: string) {
    return this.prisma.task.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getTaskById(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateTask(taskId: string, dto: UpdateTaskDto) {
    await this.getTaskById(taskId);

    const updatedTask = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });

    const project = await this.prisma.project.findUnique({
      where: {
        id: updatedTask.projectId,
      },
    });

    if (project) {
      await this.activityService.logActivity(
        `Updated task "${updatedTask.title}"`,
        project.ownerId,
        project.id,
        updatedTask.id,
      );
    }

    return updatedTask;
  }

  async deleteTask(taskId: string) {
    const task = await this.getTaskById(taskId);

    const project = await this.prisma.project.findUnique({
      where: {
        id: task.projectId,
      },
    });

    if (project) {
      await this.activityService.logActivity(
        `Deleted task "${task.title}"`,
        project.ownerId,
        project.id,
        task.id,
      );
    }

    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return {
      message: 'Task deleted successfully',
    };
  }
  async assignTask(taskId: string, userId: string) {
  const task = await this.prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      project: true,
    },
  });

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  const user = await this.prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const updatedTask = await this.prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      assigneeId: userId,
    },
  });

  await this.activityService.logActivity(
    `Assigned ${user.name} to task "${task.title}"`,
    task.project.ownerId,
    task.project.id,
    task.id,
  );

  await this.notificationsService.createNotification({
    title: 'Task Assigned',
    message: `You have been assigned to "${task.title}"`,
    userId: user.id,
  });

  return updatedTask;
}

  
  async unassignTask(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        project: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (!task.assigneeId) {
      throw new NotFoundException('Task is not assigned');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: task.assigneeId,
      },
    });

    const assigneeName = user?.name ?? 'Unknown User';

    const updatedTask = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        assigneeId: null,
      },
    });

    await this.activityService.logActivity(
      `Unassigned ${assigneeName} from task "${task.title}"`,
      task.project.ownerId,
      task.project.id,
      task.id,
    );

    return updatedTask;
  }

  async getFilteredTasks(filter: TaskFilterDto) {
    const {
      projectId,
      search,
      status,
      priority,
      assigneeId,
      page = 1,
      limit = 10,
    } = filter;

    const where: Prisma.TaskWhereInput = {};

    if (projectId) {
      where.projectId = projectId;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (assigneeId) {
      where.assigneeId = assigneeId;
    }

    const [tasks, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.task.count({
        where,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      tasks,
    };
  }
}