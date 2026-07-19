import { IsEnum, IsString } from 'class-validator';
import { ProjectRole } from '@prisma/client';

export class CreateProjectMemberDto {
  @IsString()
  userId!: string;

  @IsEnum(ProjectRole)
  role!: ProjectRole;
}