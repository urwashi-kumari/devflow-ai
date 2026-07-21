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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto';
import { TaskParamDto } from './dto/task-param.dto/task-param.dto';
import { TaskFilterDto } from './dto/task-filter.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  createTask(@Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(dto);
  }

  @Get('filter')
  @ApiOperation({ summary: 'Filter tasks' })
  getFilteredTasks(@Query() filter: TaskFilterDto) {
    return this.tasksService.getFilteredTasks(filter);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  getTasks(@Query('projectId') projectId: string) {
    return this.tasksService.getTasks(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  getTaskById(@Param() params: TaskParamDto) {
    return this.tasksService.getTaskById(params.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  updateTask(
    @Param() params: TaskParamDto,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(params.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  deleteTask(@Param() params: TaskParamDto) {
    return this.tasksService.deleteTask(params.id);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign a task to a user' })
  assignTask(
    @Param() params: TaskParamDto,
    @Body('userId') userId: string,
  ) {
    return this.tasksService.assignTask(params.id, userId);
  }

  @Patch(':id/unassign')
  @ApiOperation({ summary: 'Unassign a task' })
  unassignTask(@Param() params: TaskParamDto) {
    return this.tasksService.unassignTask(params.id);
  }
}