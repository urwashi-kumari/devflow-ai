import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';

@Injectable()
export class ProjectMembersService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.projectMember.create({
      data: {
        userId: dto.userId,
        projectId,
        role: dto.role,
      },
    });
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
      });

    if (!member) {
      throw new NotFoundException('Member not found.');
    }

    return this.prisma.projectMember.update({
      where: { id: memberId },
      data: { role },
    });
  }

  async removeMember(memberId: string) {
    const member =
      await this.prisma.projectMember.findUnique({
        where: { id: memberId },
      });

    if (!member) {
      throw new NotFoundException('Member not found.');
    }

    await this.prisma.projectMember.delete({
      where: { id: memberId },
    });

    return {
      message: 'Member removed successfully.',
    };
  }
}