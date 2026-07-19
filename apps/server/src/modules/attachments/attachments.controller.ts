import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Controller()
export class AttachmentsController {
  constructor(
    private readonly attachmentsService: AttachmentsService,
  ) {}

  @Post('tasks/:taskId/attachments')
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateAttachmentDto,
  ) {
    return this.attachmentsService.create(taskId, dto);
  }

  @Get('tasks/:taskId/attachments')
  findAll(
    @Param('taskId') taskId: string,
  ) {
    return this.attachmentsService.findAll(taskId);
  }

  @Delete('attachments/:attachmentId')
  remove(
    @Param('attachmentId') attachmentId: string,
  ) {
    return this.attachmentsService.remove(attachmentId);
  }
}