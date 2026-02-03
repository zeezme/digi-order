import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import {
  PermissionKey,
  PERMISSIONS_METADATA_KEY,
} from '../decorators/require-permission.decorator';
import { ROLES_METADATA_KEY } from '../decorators/require-role.decorator';
import { PermissionService } from '@src/modules/auth-ms/permission/services/permission.service';
import { RoleType } from '@src/modules/auth-ms/permission/entities/role.entity';
import { ROLES } from '@src/modules/auth-ms/permission/permission.config';

/**
 * ### Guard responsible for validating a user's access based on
 * ### their roles and associated permissions.
 * ---
 * ### Rules:
 * - If no decorator is applied, access is granted.
 * - If only `@RequireRole` is applied, the guard requires:
 *   - That the user has at least one of the specified roles;
 *   - And all permissions associated with those roles in the ROLES config.
 * - If only `@RequirePermission` is applied, the guard requires all specified permissions (AND logic).
 * - If both decorators are applied, the guard checks both the roles and the specific permissions.
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionKey[]
    >(PERMISSIONS_METADATA_KEY, [context.getHandler(), context.getClass()]);

    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length && !requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.user?.id;
    const companyId = request.company?.id;

    if (!userId || !companyId) {
      throw new ForbiddenException('User or company context missing');
    }

    if (requiredRoles?.length) {
      const hasRole = await this.hasRequiredRole(
        userId,
        companyId,
        requiredRoles,
      );

      if (!hasRole) {
        throw new ForbiddenException(
          `Required role: ${requiredRoles.join(' or ')}`,
        );
      }

      if (!requiredPermissions?.length) {
        const rolePermissions = requiredRoles.flatMap((role) => {
          const roleDef = ROLES[role];
          return roleDef?.permissions ?? [];
        }) as PermissionKey[];

        const hasAllRolePerms = await this.hasRequiredPermissions(
          userId,
          companyId,
          rolePermissions,
        );

        if (!hasAllRolePerms) {
          throw new ForbiddenException(
            `Missing permissions from role: ${requiredRoles.join(' or ')}`,
          );
        }
      }
    }

    if (requiredPermissions?.length) {
      const hasPermission = await this.hasRequiredPermissions(
        userId,
        companyId,
        requiredPermissions,
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          `Missing permission(s): ${requiredPermissions.join(', ')}`,
        );
      }
    }

    return true;
  }

  private async hasRequiredRole(
    userId: number,
    companyId: number,
    requiredRoles: RoleType[],
  ): Promise<boolean> {
    const userRoles = await this.permissionService.getUserRoles(
      userId,
      companyId,
    );
    const roleIds = userRoles.map((ur) => ur.role.id);
    if (roleIds.length === 0) return false;

    const roles = await this.permissionService.roleRepository.findAllEntities({
      where: {
        id: { $in: roleIds },
      },
    });

    return requiredRoles.some((role) => roles.some((r) => r.name === role));
  }

  private async hasRequiredPermissions(
    userId: number,
    companyId: number,
    requiredPermissions: PermissionKey[],
  ): Promise<boolean> {
    const userPermissions = await this.permissionService.getUserPermissions(
      userId,
      companyId,
    );
    return requiredPermissions.every((perm) => userPermissions.includes(perm));
  }
}
