import { IsNotEmpty } from 'class-validator';

export class TaskParamDto {
  @IsNotEmpty()
  id!: string;
}