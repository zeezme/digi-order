import { Injectable } from '@nestjs/common';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { BaseRepository } from '@src/util/repository/base.repository';
import { AuditRepository } from '@src/util/repository/audit.repository';
import { Credential } from './entities/credential.entity';

@Injectable()
export class CredentialRepository extends BaseRepository<Credential> {
  constructor(em: SqlEntityManager, auditRepo?: AuditRepository) {
    super(em, Credential, auditRepo, 'Credential');
  }

  async findByEmail(email: string) {
    return this.findOne({ user: { email } }, { populate: ['user'] });
  }

  async findByUserId(userId: number) {
    return this.findOne({ user: userId });
  }

  async incrementFailedAttempts(credential: Credential) {
    credential.failedAttempts += 1;

    await this.getEntityManager().persist(credential).flush();
  }

  async lockUser(credential: Credential, until: Date) {
    credential.lockedUntil = until;

    await this.getEntityManager().persist(credential).flush();
  }

  async resetFailures(credential: Credential) {
    credential.failedAttempts = 0;

    credential.lockedUntil = undefined;

    await this.getEntityManager().persist(credential).flush();
  }
}
