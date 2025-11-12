import { Module } from '@nestjs/common';
import { SqlEntityManager } from '@mikro-orm/postgresql';

import { KitchenService } from './kitchen.service';
import { AuditRepository } from 'src/util/repository/audit.repository';
import { KitchenItemRepository } from './kitchen.repository';

@Module({
  providers: [
    KitchenService,
    {
      provide: AuditRepository,
      useFactory: (em: SqlEntityManager) => new AuditRepository(em),
      inject: [SqlEntityManager],
    },
    {
      provide: KitchenItemRepository,
      useFactory: (em: SqlEntityManager, auditRepo: AuditRepository) =>
        new KitchenItemRepository(em, auditRepo),
      inject: [SqlEntityManager, AuditRepository],
    },
  ],
  exports: [KitchenItemRepository, KitchenService],
})
export class KitchenModule {}
