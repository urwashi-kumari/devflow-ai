import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('tasks/:taskId/comments')
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(taskId, dto);
  }

  @Get('tasks/:taskId/comments')
  findAll(
    @Param('taskId') taskId: string,
  ) {
    return this.commentsService.findAll(taskId);
  }

  @Patch('comments/:commentId')
  update(
    @Param('commentId') commentId: string,
    @Body('content') content: string,
  ) {
    return this.commentsService.update(commentId, content);
  }

  @Delete('comments/:commentId')
  remove(
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.remove(commentId);
  }
}