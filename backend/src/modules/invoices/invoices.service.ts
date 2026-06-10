import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  findAll(orgId: string) {
    return this.prisma.invoice.findMany({
      where: { orgId, deletedAt: null },
      include: { client: true, payments: true },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findFirst({ where: { id, deletedAt: null }, include: { client: true, payments: true } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  create(orgId: string, dto: CreateInvoiceDto) {
    return this.prisma.invoice.create({ data: { ...dto, orgId } });
  }

  update(id: string, dto: UpdateInvoiceDto) {
    return this.prisma.invoice.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.invoice.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async outstanding(orgId: string) {
    const open = await this.prisma.invoice.findMany({ where: { orgId, deletedAt: null, status: { not: 'PAID' } } });
    return { count: open.length, total: open.reduce((s, i) => s + i.amount + i.gst, 0) };
  }
}
