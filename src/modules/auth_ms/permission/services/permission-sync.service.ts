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
    const permissions: { key: string; description: string }[] = [];

    for (const [moduleName, actions] of Object.entries(PERMISSIONS)) {
      for (const [action, description] of Object.entries(actions)) {
        permissions.push({
          key: `${moduleName}.${action}`,
          description,
        });
      }
    }

    console.log(`Sincronizando ${permissions.length} permissões...`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const perm of permissions) {
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
        case 'skipped':
          skipped++;
          break;
      }
    }

    console.log(
      `Permissões sincronizadas: ${created} criadas, ${updated} atualizadas, ${skipped} ignoradas.`,
    );
  }

  private async syncRoles() {
    console.log('Sincronizando roles padrão...');

    let created = 0;
    let updated = 0;
    let skipped = 0;

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
        case 'skipped':
          skipped++;
          break;
      }
    }

    console.log(
      `Roles sincronizados: ${created} criados, ${updated} atualizados, ${skipped} ignoradas.`,
    );
  }

  private async upsertRole(
    name: RoleType,
    description: string,
    permissionKeys: readonly string[],
  ): Promise<'created' | 'updated' | 'skipped'> {
    this.roleRepo.setSystemAudit(true);

    try {
      const existingRole = await this.roleRepo.findByName(name);
      const normalizedNewKeys = [...new Set(permissionKeys)].sort();

      const hasChanges = () => {
        if (!existingRole) return true;
        if (existingRole.description !== description) return true;
        const currentKeys = (existingRole.permissions || []).sort();
        return (
          JSON.stringify(currentKeys) !== JSON.stringify(normalizedNewKeys)
        );
      };

      if (existingRole) {
        if (!hasChanges()) {
          return 'skipped';
        }

        await this.roleRepo.updateEntity(existingRole, {
          description,
          permissions: normalizedNewKeys,
        });

        return 'updated';
      }

      await this.roleRepo.createEntity({
        name,
        description,
        permissions: normalizedNewKeys,
      });

      return 'created';
    } finally {
      this.roleRepo.setSystemAudit(false);
    }
  }
}
