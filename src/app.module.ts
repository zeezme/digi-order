import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrderModule } from './modules/order/order.module';
import { TableModule } from './modules/table/table.module';
import { KitchenModule } from './modules/kitchen/kitchen.module';
import { NotificationModule } from './modules/notification/notification.module';
import mikroOrmConfig from 'mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    GatewayModule,
    MenuModule,
    OrderModule,
    TableModule,
    KitchenModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
