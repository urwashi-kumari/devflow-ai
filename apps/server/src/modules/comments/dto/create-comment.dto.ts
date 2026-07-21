import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'This task has been completed successfully.',
    description: 'Content of the comment',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({
    example: 'cmrrso9rk0001lq90abcd1234',
    description: 'ID of the comment author',
  })
  @IsString()
  @IsNotEmpty()
  authorId!: string;
}