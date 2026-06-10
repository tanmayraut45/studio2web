import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  findAll(orgId: string) {
    return this.prisma.employee.findMany({ where: { orgId, deletedAt: null }, orderBy: { productivity: 'desc' } });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findFirst({ where: { id, deletedAt: null } });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  create(orgId: string, dto: CreateEmployeeDto) {
    return this.prisma.employee.create({ data: { ...dto, orgId } });
  }

  update(id: string, dto: UpdateEmployeeDto) {
    return this.prisma.employee.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.employee.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
