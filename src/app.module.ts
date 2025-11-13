import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MenuModule } from './modules/core_ms/menu/menu.module';
import { OrderModule } from './modules/core_ms/order/order.module';
import { TableModule } from './modules/core_ms/table/table.module';
import { KitchenModule } from './modules/core_ms/kitchen/kitchen.module';
import { NotificationModule } from './modules/notification_ms/notification.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import mikroOrmConfig from './mikro-orm.config';
import { CompanyModule } from './modules/auth_ms/company/company.module';
import { PermissionModule } from './modules/auth_ms/permission/permission.module';
import { UserModule } from './modules/auth_ms/user/user.module';
import { AuthModule } from './modules/gateway_ms/auth/auth.module';
import { GatewayModule } from './modules/gateway_ms/gateway.module';
import { KafkaModule } from './util/kafka/kafka.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
