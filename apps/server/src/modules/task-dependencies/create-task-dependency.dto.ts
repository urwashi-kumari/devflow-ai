import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDependencyDto {
  @IsString()
  @IsNotEmpty()
  taskId!: string;

  @IsString()
  @IsNotEmpty()
  dependsOnTaskId!: string;
}