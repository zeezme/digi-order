import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuditRepository } from '@src/util/repository/audit.repository';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { CompanyRepository } from './company.repository';

@Module({
  providers: [
    CompanyService,
    CompanyRepository,
    {
      provide: AuditRepository,
      useFactory: (em: SqlEntityManager) => new AuditRepository(em),
      inject: [SqlEntityManager],
    },
    {
      provide: CompanyRepository,
      useFactory: (em: SqlEntityManager, auditRepo: AuditRepository) =>
        new CompanyRepository(em, auditRepo),
      inject: [SqlEntityManager, AuditRepository],
    },
  ],
  exports: [CompanyRepository, CompanyService],
})
export class CompanyModule {}
