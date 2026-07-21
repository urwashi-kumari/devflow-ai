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

import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationParamDto } from './dto/notification-param.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully.',
  })
  createNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.createNotification(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notifications for a user' })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully.',
  })
  getUserNotifications(@Param() params: NotificationParamDto) {
    return this.notificationsService.getUserNotifications(params.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read.',
  })
  markAsRead(@Param() params: NotificationParamDto) {
    return this.notificationsService.markAsRead(params.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully.',
  })
  deleteNotification(@Param() params: NotificationParamDto) {
    return this.notificationsService.deleteNotification(params.id);
  }
}