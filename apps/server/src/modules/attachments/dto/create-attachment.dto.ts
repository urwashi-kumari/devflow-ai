import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAttachmentDto {
  @ApiProperty({
    example: 'cmrrso9rk0001lq90abcd1234',
    description: 'ID of the user uploading the file',
  })
  @IsString()
  @IsNotEmpty()
  uploaderId!: string;
}