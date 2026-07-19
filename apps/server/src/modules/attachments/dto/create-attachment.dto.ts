import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateAttachmentDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsUrl()
  @IsNotEmpty()
  fileUrl!: string;

  @IsOptional()
  @IsInt()
  fileSize?: number;
}