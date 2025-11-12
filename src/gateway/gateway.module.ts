import { Module } from '@nestjs/common';
import { TableModule } from 'src/modules/table/table.module';
import { OrderModule } from 'src/modules/order/order.module';
import { MenuModule } from 'src/modules/menu/menu.module';
import { KitchenModule } from 'src/modules/kitchen/kitchen.module';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { KDSKitchenController } from './modules/kds-kitchen/kds-kitchen.controller';
import { KitchenGatewayService } from './modules/kds-kitchen/kds-kitchen.service';

@Module({
  imports: [
    MenuModule,
    OrderModule,
    TableModule,
    KitchenModule,
    NotificationModule,
  ],
  controllers: [KDSKitchenController],
  providers: [KitchenGatewayService],
})
export class GatewayModule {}
