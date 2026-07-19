import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(taskId: string, dto: CreateAttachmentDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.attachment.create({
      data: {
        taskId,
        fileName: dto.fileName,
        fileUrl: dto.fileUrl,
        fileSize: dto.fileSize,
      },
    });
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
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    await this.prisma.attachment.delete({
      where: { id: attachmentId },
    });

    return {
      message: 'Attachment deleted successfully',
    };
  }
}