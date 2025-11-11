import { Injectable } from '@nestjs/common';
import { TableService } from '../../modules/table/table.service';
import { OrderService } from '../../modules/order/order.service';

@Injectable()
export class TableGatewayService {
  constructor(
    private readonly tableService: TableService,
    private readonly orderService: OrderService,
  ) {}

  async getOverview() {
    return this.tableService.getOverview();
  }

  async getActiveOrdersForTable(tableId: number) {
    return this.orderService.findByTable(tableId);
  }

  async setOccupied(tableId: number, occupied: boolean) {
    return this.tableService.updateOccupancy(tableId, occupied);
  }
}
