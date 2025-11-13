// src/modules/kitchen/kitchen-gateway.service.ts
import { Injectable } from '@nestjs/common';
import { KitchenItemStatus } from '@src/modules/core_ms/kitchen/entities/kitchen-item.entity';
import { KitchenService } from '@src/modules/core_ms/kitchen/kitchen.service';

@Injectable()
export class KitchenGatewayService {
  constructor(private readonly kitchenService: KitchenService) {}

  async getPendingOrders(companyId: number) {
    return this.kitchenService.findByStatusAndCompany(
      KitchenItemStatus.PENDING,
      companyId,
    );
  }

  async updateOrderStatus(
    itemId: number,
    status: KitchenItemStatus,
    companyId: number,
  ) {
    return this.kitchenService.updateStatus(itemId, status, companyId);
  }
}
