import {
  Controller,
  BadRequestException,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  UseGuards,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Attachments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('A file is required.');
    }

    return this.attachmentsService.create(
      taskId,
      file,
      { uploaderId: req.user.userId },
    );
  }

  @Get('tasks/:taskId/attachments')
  findAll(@Param('taskId') taskId: string) {
    return this.attachmentsService.findAll(taskId);
  }

  @Delete('attachments/:attachmentId')
  remove(
    @Param('attachmentId') attachmentId: string,
    @Req() req: any,
  ) {
    return this.attachmentsService.remove(
      attachmentId,
      req.user.userId,
    );
  }
}
