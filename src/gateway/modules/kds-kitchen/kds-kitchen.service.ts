import { Injectable } from '@nestjs/common';
import { KitchenItemStatus } from 'src/modules/kitchen/entities/kitchen-item.entity';
import { KitchenService } from 'src/modules/kitchen/kitchen.service';

@Injectable()
export class KitchenGatewayService {
  constructor(private readonly kitchenService: KitchenService) {}

  async getPendingOrders() {
    return this.kitchenService.findByStatus(KitchenItemStatus.PENDING);
  }

  async updateOrderStatus(orderId: number, status: KitchenItemStatus) {
    return this.kitchenService.updateStatus(orderId, status);
  }
}
