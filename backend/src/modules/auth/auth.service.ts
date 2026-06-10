import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  private async sign(user: { id: string; email: string; role: string; orgId: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role, orgId: user.orgId };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get('jwt.secret'),
      expiresIn: this.config.get('jwt.expiresIn'),
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get('jwt.refreshSecret'),
      expiresIn: this.config.get('jwt.refreshExpiresIn'),
    });
    return { accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const tokens = await this.sign(user);
    return {
      ...tokens,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, mfaEnabled: user.mfaEnabled },
    };
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    let orgId = dto.orgId;
    if (!orgId) {
      const org = await this.prisma.organization.findFirst();
      orgId = org?.id;
      if (!orgId) {
        const created = await this.prisma.organization.create({ data: { name: 'Studio II' } });
        orgId = created.id;
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, name: dto.name, passwordHash, role: dto.role ?? 'DESIGNER', orgId },
    });
    const tokens = await this.sign(user);
    return { ...tokens, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, mfaEnabled: true, lastLoginAt: true, orgId: true },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
