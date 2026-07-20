import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  async create(taskId: string, dto: CreateCommentDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found.');
    }

    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        taskId,
        authorId: dto.authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await this.activityService.logActivity(
      `Added comment to task "${task.title}"`,
      dto.authorId,
      task.projectId,
      task.id,
    );

    return comment;
  }

  async findAll(taskId: string) {
    return this.prisma.comment.findMany({
      where: { taskId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async update(commentId: string, content: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        task: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    await this.activityService.logActivity(
      `Updated comment on task "${comment.task.title}"`,
      comment.authorId,
      comment.task.projectId,
      comment.task.id,
    );

    return updatedComment;
  }

  async remove(commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        task: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    await this.activityService.logActivity(
      `Deleted comment from task "${comment.task.title}"`,
      comment.authorId,
      comment.task.projectId,
      comment.task.id,
    );

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return {
      message: 'Comment deleted successfully.',
    };
  }
}