import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'Task Assigned',
    description: 'Title of the notification',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'You have been assigned to the task "Implement JWT Authentication".',
    description: 'Notification message',
  })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty({
    example: 'cmrrso9rk0001lq90abcd1234',
    description: 'ID of the user receiving the notification',
  })
  @IsString()
  @IsNotEmpty()
  userId!: string;
}