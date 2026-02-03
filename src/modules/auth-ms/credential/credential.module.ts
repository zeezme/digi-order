import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CredentialService } from './credential.service';
import { AuditRepository } from '@src/util/repository/audit.repository';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { CredentialRepository } from './credential.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    CredentialService,
    {
      provide: AuditRepository,
      useFactory: (em: SqlEntityManager) => new AuditRepository(em),
      inject: [SqlEntityManager],
    },
    {
      provide: CredentialRepository,
      useFactory: (em: SqlEntityManager, auditRepo: AuditRepository) =>
        new CredentialRepository(em, auditRepo),
      inject: [SqlEntityManager, AuditRepository],
    },
  ],
  exports: [CredentialRepository, CredentialService],
})
export class CredentialModule {}
