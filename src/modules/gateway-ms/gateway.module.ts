import { Module } from '@nestjs/common';
import { TableModule } from '@src/modules/core-ms/table/table.module';
import { OrderModule } from '@src/modules/core-ms/order/order.module';
import { MenuModule } from '@src/modules/core-ms/menu/menu.module';
import { KitchenModule } from '@src/modules/core-ms/kitchen/kitchen.module';
import { NotificationModule } from '@src/modules/notification-ms/notification.module';
import { KDSKitchenController } from './modules/kds-kitchen/kds-kitchen.controller';
import { KitchenGatewayService } from './modules/kds-kitchen/kds-kitchen.service';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from '@src/modules/auth-ms/permission/permission.module';

@Module({
  imports: [
    AuthModule,
    MenuModule,
    OrderModule,
    TableModule,
    KitchenModule,
    NotificationModule,
    PermissionModule,
  ],
  controllers: [KDSKitchenController],
  providers: [KitchenGatewayService],
})
export class GatewayModule {}
