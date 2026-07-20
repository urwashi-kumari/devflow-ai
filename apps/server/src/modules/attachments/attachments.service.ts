import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
  ) {}

  async create(taskId: string, dto: CreateAttachmentDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const attachment = await this.prisma.attachment.create({
      data: {
        taskId,
        fileName: dto.fileName,
        fileUrl: dto.fileUrl,
        fileSize: dto.fileSize,
      },
    });

    const project = await this.prisma.project.findUnique({
      where: { id: task.projectId },
    });

    if (project) {
      await this.activityService.logActivity(
        `Uploaded attachment "${attachment.fileName}" to task "${task.title}"`,
        project.ownerId,
        project.id,
        task.id,
      );
    }

    return attachment;
  }

  async findAll(taskId: string) {
    return this.prisma.attachment.findMany({
      where: { taskId },
      orderBy: {
        uploadedAt: 'desc',
      },
    });
  }

  async remove(attachmentId: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentId },
      include: {
        task: true,
      },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    const project = await this.prisma.project.findUnique({
      where: { id: attachment.task.projectId },
    });

    if (project) {
      await this.activityService.logActivity(
        `Deleted attachment "${attachment.fileName}" from task "${attachment.task.title}"`,
        project.ownerId,
        project.id,
        attachment.task.id,
      );
    }

    await this.prisma.attachment.delete({
      where: { id: attachmentId },
    });

    return {
      message: 'Attachment deleted successfully',
    };
  }
}