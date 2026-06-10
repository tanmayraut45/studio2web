import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  findAll(orgId: string, projectId?: string) {
    return this.prisma.document.findMany({
      where: { orgId, deletedAt: null, ...(projectId ? { projectId } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(orgId: string, data: Prisma.DocumentUncheckedCreateInput) {
    return this.prisma.document.create({ data: { ...data, orgId } });
  }

  remove(id: string) {
    return this.prisma.document.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
