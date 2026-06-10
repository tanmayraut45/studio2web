import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BoqService {
  constructor(private prisma: PrismaService) {}

  findAll(orgId: string) {
    return this.prisma.boqDoc.findMany({
      where: { orgId, deletedAt: null },
      include: { project: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const boq = await this.prisma.boqDoc.findFirst({ where: { id, deletedAt: null }, include: { lines: true, project: true } });
    if (!boq) throw new NotFoundException('BOQ not found');
    return boq;
  }

  create(orgId: string, data: Prisma.BoqDocUncheckedCreateInput) {
    return this.prisma.boqDoc.create({ data: { ...data, orgId } });
  }

  /** Lock a BOQ after client approval (prevents further edits). */
  lock(id: string) {
    return this.prisma.boqDoc.update({ where: { id }, data: { locked: true, status: 'APPROVED' } });
  }
}
