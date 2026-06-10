import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  findAll(orgId: string) {
    return this.prisma.project.findMany({
      where: { orgId, deletedAt: null },
      include: { client: true, manager: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: { client: true, manager: true, milestones: true, tasks: true, snags: true, members: { include: { employee: true } } },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  create(orgId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({ data: { ...dto, orgId } });
  }

  update(id: string, dto: UpdateProjectDto) {
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  /** Portfolio BI — answers "which projects are profitable / at risk". */
  async stats(orgId: string) {
    const projects = await this.prisma.project.findMany({ where: { orgId, deletedAt: null } });
    const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
    const totalActual = projects.reduce((s, p) => s + p.actual, 0);
    return {
      count: projects.length,
      totalBudget,
      totalActual,
      blendedMargin: totalBudget ? projects.reduce((s, p) => s + p.margin * p.budget, 0) / totalBudget : 0,
      delayed: projects.filter((p) => p.health === 'DELAYED').length,
      atRisk: projects.filter((p) => p.health === 'AT_RISK').length,
    };
  }
}
