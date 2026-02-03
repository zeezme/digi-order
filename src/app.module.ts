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
import { KafkaModule } from './util/kafka/kafka.module';
import { SharedKernelModule } from './util/shared-kernel/shared-kernel.module';
import { GatewayModule } from './gateway/gateway.module';
import { CredentialModule } from './modules/auth-ms/credential/credential.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from './util/interceptors/context.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    GatewayModule,
    MenuModule,
    OrderModule,
    TableModule,
    KitchenModule,
    NotificationModule,
    CredentialModule,
    CompanyModule,
    PermissionModule,
    UserModule,
    KafkaModule,
    SharedKernelModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor,
    },
  ],
})
export class AppModule {}
