import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implement JWT Authentication',
    description: 'Title of the task',
  })
  @IsString()
  title!: string;

  @ApiPropertyOptional({
    example: 'Implement JWT authentication using Passport and JWT.',
    description: 'Detailed description of the task',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.TODO,
    description: 'Current status of the task',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    description: 'Priority level of the task',
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    example: '2026-08-15T10:00:00.000Z',
    description: 'Task due date',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({
    example: 'cmrrsoa5d0003lq90zxqfu0q4',
    description: 'Project ID to which the task belongs',
  })
  @IsNotEmpty()
  projectId!: string;
}