import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
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
    });
  }

  async getTaskById(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
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
}