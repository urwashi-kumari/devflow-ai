import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Password@123' })
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty({ example: 'NewPassword@123', minLength: 6 })
  @MinLength(6)
  newPassword!: string;
}
