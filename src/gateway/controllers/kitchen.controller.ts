import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { KitchenItemStatus } from 'src/modules/kitchen/entities/kitchen-item.entity';
import { KitchenService } from 'src/modules/kitchen/kitchen.service';

@Controller('kitchen')
export class KitchenController {
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
  createItem(
    @Body('orderId') orderId: number,
    @Body('menuItemId') menuItemId: number,
  ) {
    return this.kitchenService.create(orderId, menuItemId);
  }

  @Patch('items/:id/status')
  updateStatus(
    @Param('id') id: number,
    @Body('status') status: KitchenItemStatus,
  ) {
    return this.kitchenService.updateStatus(+id, status);
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
