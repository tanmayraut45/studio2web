import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma, UserRole } from '@prisma/client';
import { BoqService } from './boq.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@ApiTags('BOQ & Estimation')
@ApiBearerAuth()
@Controller('boq')
export class BoqController {
  constructor(private readonly boq: BoqService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.boq.findAll(user.orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boq.findOne(id);
  }

  @Post()
  @Roles(UserRole.DESIGNER, UserRole.ADMIN)
  create(@CurrentUser() user: AuthUser, @Body() body: Prisma.BoqDocUncheckedCreateInput) {
    return this.boq.create(user.orgId, body);
  }

  @Post(':id/lock')
  @Roles(UserRole.ADMIN)
  lock(@Param('id') id: string) {
    return this.boq.lock(id);
  }
}
