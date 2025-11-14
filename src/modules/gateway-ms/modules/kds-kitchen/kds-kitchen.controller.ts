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
import { KitchenItemStatus } from '@src/modules/core-ms/kitchen/entities/kitchen-item.entity';
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
import { Company } from '@src/modules/auth-ms/company/entities/company.entity';
import { KitchenReadService } from '@src/modules/core-ms/kitchen/services/kitchen-read.service';
import { KitchenWriteService } from '@src/modules/core-ms/kitchen/services/kitchen-write.service';
import { UserIdentityQueryClient } from '@src/util/shared-kernel/identity/user-identity.query-client';
import { stitchUserProfiles } from '@src/util/shared-kernel/helpers/stitching.helper';

@Controller('kds-kitchen')
@UseGuards(SupabaseAuthGuard, PermissionGuard)
export class KDSKitchenController {
  constructor(
    private readonly kitchenReadService: KitchenReadService,
    private readonly kitchenWriteService: KitchenWriteService,
    private readonly userIdentityQueryClient: UserIdentityQueryClient,
  ) {}

  @Get('items')
  // @RequirePermission('kitchen.list')
  async getAllItems(
    @CurrentUser() user: User,
    @CurrentCompany() company: Company,
  ) {
    console.log(user);
    if (!company?.id) throw new ForbiddenException('Company not found');

    const items = await this.kitchenReadService.findAllByCompany(company.id);

    const stitchedItems = await stitchUserProfiles(
      items,
      'createdBy',
      'createdByProfile',
      this.userIdentityQueryClient,
    );

    return stitchedItems;
  }

  @Get('items/:id')
  @RequirePermission('kitchen.read')
  getItem(@Param('id') id: number, @CurrentCompany() company: Company) {
    if (!company?.id) throw new ForbiddenException('Company not found');
    return this.kitchenReadService.findOneByCompany(+id, company.id);
  }

  @Get('orders/:orderId/items')
  @RequirePermission('kitchen.list')
  getItemsByOrder(
    @Param('orderId') orderId: number,
    @CurrentCompany() company: Company,
  ) {
    if (!company?.id) throw new ForbiddenException('Company not found');
    return this.kitchenReadService.findByOrderIdAndCompany(
      +orderId,
      company.id,
    );
  }

  @Get('items/status/:status')
  @RequirePermission('kitchen.list')
  getItemsByStatus(
    @Param('status') status: KitchenItemStatus,
    @CurrentCompany() company: Company,
  ) {
    if (!company?.id) throw new ForbiddenException('Company not found');
    return this.kitchenReadService.findByStatusAndCompany(status, company.id);
  }

  @Post('items')
  @ZodValidated(createKitchenItemSchema)
  @RequireRole('kitchen', 'admin')
  @RequirePermission('kitchen.create')
  createItem(
    @Body() dto: CreateKitchenItemDto,
    @CurrentCompany() company: Company,
  ) {
    if (!company?.id) throw new ForbiddenException('Company not found');
    return this.kitchenWriteService.create(
      dto.orderId,
      dto.menuItemId,
      company.id,
    );
  }

  @Patch('items/:id/status')
  @ZodValidated(updateKitchenItemSchema)
  @RequireRole('kitchen')
  @RequirePermission('kitchen.update')
  updateStatus(
    @Param('id') id: number,
    @Body() dto: UpdateKitchenItemDto,
    @CurrentCompany() company: Company,
  ) {
    if (!company?.id) throw new ForbiddenException('Company not found');
    return this.kitchenWriteService.updateStatus(+id, dto.status!, company.id);
  }

  @Delete('items/:id')
  @RequireRole('admin')
  @RequirePermission('kitchen.delete')
  deleteItem(@Param('id') id: number, @CurrentCompany() company: Company) {
    if (!company?.id) throw new ForbiddenException('Company not found');
    return this.kitchenWriteService.remove(+id, company.id);
  }
}
