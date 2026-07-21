import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto';
import { TaskParamDto } from './dto/task-param.dto/task-param.dto';
import { TaskFilterDto } from './dto/task-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(dto);
  }

  @Get('filter')
  getFilteredTasks(@Query() filter: TaskFilterDto) {
    return this.tasksService.getFilteredTasks(filter);
  }

  @Get()
  getTasks(@Query('projectId') projectId: string) {
    return this.tasksService.getTasks(projectId);
  }

  @Get(':id')
  getTaskById(@Param() params: TaskParamDto) {
    return this.tasksService.getTaskById(params.id);
  }

  @Patch(':id')
  updateTask(
    @Param() params: TaskParamDto,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(params.id, dto);
  }

  @Delete(':id')
  deleteTask(@Param() params: TaskParamDto) {
    return this.tasksService.deleteTask(params.id);
  }

  @Patch(':id/assign')
  assignTask(
    @Param() params: TaskParamDto,
    @Body('userId') userId: string,
  ) {
    return this.tasksService.assignTask(params.id, userId);
  }

  @Patch(':id/unassign')
  unassignTask(@Param() params: TaskParamDto) {
    return this.tasksService.unassignTask(params.id);
  }
}