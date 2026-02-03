import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TableModule } from '@src/modules/core-ms/table/table.module';
import { OrderModule } from '@src/modules/core-ms/order/order.module';
import { MenuModule } from '@src/modules/core-ms/menu/menu.module';
import { KitchenModule } from '@src/modules/core-ms/kitchen/kitchen.module';
import { NotificationModule } from '@src/modules/notification-ms/notification.module';
import { KDSKitchenController } from './modules/kds-kitchen/kds-kitchen.controller';
import { KitchenGatewayService } from './modules/kds-kitchen/kds-kitchen.service';
import { PermissionModule } from '@src/modules/auth-ms/permission/permission.module';
import { SharedKernelModule } from '@src/util/shared-kernel/shared-kernel.module';
import { CompanyModule } from '@src/modules/auth-ms/company/company.module';
import { UserModule } from '@src/modules/auth-ms/user/user.module';
import { CredentialModule } from '@src/modules/auth-ms/credential/credential.module';
import { AuthGatewayController } from './modules/auth/auth.controller';
import { AuthGatewayService } from './modules/auth/auth.service';
import { AdminGatewayController } from './modules/admin/admin.controller';
import { AdminGatewayService } from './modules/admin/admin.service';

@Module({
  imports: [
    MenuModule,
    OrderModule,
    TableModule,
    KitchenModule,
    NotificationModule,
    PermissionModule,
    SharedKernelModule,
    CompanyModule,
    UserModule,
    CredentialModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    KDSKitchenController,
    AuthGatewayController,
    AdminGatewayController,
  ],
  providers: [KitchenGatewayService, AuthGatewayService, AdminGatewayService],
})
export class GatewayModule {}
