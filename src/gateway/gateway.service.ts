import { Injectable } from '@nestjs/common';
import { MenuGatewayService } from './services/menu-gateway.service';
import { OrderGatewayService } from './services/order-gateway.service';
import { KitchenGatewayService } from './services/kitchen-gateway.service';
import { TableGatewayService } from './services/table-gateway.service';
import { NotificationGatewayService } from './services/notification-gateway.service';

@Injectable()
export class GatewayService {
  constructor(
    public readonly menu: MenuGatewayService,
    public readonly order: OrderGatewayService,
    public readonly kitchen: KitchenGatewayService,
    public readonly table: TableGatewayService,
    public readonly notification: NotificationGatewayService,
  ) {}
}
