import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDependencyDto {
  @ApiProperty({
    example: 'cmrrsoa5d0003lq90zxqfu0q4',
    description: 'ID of the task',
  })
  @IsString()
  @IsNotEmpty()
  taskId!: string;

  @ApiProperty({
    example: 'cmrrsob8x0006lq90abcd5678',
    description: 'ID of the task that must be completed first',
  })
  @IsString()
  @IsNotEmpty()
  dependsOnTaskId!: string;
}