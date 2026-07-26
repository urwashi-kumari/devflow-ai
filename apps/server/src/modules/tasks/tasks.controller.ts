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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto';
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
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: 'cmrz9tgs0000elqfckoq57gtn',
  })
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: 'cmrz9tgs0000elqfckoq57gtn',
  })
  updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: 'cmrz9tgs0000elqfckoq57gtn',
  })
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign a task to a user' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: 'cmrz9tgs0000elqfckoq57gtn',
  })
  assignTask(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    return this.tasksService.assignTask(id, userId);
  }

  @Patch(':id/unassign')
  @ApiOperation({ summary: 'Unassign a task' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: 'cmrz9tgs0000elqfckoq57gtn',
  })
  unassignTask(@Param('id') id: string) {
    return this.tasksService.unassignTask(id);
  }
}