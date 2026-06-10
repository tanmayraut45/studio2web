import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Invoices')
@ApiBearerAuth()
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoices: InvoicesService) {}

  @Get()
  @Roles(UserRole.ACCOUNTANT, UserRole.ADMIN)
  findAll(@CurrentUser() user: AuthUser) {
    return this.invoices.findAll(user.orgId);
  }

  @Get('outstanding')
  @Roles(UserRole.ACCOUNTANT, UserRole.ADMIN)
  outstanding(@CurrentUser() user: AuthUser) {
    return this.invoices.outstanding(user.orgId);
  }

  @Get(':id')
  @Roles(UserRole.ACCOUNTANT, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.invoices.findOne(id);
  }

  @Post()
  @Roles(UserRole.ACCOUNTANT, UserRole.ADMIN)
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateInvoiceDto) {
    return this.invoices.create(user.orgId, dto);
  }

  @Patch(':id')
  @Roles(UserRole.ACCOUNTANT, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.invoices.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.invoices.remove(id);
  }
}
