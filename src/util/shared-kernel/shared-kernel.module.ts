import { Module } from '@nestjs/common';
import { UserIdentityQueryClient } from './identity/user-identity.query-client';
import { UserModule } from '@src/modules/auth-ms/user/user.module';

@Module({
  imports: [UserModule],
  providers: [UserIdentityQueryClient],
  exports: [UserIdentityQueryClient],
})
export class SharedKernelModule {}
