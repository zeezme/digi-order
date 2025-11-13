import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { GatewayModule } from './gateway/gateway.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrderModule } from './modules/order/order.module';
import { TableModule } from './modules/table/table.module';
import { KitchenModule } from './modules/kitchen/kitchen.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AuthModule } from './gateway/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './modules/company/company.module';
import { PermissionModule } from './modules/permission/permission.module';
import mikroOrmConfig from './mikro-orm.config';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
