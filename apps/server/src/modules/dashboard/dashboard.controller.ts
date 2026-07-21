import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get dashboard statistics for a project' })
  @ApiResponse({
    status: 200,
    description: 'Project dashboard statistics retrieved successfully.',
  })
  getProjectStats(@Param('projectId') projectId: string) {
    return this.dashboardService.getProjectStats(projectId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get dashboard statistics for a user' })
  @ApiResponse({
    status: 200,
    description: 'User dashboard statistics retrieved successfully.',
  })
  getUserStats(@Param('userId') userId: string) {
    return this.dashboardService.getUserStats(userId);
  }

  @Get('activity/:projectId')
  @ApiOperation({ summary: 'Get recent project activities' })
  @ApiResponse({
    status: 200,
    description: 'Recent project activities retrieved successfully.',
  })
  getRecentActivities(@Param('projectId') projectId: string) {
    return this.dashboardService.getRecentActivities(projectId);
  }
}