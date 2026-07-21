import { IsString } from 'class-validator';

export class NotificationParamDto {
  @IsString()
  id!: string;
}