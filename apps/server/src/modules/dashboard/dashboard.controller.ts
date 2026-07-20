import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('project/:projectId')
  getProjectStats(@Param('projectId') projectId: string) {
    return this.dashboardService.getProjectStats(projectId);
  }

  @Get('user/:userId')
  getUserStats(@Param('userId') userId: string) {
    return this.dashboardService.getUserStats(userId);
  }

  @Get('activity/:projectId')
  getRecentActivities(@Param('projectId') projectId: string) {
    return this.dashboardService.getRecentActivities(projectId);
  }
}