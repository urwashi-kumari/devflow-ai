import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@ApiTags('Attachments')
@ApiBearerAuth()
@Controller()
export class AttachmentsController {
  constructor(
    private readonly attachmentsService: AttachmentsService,
  ) {}

  @Post('tasks/:taskId/attachments')
  @ApiOperation({ summary: 'Add an attachment to a task' })
  @ApiResponse({
    status: 201,
    description: 'Attachment added successfully.',
  })
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateAttachmentDto,
  ) {
    return this.attachmentsService.create(taskId, dto);
  }

  @Get('tasks/:taskId/attachments')
  @ApiOperation({ summary: 'Get all attachments for a task' })
  @ApiResponse({
    status: 200,
    description: 'Attachments retrieved successfully.',
  })
  findAll(@Param('taskId') taskId: string) {
    return this.attachmentsService.findAll(taskId);
  }

  @Delete('attachments/:attachmentId')
  @ApiOperation({ summary: 'Delete an attachment' })
  @ApiResponse({
    status: 200,
    description: 'Attachment deleted successfully.',
  })
  remove(@Param('attachmentId') attachmentId: string) {
    return this.attachmentsService.remove(attachmentId);
  }
}