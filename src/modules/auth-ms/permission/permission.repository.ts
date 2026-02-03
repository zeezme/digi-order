import { Injectable } from '@nestjs/common';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { BaseRepository } from 'src/util/repository/base.repository';
import { AuditRepository } from 'src/util/repository/audit.repository';
import { Role, RoleType } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(em: SqlEntityManager, auditRepo?: AuditRepository) {
    super(em, Role, auditRepo, 'Role');
  }

  async findByName(name: RoleType): Promise<Role | null> {
    return this.findOneBy({ where: { name } });
  }

  async findByNameWithPermissions(name: RoleType): Promise<Role | null> {
    return this.findOneBy({
      where: { name },
      populate: ['permissionEntities'],
    });
  }
}

@Injectable()
export class UserRoleRepository extends BaseRepository<UserRole> {
  constructor(em: SqlEntityManager, auditRepo?: AuditRepository) {
    super(em, UserRole, auditRepo, 'UserRole');
  }

  async findByUserAndCompany(
    userId: number,
    companyId: number,
  ): Promise<UserRole[]> {
    return this.findAllEntities({
      where: {
        user: { id: userId },
        company: companyId,
        deletedAt: null,
      },
    });
  }

  async findUserRole(
    userId: number,
    companyId: number,
    roleId: number,
  ): Promise<UserRole | null> {
    return this.findOneBy({
      where: {
        user: { id: userId },
        company: companyId,
        role: roleId,
        deletedAt: null,
      },
    });
  }

  async hasRole(
    userId: number,
    companyId: number,
    roleId: number,
  ): Promise<boolean> {
    return this.exists({
      where: {
        user: { id: userId },
        company: companyId,
        role: roleId,
        deletedAt: null,
      },
    });
  }
}

@Injectable()
export class PermissionRepository extends BaseRepository<Permission> {
  constructor(em: SqlEntityManager, auditRepo?: AuditRepository) {
    super(em, Permission, auditRepo, 'Permission');
  }

  async findByKeys(keys: string[]): Promise<Permission[]> {
    if (keys.length === 0) return [];

    return this.createQueryBuilder('p')
      .where({ key: { $in: keys } })
      .getResult();
  }

  async upsertByKey(
    key: string,
    data: Partial<Permission>,
  ): Promise<{
    entity: Permission;
    action: 'created' | 'updated' | 'skipped';
  }> {
    this.setSystemAudit(true);

    try {
      const existing = await this.findOneBy({ where: { key } });

      if (existing) {
        const hasChanges = Object.entries(data).some(([field, newValue]) => {
          const currentValue = existing[field as keyof Permission];
          return currentValue !== newValue;
        });

        if (!hasChanges) {
          return { entity: existing, action: 'skipped' };
        }

        const updated = await this.updateEntity({ entity: existing, data });
        return { entity: updated, action: 'updated' };
      }

      const created = await this.createEntity({ data: { key, ...data } });
      return { entity: created, action: 'created' };
    } finally {
      this.setSystemAudit(false);
    }
  }
}
