import { Injectable } from '@nestjs/common';
import { KitchenItemStatus } from '@src/modules/core-ms/kitchen/entities/kitchen-item.entity';
import { KitchenReadService } from '@src/modules/core-ms/kitchen/services/kitchen-read.service';
import { KitchenWriteService } from '@src/modules/core-ms/kitchen/services/kitchen-write.service';

@Injectable()
export class KitchenGatewayService {
  constructor(
    private readonly kitchenReadService: KitchenReadService,
    private readonly kitchenWriteService: KitchenWriteService,
  ) {}

  async getPendingOrders(companyId: number) {
    return this.kitchenReadService.findByStatusAndCompany(
      KitchenItemStatus.PENDING,
      companyId,
    );
  }

  async updateOrderStatus(
    itemId: number,
    status: KitchenItemStatus,
    companyId: number,
  ) {
    return this.kitchenWriteService.updateStatus(itemId, status, companyId);
  }
}
