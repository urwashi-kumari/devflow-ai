import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Urwashi Kumari',
    description: 'Full name of the user',
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'urwashi@example.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'Password (minimum 6 characters)',
    minLength: 6,
  })
  @MinLength(6)
  password!: string;
}