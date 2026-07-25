import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { unlink } from 'fs/promises';
import { basename, join } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
  ) {}

  async create(
    taskId: string,
    file: Express.Multer.File,
    dto: CreateAttachmentDto,
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const attachment = await this.prisma.attachment.create({
      data: {
        taskId,
        uploaderId: dto.uploaderId,
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        mimeType: file.mimetype,
        fileSize: file.size,
      },
    });

    await this.activityService.logActivity(
      `Uploaded attachment "${attachment.fileName}" to task "${task.title}"`,
      dto.uploaderId,
      task.projectId,
      task.id,
    );

    return attachment;
  }

  async findAll(taskId: string) {
    return this.prisma.attachment.findMany({
      where: { taskId },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });
  }

  async remove(attachmentId: string, userId: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentId },
      include: {
        task: true,
      },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    if (attachment.uploaderId !== userId) {
      throw new ForbiddenException('Only the uploader can delete this attachment');
    }

    await this.activityService.logActivity(
      `Deleted attachment "${attachment.fileName}" from task "${attachment.task.title}"`,
      attachment.uploaderId,
      attachment.task.projectId,
      attachment.task.id,
    );

    await this.prisma.attachment.delete({
      where: { id: attachmentId },
    });

    try {
      await unlink(
        join(process.cwd(), 'uploads', basename(attachment.fileUrl)),
      );
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    return {
      message: 'Attachment deleted successfully',
    };
  }
}
