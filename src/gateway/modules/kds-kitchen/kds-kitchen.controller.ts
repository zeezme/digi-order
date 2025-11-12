import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from 'src/gateway/auth/supabase.guard';
import { KitchenItemStatus } from 'src/modules/kitchen/entities/kitchen-item.entity';
import { KitchenService } from 'src/modules/kitchen/kitchen.service';
import {
  CreateKitchenItemDto,
  createKitchenItemSchema,
  UpdateKitchenItemDto,
  updateKitchenItemSchema,
} from './kitchen-item.schema';
import { ZodValidated } from '@src/util/decorators/zod-validated.decorator';
@Controller('kds-kitchen')
@UseGuards(SupabaseAuthGuard)
export class KDSKitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get('items')
  getAllItems() {
    return this.kitchenService.findAll();
  }

  @Get('items/:id')
  getItem(@Param('id') id: number) {
    return this.kitchenService.findOne(+id);
  }

  @Get('orders/:orderId/items')
  getItemsByOrder(@Param('orderId') orderId: number) {
    return this.kitchenService.findByOrderId(+orderId);
  }

  @Get('items/status/:status')
  getItemsByStatus(@Param('status') status: KitchenItemStatus) {
    return this.kitchenService.findByStatus(status);
  }

  @Post('items')
  @ZodValidated(createKitchenItemSchema)
  createItem(@Body() dto: CreateKitchenItemDto) {
    return this.kitchenService.create(dto.orderId, dto.menuItemId);
  }

  @Patch('items/:id/status')
  @ZodValidated(updateKitchenItemSchema)
  updateStatus(@Param('id') id: number, @Body() dto: UpdateKitchenItemDto) {
    return this.kitchenService.updateStatus(+id, dto.status!);
  }

  @Delete('items/:id')
  deleteItem(@Param('id') id: number) {
    return this.kitchenService.remove(+id);
  }

  @Get('items/pending/count')
  getPendingCount() {
    return this.kitchenService.getPendingCount();
  }
}
