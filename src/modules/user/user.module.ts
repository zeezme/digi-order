import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuditRepository } from '@src/util/repository/audit.repository';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { UserRepository } from './user.repository';

@Module({
  providers: [
    UserService,
    {
      provide: AuditRepository,
      useFactory: (em: SqlEntityManager) => new AuditRepository(em),
      inject: [SqlEntityManager],
    },
    {
      provide: UserRepository,
      useFactory: (em: SqlEntityManager, auditRepo: AuditRepository) =>
        new UserRepository(em, auditRepo),
      inject: [SqlEntityManager, AuditRepository],
    },
  ],
  exports: [UserRepository, UserService],
})
export class UserModule {}
