import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { SupabaseAuthGuard } from '@src/util/guards/supabase.guard';
import { CompanyModule } from '@src/modules/auth-ms/company/company.module';
import { UserModule } from '@src/modules/auth-ms/user/user.module';

@Module({
  imports: [ConfigModule, CompanyModule, UserModule],
  providers: [SupabaseService, SupabaseAuthGuard],
  exports: [SupabaseService, SupabaseAuthGuard],
})
export class AuthModule {}
