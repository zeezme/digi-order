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

  async findBySupabaseId(supabaseId: string): Promise<User | null> {
    return this.findOneBy({ supabaseId, deletedAt: null });
  }

  async findBySupabaseIds(ids: (number | string)[]): Promise<User[]> {
    const numericIds = ids
      .map((id) => (typeof id === 'string' ? parseInt(id, 10) : id))
      .filter((id) => typeof id === 'number' && !isNaN(id));

    return this.em.find(User, {
      id: { $in: numericIds },
      isActive: true,
      deletedAt: null,
    });
  }

  async findByEmail(email: string, companyId: number): Promise<User | null> {
    return this.findOneBy({ email, companyId, deletedAt: null });
  }

  async findActiveUsersByCompany(companyId: number): Promise<User[]> {
    return this.findAllEntities({ companyId, isActive: true, deletedAt: null });
  }

  async existsBySupabaseId(supabaseId: string): Promise<boolean> {
    return this.exists({ supabaseId, deletedAt: null });
  }
}
