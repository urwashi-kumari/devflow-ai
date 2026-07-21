import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'DevFlow AI',
    description: 'Name of the project',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'AI-powered developer collaboration platform',
    description: 'Brief description of the project',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://github.com/urwashi-kumari/devflow-ai',
    description: 'GitHub repository URL',
  })
  @IsOptional()
  @IsString()
  githubRepo?: string;

  @ApiPropertyOptional({
    example: 'main',
    description: 'Git branch to track',
  })
  @IsOptional()
  @IsString()
  githubBranch?: string;
}