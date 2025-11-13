import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS } from '@src/modules/auth-ms/permission/permission.config';

/**
 * Utility type that transforms the nested `PERMISSIONS` object
 * into a union of strings in the format "category.action".
 *
 * Example:
 * ```
 * PERMISSIONS.kitchen.item.list → "kitchen.item.list"
 * ```
 */
type FlattenPermissions<T> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? `${Extract<K, string>}.${Extract<keyof T[K], string>}`
    : never;
}[keyof T];

/**
 * Represents all valid permission keys in the system,
 * derived from the `PERMISSIONS` object.
 *
 * Example values:
 * - "company.create"
 * - "user.invite"
 * - "kitchen.item.list"
 */
export type PermissionKey = FlattenPermissions<typeof PERMISSIONS>;

/**
 * Metadata key used internally by the `PermissionGuard`
 * to retrieve the permissions required for a route/endpoint.
 */
export const PERMISSIONS_METADATA_KEY = 'permissions';

/**
 * ### Requires a user to have **all specified permissions** (AND logic).
 *---
 * When applied to a route/endpoint, the `PermissionGuard` will check if the user
 * possesses each of the provided permissions. If any permission is missing,
 * a `ForbiddenException` will be thrown.
 *
 * @example
 * ```ts
 * @RequirePermission('kitchen.item.list', 'user.invite')
 * getItems() { ... }
 * ```
 */
export const RequirePermission = (...permissions: PermissionKey[]) =>
  SetMetadata(PERMISSIONS_METADATA_KEY, permissions);
