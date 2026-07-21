import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ActivityService } from './activity.service';

@ApiTags('Activity')
@ApiBearerAuth()
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all activity logs' })
  @ApiResponse({
    status: 200,
    description: 'Activity logs retrieved successfully.',
  })
  getAllActivities() {
    return this.activityService.getAllActivities();
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get activity logs for a project' })
  @ApiResponse({
    status: 200,
    description: 'Project activity logs retrieved successfully.',
  })
  getProjectActivities(@Param('projectId') projectId: string) {
    return this.activityService.getProjectActivities(projectId);
  }

  @Get('task/:taskId')
  @ApiOperation({ summary: 'Get activity logs for a task' })
  @ApiResponse({
    status: 200,
    description: 'Task activity logs retrieved successfully.',
  })
  getTaskActivities(@Param('taskId') taskId: string) {
    return this.activityService.getTaskActivities(taskId);
  }
}