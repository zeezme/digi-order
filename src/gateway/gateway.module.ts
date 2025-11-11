import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { TableModule } from 'src/modules/table/table.module';
import { OrderModule } from 'src/modules/order/order.module';
import { MenuModule } from 'src/modules/menu/menu.module';
import { KitchenModule } from 'src/modules/kitchen/kitchen.module';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { KitchenController } from './controllers/kitchen.controller';

@Module({
  imports: [
    MenuModule,
    OrderModule,
    TableModule,
    KitchenModule,
    NotificationModule,
  ],
  controllers: [KitchenController],
  providers: [GatewayService],
})
export class GatewayModule {}
