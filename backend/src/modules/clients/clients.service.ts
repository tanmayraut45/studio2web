import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  findAll(orgId: string) {
    return this.prisma.client.findMany({
      where: { orgId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, deletedAt: null },
      include: { projects: true, invoices: true },
    });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  create(orgId: string, dto: CreateClientDto) {
    return this.prisma.client.create({ data: { ...dto, orgId } });
  }

  update(id: string, dto: UpdateClientDto) {
    return this.prisma.client.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    // soft delete
    return this.prisma.client.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
