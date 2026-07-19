import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  githubRepo?: string;

  @IsOptional()
  @IsString()
  githubBranch?: string;

  @IsOptional()
  @IsString()
  organizationId?: string;
}