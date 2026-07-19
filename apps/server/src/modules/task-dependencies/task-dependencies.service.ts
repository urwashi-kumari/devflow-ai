import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDependencyDto } from './create-task-dependency.dto';

@Injectable()
export class TaskDependenciesService {
  constructor(private readonly prisma: PrismaService) {}

  private async hasCycle(
    currentTaskId: string,
    targetTaskId: string,
  ): Promise<boolean> {
    if (currentTaskId === targetTaskId) {
      return true;
    }

    const dependencies = await this.prisma.taskDependency.findMany({
      where: {
        taskId: currentTaskId,
      },
    });

    for (const dependency of dependencies) {
      const found = await this.hasCycle(
        dependency.dependsOnTaskId,
        targetTaskId,
      );

      if (found) {
        return true;
      }
    }

    return false;
  }

  async create(dto: CreateTaskDependencyDto) {
    if (dto.taskId === dto.dependsOnTaskId) {
      throw new BadRequestException(
        'A task cannot depend on itself.',
      );
    }

    const task = await this.prisma.task.findUnique({
      where: {
        id: dto.taskId,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const dependsOnTask = await this.prisma.task.findUnique({
      where: {
        id: dto.dependsOnTaskId,
      },
    });

    if (!dependsOnTask) {
      throw new NotFoundException('Dependency task not found');
    }

    const existing = await this.prisma.taskDependency.findUnique({
      where: {
        taskId_dependsOnTaskId: {
          taskId: dto.taskId,
          dependsOnTaskId: dto.dependsOnTaskId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Dependency already exists.',
      );
    }

    const cycle = await this.hasCycle(
      dto.dependsOnTaskId,
      dto.taskId,
    );

    if (cycle) {
      throw new BadRequestException(
        'This dependency would create a cycle.',
      );
    }

    return this.prisma.taskDependency.create({
      data: {
        taskId: dto.taskId,
        dependsOnTaskId: dto.dependsOnTaskId,
      },
    });
  }

  async findAll() {
    return this.prisma.taskDependency.findMany({
      include: {
        task: true,
        dependsOn: true,
      },
    });
  }

  async remove(id: string) {
    const dependency = await this.prisma.taskDependency.findUnique({
      where: {
        id,
      },
    });

    if (!dependency) {
      throw new NotFoundException(
        'Dependency not found',
      );
    }

    await this.prisma.taskDependency.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Dependency deleted successfully',
    };
  }

  async getExecutionOrder(projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        projectId,
      },
      include: {
        dependencies: true,
      },
    });

    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    for (const task of tasks) {
      graph.set(task.id, []);
      inDegree.set(task.id, 0);
    }

    for (const task of tasks) {
      for (const dependency of task.dependencies) {
        graph.get(dependency.dependsOnTaskId)?.push(task.id);

        inDegree.set(
          task.id,
          (inDegree.get(task.id) || 0) + 1,
        );
      }
    }

    const queue: string[] = [];

    for (const [taskId, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(taskId);
      }
    }

    const executionOrder: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;

      executionOrder.push(current);

      for (const next of graph.get(current) || []) {
        inDegree.set(
          next,
          inDegree.get(next)! - 1,
        );

        if (inDegree.get(next) === 0) {
          queue.push(next);
        }
      }
    }

    if (executionOrder.length !== tasks.length) {
      throw new BadRequestException(
        'Cycle detected in dependency graph.',
      );
    }

    return executionOrder;
  }
}