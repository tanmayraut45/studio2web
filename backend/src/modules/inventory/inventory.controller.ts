import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma, UserRole } from '@prisma/client';
import { InventoryService } from './inventory.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Inventory & Materials')
@ApiBearerAuth()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get('materials')
  materials(@CurrentUser() user: AuthUser) {
    return this.inventory.findMaterials(user.orgId);
  }

  @Get('materials/:id')
  material(@Param('id') id: string) {
    return this.inventory.findMaterial(id);
  }

  @Get('warehouses')
  warehouses(@CurrentUser() user: AuthUser) {
    return this.inventory.warehouses(user.orgId);
  }

  @Get('movements')
  movements(@CurrentUser() user: AuthUser) {
    return this.inventory.movements(user.orgId);
  }

  @Get('low-stock')
  lowStock(@CurrentUser() user: AuthUser) {
    return this.inventory.lowStock(user.orgId);
  }

  @Post('materials')
  @Roles(UserRole.PURCHASE_MANAGER, UserRole.ADMIN)
  createMaterial(@CurrentUser() user: AuthUser, @Body() body: Prisma.MaterialUncheckedCreateInput) {
    return this.inventory.createMaterial(user.orgId, body);
  }
}
