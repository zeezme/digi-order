import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MenuModule } from './modules/core-ms/menu/menu.module';
import { OrderModule } from './modules/core-ms/order/order.module';
import { TableModule } from './modules/core-ms/table/table.module';
import { KitchenModule } from './modules/core-ms/kitchen/kitchen.module';
import { NotificationModule } from './modules/notification-ms/notification.module';
import mikroOrmConfig from './mikro-orm.config';
import { CompanyModule } from './modules/auth-ms/company/company.module';
import { PermissionModule } from './modules/auth-ms/permission/permission.module';
import { UserModule } from './modules/auth-ms/user/user.module';
import { AuthModule } from './modules/gateway-ms/auth/auth.module';
import { GatewayModule } from './modules/gateway-ms/gateway.module';
import { KafkaModule } from './util/kafka/kafka.module';
import { SharedKernelModule } from './util/shared-kernel/shared-kernel.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    AuthModule,
    GatewayModule,
    MenuModule,
    OrderModule,
    TableModule,
    KitchenModule,
    NotificationModule,
    CompanyModule,
    PermissionModule,
    UserModule,
    KafkaModule,
    SharedKernelModule,
  ],
})
export class AppModule {}
