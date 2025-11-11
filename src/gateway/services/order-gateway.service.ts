import { Injectable } from '@nestjs/common';
import { OrderService } from '../../modules/order/order.service';
import { KitchenService } from '../../modules/kitchen/kitchen.service';
import { NotificationService } from '../../modules/notification/notification.service';

@Injectable()
export class OrderGatewayService {
  constructor(
    private readonly orderService: OrderService,
    private readonly kitchenService: KitchenService,
    private readonly notificationService: NotificationService,
  ) {}

  async createOrder(
    tableId: number,
    items: { menuItemId: number; qty: number }[],
  ) {
    const order = await this.orderService.createOrder(tableId, items);
    await this.kitchenService.queueOrder(order);
    await this.notificationService.notifyNewOrder(order);
    return order;
  }

  async updateOrderStatus(orderId: number, status: string) {
    const updated = await this.orderService.updateStatus(orderId, status);
    await this.kitchenService.updateKitchenStatus(orderId, status);
    await this.notificationService.notifyOrderStatus(orderId, status);
    return updated;
  }

  async getOrderByTable(tableId: number) {
    return this.orderService.findByTable(tableId);
  }
}
