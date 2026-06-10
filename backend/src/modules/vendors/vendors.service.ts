import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVendorDto, UpdateVendorDto } from './dto/vendor.dto';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  findAll(orgId: string) {
    return this.prisma.vendor.findMany({ where: { orgId, deletedAt: null }, orderBy: { rating: 'desc' } });
  }

  async findOne(id: string) {
    const vendor = await this.prisma.vendor.findFirst({ where: { id, deletedAt: null }, include: { materials: true } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  create(orgId: string, dto: CreateVendorDto) {
    return this.prisma.vendor.create({ data: { ...dto, orgId } });
  }

  update(id: string, dto: UpdateVendorDto) {
    return this.prisma.vendor.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.vendor.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
