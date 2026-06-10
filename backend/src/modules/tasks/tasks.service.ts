import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  findAll(orgId: string, projectId?: string) {
    return this.prisma.task.findMany({
      where: { orgId, deletedAt: null, ...(projectId ? { projectId } : {}) },
      include: { assignee: true },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findFirst({ where: { id, deletedAt: null } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  create(orgId: string, data: Prisma.TaskUncheckedCreateInput) {
    return this.prisma.task.create({ data: { ...data, orgId } });
  }

  update(id: string, data: Prisma.TaskUncheckedUpdateInput) {
    return this.prisma.task.update({ where: { id }, data });
  }
}
