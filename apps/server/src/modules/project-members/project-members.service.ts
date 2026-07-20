import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';

@Injectable()
export class ProjectMembersService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  async addMember(
    projectId: string,
    dto: CreateProjectMemberDto,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const existingMember =
      await this.prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: dto.userId,
            projectId,
          },
        },
      });

    if (existingMember) {
      throw new BadRequestException(
        'User is already a member of this project.',
      );
    }

    const member = await this.prisma.projectMember.create({
      data: {
        userId: dto.userId,
        projectId,
        role: dto.role,
      },
    });

    await this.activityService.logActivity(
      `Added member "${user.name}" to project "${project.name}"`,
      project.ownerId,
      project.id,
    );

    return member;
  }

  async getMembers(projectId: string) {
    return this.prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateRole(
    memberId: string,
    role: ProjectRole,
  ) {
    const member =
      await this.prisma.projectMember.findUnique({
        where: { id: memberId },
        include: {
          user: true,
          project: true,
        },
      });

    if (!member) {
      throw new NotFoundException('Member not found.');
    }

    const updatedMember =
      await this.prisma.projectMember.update({
        where: { id: memberId },
        data: { role },
      });

    await this.activityService.logActivity(
      `Updated ${member.user.name}'s role to ${role} in project "${member.project.name}"`,
      member.project.ownerId,
      member.project.id,
    );

    return updatedMember;
  }

  async removeMember(memberId: string) {
    const member =
      await this.prisma.projectMember.findUnique({
        where: { id: memberId },
        include: {
          user: true,
          project: true,
        },
      });

    if (!member) {
      throw new NotFoundException('Member not found.');
    }

    await this.activityService.logActivity(
      `Removed member "${member.user.name}" from project "${member.project.name}"`,
      member.project.ownerId,
      member.project.id,
    );

    await this.prisma.projectMember.delete({
      where: { id: memberId },
    });

    return {
      message: 'Member removed successfully.',
    };
  }
}