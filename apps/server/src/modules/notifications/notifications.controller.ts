import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationParamDto } from './dto/notification-param.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  createNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.createNotification(dto);
  }

  @Get(':id')
  getUserNotifications(@Param() params: NotificationParamDto) {
    return this.notificationsService.getUserNotifications(params.id);
  }

  @Patch(':id/read')
  markAsRead(@Param() params: NotificationParamDto) {
    return this.notificationsService.markAsRead(params.id);
  }

  @Delete(':id')
  deleteNotification(@Param() params: NotificationParamDto) {
    return this.notificationsService.deleteNotification(params.id);
  }
}