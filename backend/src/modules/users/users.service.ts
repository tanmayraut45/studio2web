import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const safeSelect = {
  id: true, email: true, name: true, role: true, mfaEnabled: true,
  isActive: true, lastLoginAt: true, createdAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll(orgId: string) {
    return this.prisma.user.findMany({ where: { orgId, deletedAt: null }, select: safeSelect });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({ where: { id, deletedAt: null }, select: safeSelect });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  setActive(id: string, isActive: boolean) {
    return this.prisma.user.update({ where: { id }, data: { isActive }, select: safeSelect });
  }
}
