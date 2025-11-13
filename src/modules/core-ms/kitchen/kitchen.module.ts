import { Module } from '@nestjs/common';
import { SqlEntityManager } from '@mikro-orm/postgresql';

import { AuditRepository } from 'src/util/repository/audit.repository';
import { KitchenItemRepository } from './kitchen.repository';
import { KitchenReadService } from './services/kitchen-read.service';
import { KitchenWriteService } from './services/kitchen-write.service';

@Module({
  providers: [
    KitchenReadService,
    KitchenWriteService,
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
  exports: [KitchenItemRepository, KitchenReadService, KitchenWriteService],
})
export class KitchenModule {}
