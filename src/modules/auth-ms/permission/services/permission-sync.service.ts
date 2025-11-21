import { Injectable, OnModuleInit } from '@nestjs/common';
import { PERMISSIONS, ROLES } from '../permission.config';
import { PermissionRepository, RoleRepository } from '../permission.repository';
import { RoleType } from '../entities/role.entity';

@Injectable()
export class PermissionSyncService implements OnModuleInit {
  constructor(
    private readonly permissionRepo: PermissionRepository,
    private readonly roleRepo: RoleRepository,
  ) {}

  async onModuleInit() {
    await this.syncAll();
  }

  private async syncAll() {
    await this.syncPermissions();
    await this.syncRoles();
  }

  private async syncPermissions() {
    this.permissionRepo.setSystemAudit(true);
    let created = 0;
    let updated = 0;
    let deleted = 0;

    try {
      const permissionsInCode: { key: string; description: string }[] = [];
      const permissionKeysInCode = new Set<string>();

      for (const [moduleName, actions] of Object.entries(PERMISSIONS)) {
        for (const [action, description] of Object.entries(actions)) {
          const key = `${moduleName}.${action}`;
          permissionsInCode.push({ key, description });
          permissionKeysInCode.add(key);
        }
      }

      console.log(`Sincronizando ${permissionsInCode.length} permissões...`);

      for (const perm of permissionsInCode) {
        const { action } = await this.permissionRepo.upsertByKey(perm.key, {
          description: perm.description,
        });

        switch (action) {
          case 'created':
            created++;
            break;
          case 'updated':
            updated++;
            break;
        }
      }

      const allExisting = await this.permissionRepo.findAllEntities();
      for (const perm of allExisting) {
        if (!permissionKeysInCode.has(perm.key)) {
          await this.permissionRepo.deleteEntity({ entity: perm });
          deleted++;
        }
      }
    } finally {
      this.permissionRepo.setSystemAudit(false);
    }

    console.log(
      `Permissões sincronizadas: ${created} criadas, ${updated} atualizadas, ${deleted} excluídas.`,
    );
  }

  private async syncRoles() {
    this.roleRepo.setSystemAudit(true);
    console.log('Sincronizando roles padrão...');

    let created = 0;
    let updated = 0;
    let deleted = 0;
    const roleNamesInCode = new Set(Object.keys(ROLES));

    try {
      for (const [roleType, config] of Object.entries(ROLES)) {
        const action = await this.upsertRole(
          roleType as RoleType,
          config.description,
          config.permissions,
        );

        switch (action) {
          case 'created':
            created++;
            break;
          case 'updated':
            updated++;
            break;
        }
      }

      const allExisting = await this.roleRepo.findAllEntities();
      for (const role of allExisting) {
        if (!roleNamesInCode.has(role.name)) {
          await this.roleRepo.deleteEntity({ entity: role });
          deleted++;
        }
      }
    } finally {
      this.roleRepo.setSystemAudit(false);
    }

    console.log(
      `Roles sincronizados: ${created} criados, ${updated} atualizados, ${deleted} excluídos.`,
    );
  }

  private async upsertRole(
    name: RoleType,
    description: string,
    permissionKeys: readonly string[],
  ): Promise<'created' | 'updated' | 'skipped'> {
    const existingRole = await this.roleRepo.findByNameWithPermissions(name);
    const normalizedKeys = [...new Set(permissionKeys)].sort();

    const permissionEntities =
      await this.permissionRepo.findByKeys(normalizedKeys);

    const hasChanges = (): boolean => {
      if (!existingRole) return true;
      if (existingRole.description !== description) return true;

      const currentKeys = existingRole.permissionEntities
        .getItems()
        .map((p) => p.key)
        .sort();

      if (currentKeys.length !== normalizedKeys.length) return true;
      return currentKeys.some((k, i) => k !== normalizedKeys[i]);
    };

    if (existingRole) {
      if (!hasChanges()) {
        return 'skipped';
      }

      existingRole.description = description;

      existingRole.permissionEntities.set(permissionEntities);

      await this.roleRepo.getEntityManager().flush();
      return 'updated';
    }

    await this.roleRepo.createEntity({
      data: {
        name,
        description,
        permissionEntities,
      },
    });

    await this.roleRepo.getEntityManager().flush();
    return 'created';
  }
}
