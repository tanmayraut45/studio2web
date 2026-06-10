import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma, UserRole } from '@prisma/client';
import { ProcurementService } from './procurement.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Procurement')
@ApiBearerAuth()
@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurement: ProcurementService) {}

  @Get('orders')
  orders(@CurrentUser() user: AuthUser) {
    return this.procurement.orders(user.orgId);
  }

  @Post('orders')
  @Roles(UserRole.PURCHASE_MANAGER, UserRole.ADMIN)
  createOrder(@CurrentUser() user: AuthUser, @Body() body: Prisma.PurchaseOrderUncheckedCreateInput) {
    return this.procurement.createOrder(user.orgId, body);
  }

  @Patch('orders/:id')
  @Roles(UserRole.PURCHASE_MANAGER, UserRole.ADMIN)
  updateOrder(@Param('id') id: string, @Body() body: Prisma.PurchaseOrderUncheckedUpdateInput) {
    return this.procurement.updateOrder(id, body);
  }

  @Get('requests')
  requests(@CurrentUser() user: AuthUser) {
    return this.procurement.requests(user.orgId);
  }

  @Post('requests')
  createRequest(@CurrentUser() user: AuthUser, @Body() body: Prisma.PurchaseRequestUncheckedCreateInput) {
    return this.procurement.createRequest(user.orgId, body);
  }
}
