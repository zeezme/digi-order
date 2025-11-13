// src/modules/permission/permission.module.ts
import { Module } from '@nestjs/common';
import { SqlEntityManager } from '@mikro-orm/postgresql';

import { AuditRepository } from '@src/util/repository/audit.repository';
import { PermissionService } from './services/permission.service';
import {
  PermissionRepository,
  RoleRepository,
  UserRoleRepository,
} from './permission.repository';
import { PermissionSyncService } from './services/permission-sync.service';

@Module({
  providers: [
    PermissionService,
    PermissionSyncService,

    {
      provide: AuditRepository,
      useFactory: (em: SqlEntityManager) => new AuditRepository(em.fork()),
      inject: [SqlEntityManager],
    },

    {
      provide: PermissionRepository,
      useFactory: (em: SqlEntityManager, auditRepo: AuditRepository) =>
        new PermissionRepository(em.fork(), auditRepo),
      inject: [SqlEntityManager, AuditRepository],
    },

    {
      provide: RoleRepository,
      useFactory: (em: SqlEntityManager, auditRepo: AuditRepository) =>
        new RoleRepository(em.fork(), auditRepo),
      inject: [SqlEntityManager, AuditRepository],
    },

    {
      provide: UserRoleRepository,
      useFactory: (em: SqlEntityManager, auditRepo: AuditRepository) =>
        new UserRoleRepository(em.fork(), auditRepo),
      inject: [SqlEntityManager, AuditRepository],
    },
  ],
  exports: [
    PermissionService,
    RoleRepository,
    UserRoleRepository,
    PermissionRepository,
  ],
})
export class PermissionModule {}
