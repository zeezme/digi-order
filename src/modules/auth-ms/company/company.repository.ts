import { Injectable } from '@nestjs/common';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { BaseRepository } from 'src/util/repository/base.repository';
import { AuditRepository } from 'src/util/repository/audit.repository';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyRepository extends BaseRepository<Company> {
  constructor(em: SqlEntityManager, auditRepo?: AuditRepository) {
    super(em, Company, auditRepo, 'Company');
  }

  async findBySlug(slug: string): Promise<Company | null> {
    return this.findOneBy({ where: { slug, deletedAt: null } });
  }

  async findActiveCompanies(): Promise<Company[]> {
    return this.findAllEntities({ where: { isActive: true, deletedAt: null } });
  }
}
