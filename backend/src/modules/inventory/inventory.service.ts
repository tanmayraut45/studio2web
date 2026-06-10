import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  findMaterials(orgId: string) {
    return this.prisma.material.findMany({
      where: { orgId, deletedAt: null },
      include: { vendor: true, stock: true },
      orderBy: { name: 'asc' },
    });
  }

  async findMaterial(id: string) {
    const material = await this.prisma.material.findFirst({ where: { id, deletedAt: null }, include: { stock: true, movements: true } });
    if (!material) throw new NotFoundException('Material not found');
    return material;
  }

  createMaterial(orgId: string, data: Prisma.MaterialUncheckedCreateInput) {
    return this.prisma.material.create({ data: { ...data, orgId } });
  }

  warehouses(orgId: string) {
    return this.prisma.warehouse.findMany({ where: { orgId }, include: { stock: true } });
  }

  movements(orgId: string) {
    return this.prisma.stockMovement.findMany({
      where: { material: { orgId } },
      include: { material: true },
      orderBy: { date: 'desc' },
      take: 50,
    });
  }

  async lowStock(orgId: string) {
    const materials = await this.prisma.material.findMany({ where: { orgId, deletedAt: null }, include: { stock: true } });
    return materials.filter((m) => m.stock.reduce((s, si) => s + si.onHand, 0) < m.reorderLevel);
  }
}
