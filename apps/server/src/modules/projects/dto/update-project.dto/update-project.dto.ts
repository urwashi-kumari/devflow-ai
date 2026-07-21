import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({
    example: 'DevFlow AI',
    description: 'Updated project name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'AI-powered developer collaboration platform',
    description: 'Updated project description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://github.com/urwashi-kumari/devflow-ai',
    description: 'Updated GitHub repository URL',
  })
  @IsOptional()
  @IsUrl()
  githubRepo?: string;

  @ApiPropertyOptional({
    example: 'develop',
    description: 'Updated Git branch',
  })
  @IsOptional()
  @IsString()
  githubBranch?: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Organization ID',
  })
  @IsOptional()
  @IsUUID()
  organizationId?: string;
}