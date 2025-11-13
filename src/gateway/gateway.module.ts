import { Module } from '@nestjs/common';
import { TableModule } from '@src/modules/core_ms/table/table.module';
import { OrderModule } from '@src/modules/core_ms/order/order.module';
import { MenuModule } from '@src/modules/core_ms/menu/menu.module';
import { KitchenModule } from '@src/modules/core_ms/kitchen/kitchen.module';
import { NotificationModule } from '@src/modules/notification_ms/notification.module';
import { KDSKitchenController } from './modules/kds-kitchen/kds-kitchen.controller';
import { KitchenGatewayService } from './modules/kds-kitchen/kds-kitchen.service';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from '@src/modules/auth_ms/permission/permission.module';

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
