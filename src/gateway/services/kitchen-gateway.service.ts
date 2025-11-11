import { Injectable } from '@nestjs/common';
import { KitchenService } from '../../modules/kitchen/kitchen.service';
import { KitchenItemStatus } from 'src/modules/kitchen/entities/kitchen-item.entity';

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
