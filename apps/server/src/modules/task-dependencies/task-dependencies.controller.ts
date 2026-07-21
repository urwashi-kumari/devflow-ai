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

import { TaskDependenciesService } from './task-dependencies.service';
import { CreateTaskDependencyDto } from './create-task-dependency.dto';

@ApiTags('Task Dependencies')
@ApiBearerAuth()
@Controller('task-dependencies')
export class TaskDependenciesController {
  constructor(
    private readonly taskDependenciesService: TaskDependenciesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a task dependency' })
  @ApiResponse({
    status: 201,
    description: 'Task dependency created successfully.',
  })
  create(@Body() dto: CreateTaskDependencyDto) {
    return this.taskDependenciesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all task dependencies' })
  @ApiResponse({
    status: 200,
    description: 'Task dependencies retrieved successfully.',
  })
  findAll() {
    return this.taskDependenciesService.findAll();
  }

  @Get('execution-order/:projectId')
  @ApiOperation({
    summary: 'Get execution order of tasks for a project',
  })
  @ApiResponse({
    status: 200,
    description: 'Execution order retrieved successfully.',
  })
  getExecutionOrder(
    @Param('projectId') projectId: string,
  ) {
    return this.taskDependenciesService.getExecutionOrder(
      projectId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task dependency' })
  @ApiResponse({
    status: 200,
    description: 'Task dependency deleted successfully.',
  })
  remove(@Param('id') id: string) {
    return this.taskDependenciesService.remove(id);
  }
}