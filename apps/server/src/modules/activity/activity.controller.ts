import { Controller, Get, Param } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  getAllActivities() {
    return this.activityService.getAllActivities();
  }

  @Get('project/:projectId')
  getProjectActivities(@Param('projectId') projectId: string) {
    return this.activityService.getProjectActivities(projectId);
  }

  @Get('task/:taskId')
  getTaskActivities(@Param('taskId') taskId: string) {
    return this.activityService.getTaskActivities(taskId);
  }
}