import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { TaskDependenciesService } from './task-dependencies.service';
import { CreateTaskDependencyDto } from './create-task-dependency.dto';

@Controller('task-dependencies')
export class TaskDependenciesController {
  constructor(
    private readonly taskDependenciesService: TaskDependenciesService,
  ) {}

  @Post()
  create(@Body() dto: CreateTaskDependencyDto) {
    return this.taskDependenciesService.create(dto);
  }

  @Get()
  findAll() {
    return this.taskDependenciesService.findAll();
  }

  @Get('execution-order/:projectId')
  getExecutionOrder(
    @Param('projectId') projectId: string,
  ) {
    return this.taskDependenciesService.getExecutionOrder(
      projectId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskDependenciesService.remove(id);
  }
}