import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectRole } from '@prisma/client';

import { CreateProjectMemberDto } from './dto/create-project-member.dto';
import { ProjectMembersService } from './project-members.service';

@ApiTags('Project Members')
@ApiBearerAuth()
@Controller('projects')
export class ProjectMembersController {
  constructor(
    private readonly projectMembersService: ProjectMembersService,
  ) {}

  @Post(':projectId/members')
  @ApiOperation({ summary: 'Add a member to a project' })
  @ApiResponse({
    status: 201,
    description: 'Project member added successfully.',
  })
  addMember(
    @Param('projectId') projectId: string,
    @Body() dto: CreateProjectMemberDto,
  ) {
    return this.projectMembersService.addMember(projectId, dto);
  }

  @Get(':projectId/members')
  @ApiOperation({ summary: 'Get all members of a project' })
  @ApiResponse({
    status: 200,
    description: 'Project members retrieved successfully.',
  })
  getMembers(
    @Param('projectId') projectId: string,
  ) {
    return this.projectMembersService.getMembers(projectId);
  }

  @Patch(':projectId/members/:memberId/role')
  @ApiOperation({ summary: 'Update a project member role' })
  @ApiResponse({
    status: 200,
    description: 'Project member role updated successfully.',
  })
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
  @ApiOperation({ summary: 'Remove a member from a project' })
  @ApiResponse({
    status: 200,
    description: 'Project member removed successfully.',
  })
  removeMember(
    @Param('memberId') memberId: string,
  ) {
    return this.projectMembersService.removeMember(memberId);
  }
}