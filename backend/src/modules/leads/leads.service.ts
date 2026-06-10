import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  findAll(orgId: string) {
    return this.prisma.lead.findMany({ where: { orgId, deletedAt: null }, orderBy: { score: 'desc' } });
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findFirst({ where: { id, deletedAt: null }, include: { owner: true } });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  create(orgId: string, dto: CreateLeadDto) {
    return this.prisma.lead.create({ data: { ...dto, orgId } });
  }

  update(id: string, dto: UpdateLeadDto) {
    return this.prisma.lead.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.lead.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
