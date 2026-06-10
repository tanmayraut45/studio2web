import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProcurementService {
  constructor(private prisma: PrismaService) {}

  orders(orgId: string) {
    return this.prisma.purchaseOrder.findMany({
      where: { orgId, deletedAt: null },
      include: { vendor: true, project: true },
      orderBy: { orderedAt: 'desc' },
    });
  }

  createOrder(orgId: string, data: Prisma.PurchaseOrderUncheckedCreateInput) {
    return this.prisma.purchaseOrder.create({ data: { ...data, orgId } });
  }

  updateOrder(id: string, data: Prisma.PurchaseOrderUncheckedUpdateInput) {
    return this.prisma.purchaseOrder.update({ where: { id }, data });
  }

  requests(orgId: string) {
    return this.prisma.purchaseRequest.findMany({
      where: { orgId },
      include: { material: true, project: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  createRequest(orgId: string, data: Prisma.PurchaseRequestUncheckedCreateInput) {
    return this.prisma.purchaseRequest.create({ data: { ...data, orgId } });
  }
}
