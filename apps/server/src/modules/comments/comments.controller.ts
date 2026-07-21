import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Add a comment to a task' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully.',
  })
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(taskId, dto);
  }

  @Get('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Get all comments for a task' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully.',
  })
  findAll(@Param('taskId') taskId: string) {
    return this.commentsService.findAll(taskId);
  }

  @Patch('comments/:commentId')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully.',
  })
  update(
    @Param('commentId') commentId: string,
    @Body('content') content: string,
  ) {
    return this.commentsService.update(commentId, content);
  }

  @Delete('comments/:commentId')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully.',
  })
  remove(@Param('commentId') commentId: string) {
    return this.commentsService.remove(commentId);
  }
}