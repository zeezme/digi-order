import { Injectable } from '@nestjs/common';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { BaseRepository } from '@src/util/repository/base.repository';
import { AuditRepository } from '@src/util/repository/audit.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(em: SqlEntityManager, auditRepo?: AuditRepository) {
    super(em, User, auditRepo, 'User');
  }

  async findByEmail(email: string, companyId: number): Promise<User | null> {
    return this.findOneBy({ where: { email, companyId, deletedAt: null } });
  }

  async findActiveUsersByCompany(companyId: number): Promise<User[]> {
    return this.findAllEntities({
      where: { companyId, isActive: true, deletedAt: null },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.exists({ where: { email, deletedAt: null } });
  }
}
