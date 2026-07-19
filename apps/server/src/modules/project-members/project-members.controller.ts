import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProjectRole } from '@prisma/client';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';
import { ProjectMembersService } from './project-members.service';

@Controller('projects')
export class ProjectMembersController {
  constructor(
    private readonly projectMembersService: ProjectMembersService,
  ) {}

  @Post(':projectId/members')
  addMember(
    @Param('projectId') projectId: string,
    @Body() dto: CreateProjectMemberDto,
  ) {
    return this.projectMembersService.addMember(projectId, dto);
  }

  @Get(':projectId/members')
  getMembers(
    @Param('projectId') projectId: string,
  ) {
    return this.projectMembersService.getMembers(projectId);
  }

  @Patch(':projectId/members/:memberId/role')
  updateRole(
    @Param('memberId') memberId: string,
    @Body('role') role: ProjectRole,
  ) {
    return this.projectMembersService.updateRole(
      memberId,
      role,
    );
  }

  @Delete(':projectId/members/:memberId')
  removeMember(
    @Param('memberId') memberId: string,
  ) {
    return this.projectMembersService.removeMember(memberId);
  }
}