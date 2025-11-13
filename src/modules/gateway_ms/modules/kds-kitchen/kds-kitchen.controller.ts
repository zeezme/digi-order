import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '@src/util/guards/supabase.guard';
import { PermissionGuard } from '@src/util/guards/permission.guard';
import { KitchenItemStatus } from '@src/modules/core_ms/kitchen/entities/kitchen-item.entity';
import { KitchenService } from '@src/modules/core_ms/kitchen/kitchen.service';
import {
  CreateKitchenItemDto,
  createKitchenItemSchema,
  UpdateKitchenItemDto,
  updateKitchenItemSchema,
} from './kitchen-item.schema';
import { ZodValidated } from '@src/util/decorators/zod-validated.decorator';
import { CurrentUser } from '@src/util/decorators/current-user.decorator';
import { RequirePermission } from '@src/util/decorators/require-permission.decorator';
import { RequireRole } from '@src/util/decorators/require-role.decorator';
import { User } from '@supabase/supabase-js';
import { CurrentCompany } from '@src/util/decorators/current-company.decorators';
import { Company } from '@src/modules/auth_ms/company/entities/company.entity';

@Controller('kds-kitchen')
@UseGuards(SupabaseAuthGuard, PermissionGuard)
export class KDSKitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get('items')
  @RequirePermission('kitchen.item.list')
  getAllItems(@CurrentUser() user: User, @CurrentCompany() company: Company) {
    if (!company?.id) throw new ForbiddenException('Company not found');
    return this.kitchenService.findAllByCompany(company.id);
  }

  @Get('items/:id')
  @RequirePermission('kitchen.item.read')
  getItem(@Param('id') id: number, @CurrentCompany() company: Company) {
    if (!company?.id) throw new ForbiddenException('Company not found');
    return this.kitchenService.findOneByCompany(+id, company.id);
  }

  @Get('orders/:orderId/items')
  @RequirePermission('kitchen.item.list')
  getItemsByOrder(
    @Param('orderId') orderId: number,
    @CurrentCompany() company: Company,
  ) {
    if (!company?.id) throw new ForbiddenException('Company not found');
    return this.kitchenService.findByOrderIdAndCompany(+orderId, company.id);
  }

  @Get('items/status/:status')
  @RequirePermission('kitchen.item.list')
  getItemsByStatus(
    @Param('status') status: KitchenItemStatus,
    @CurrentCompany() company: Company,
  ) {
    if (!company?.id) throw new ForbiddenException('Company not found');
    return this.kitchenService.findByStatusAndCompany(status, company.id);
  }

  @Post('items')
  @ZodValidated(createKitchenItemSchema)
  @RequireRole('kitchen', 'admin')
  @RequirePermission('kitchen.item.create')
  createItem(
    @Body() dto: CreateKitchenItemDto,
    @CurrentCompany() company: Company,
  ) {
    if (!company?.id) throw new ForbiddenException('Company not found');
    return this.kitchenService.create(dto.orderId, dto.menuItemId, company.id);
  }

  @Patch('items/:id/status')
  @ZodValidated(updateKitchenItemSchema)
  @RequireRole('kitchen')
  @RequirePermission('kitchen.item.update')
  updateStatus(
    @Param('id') id: number,
    @Body() dto: UpdateKitchenItemDto,
    @CurrentCompany() company: Company,
  ) {
    if (!company?.id) throw new ForbiddenException('Company not found');
    return this.kitchenService.updateStatus(+id, dto.status!, company.id);
  }

  @Delete('items/:id')
  @RequireRole('admin')
  @RequirePermission('kitchen.item.delete')
  deleteItem(@Param('id') id: number, @CurrentCompany() company: Company) {
    if (!company?.id) throw new ForbiddenException('Company not found');
    return this.kitchenService.remove(+id, company.id);
  }
}
