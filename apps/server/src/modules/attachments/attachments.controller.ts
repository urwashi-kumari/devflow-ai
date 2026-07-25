import {
  Controller,
  BadRequestException,
  Delete,
  Get,
  Param,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { AttachmentsService } from './attachments.service';

@ApiTags('Attachments')
@ApiBearerAuth()
@Controller()
export class AttachmentsController {
  constructor(
    private readonly attachmentsService: AttachmentsService,
  ) {}

  @Post('tasks/:taskId/attachments')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            extname(file.originalname);

          cb(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        uploaderId: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload attachment' })
  @ApiResponse({
    status: 201,
    description: 'Attachment uploaded successfully.',
  })
  create(
    @Param('taskId') taskId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('uploaderId') uploaderId: string,
  ) {
    if (!file) {
      throw new BadRequestException('A file is required.');
    }

    if (!uploaderId) {
      throw new BadRequestException('Uploader ID is required.');
    }

    return this.attachmentsService.create(
      taskId,
      file,
      { uploaderId },
    );
  }

  @Get('tasks/:taskId/attachments')
  findAll(@Param('taskId') taskId: string) {
    return this.attachmentsService.findAll(taskId);
  }

  @Delete('attachments/:attachmentId')
  remove(
    @Param('attachmentId') attachmentId: string,
  ) {
    return this.attachmentsService.remove(
      attachmentId,
    );
  }
}
