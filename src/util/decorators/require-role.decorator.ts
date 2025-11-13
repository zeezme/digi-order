import { SetMetadata } from '@nestjs/common';
import { RoleType } from '@src/modules/auth-ms/permission/entities/role.entity';

export const ROLES_METADATA_KEY = 'roles';

/**
 * Converts the RoleType enum values into string literal types.
 */
type RoleTypeValue = `${RoleType}`;

/**
 * ### Requires the user to have **at least one** of the specified roles (OR logic).
 *---
 * When applied to a route or controller, the `PermissionGuard` will check
 * if the authenticated user has any of the roles provided.
 *
 * ---
 * If no `@RequirePermission` decorator is applied, the guard will also
 * enforce all permissions associated with the role(s) in the system config.
 *
 * ---
 *
 * @example
 * ```ts
 *  @RequireRole('ADMIN', 'KITCHEN')
 *  getKitchenItems() {
 *    // your handler logic here
 *  }
 * ```
 *
 * @param roles - One or more role names as strings, e.g., 'ADMIN', 'KITCHEN'.
 */
export const RequireRole = (...roles: RoleTypeValue[]) =>
  SetMetadata(ROLES_METADATA_KEY, roles);
