import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Urwashi Kumari' })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
