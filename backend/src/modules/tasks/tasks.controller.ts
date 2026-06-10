import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { TasksService } from './tasks.service';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query('projectId') projectId?: string) {
    return this.tasks.findAll(user.orgId, projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasks.findOne(id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() body: Prisma.TaskUncheckedCreateInput) {
    return this.tasks.create(user.orgId, body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Prisma.TaskUncheckedUpdateInput) {
    return this.tasks.update(id, body);
  }
}
