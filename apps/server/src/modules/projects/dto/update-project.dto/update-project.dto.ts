import { IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  githubRepo?: string;

  @IsOptional()
  @IsString()
  githubBranch?: string;

  @IsOptional()
  @IsUUID()
  organizationId?: string;
}