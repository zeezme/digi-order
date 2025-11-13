import { EntityRepository } from '@mikro-orm/postgresql';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import {
  FilterQuery,
  FindOptions,
  EntityData,
  wrap,
  EntityName,
  RequiredEntityData,
  helper,
} from '@mikro-orm/core';
import { AuditRepository } from './audit.repository';

/**
 * ### BaseRepository
 *
 * Generic repository with CRUD operations, optional audit logging and
 * **system-audit mode** for seeds / sync jobs.
 *
 * - `setSystemAudit(true)` forces `userId = SYSTEM_USER_ID` and `companyId = 0`
 *   in every audit entry.
 * - All methods are fully typed – only the minimal `as any` required by MikroORM.
 *
 * @template T - Managed entity type.
 */
export abstract class BaseRepository<
  T extends object,
> extends EntityRepository<T> {
  /** Audit callback (success / error). */
  private auditCallback?: (
    status: 'success' | 'error',
    action: string,
    context?: Record<string, any>,
  ) => Promise<void>;

  private enableSystemAudit = false;

  private readonly SYSTEM_USER_ID = '0';
  private readonly SYSTEM_COMPANY_ID = 0;

  /**
   * @param em          - MikroORM `SqlEntityManager`.
   * @param entityClass - Entity constructor.
   * @param auditRepo   - Optional `AuditRepository` for automatic logging.
   * @param entityType  - Entity name for audit logs (e.g. `'Permission'`).
   */
  constructor(
    em: SqlEntityManager,
    entityClass: new () => T,
    auditRepo?: AuditRepository,
    entityType?: string,
  ) {
    super(em, entityClass);

    if (auditRepo && entityType) {
      this.setAuditCallback(async (status, action, context) => {
        const finalCtx = this.buildAuditContext(context);

        const companyId = Number(
          finalCtx.companyId ??
            (finalCtx.data as { companyId?: unknown })?.companyId ??
            this.SYSTEM_COMPANY_ID,
        );

        await auditRepo.logAction({
          companyId,
          entityType,
          entityId: finalCtx.entityId, // Extract from context
          action: action.toUpperCase(),
          userId: finalCtx.userId,
          newValues: { status, context: finalCtx },
        });
      });
    }
  }

  /**
   * Enable / disable system-audit mode.
   *
   * @param enabled - `true` to force system identifiers in audit logs.
   */
  public setSystemAudit(enabled: boolean): void {
    this.enableSystemAudit = enabled;
  }

  private buildAuditContext(
    context: Record<string, any> = {},
  ): Record<string, any> {
    if (this.enableSystemAudit) {
      return {
        ...context,
        userId: this.SYSTEM_USER_ID,
        companyId: this.SYSTEM_COMPANY_ID,
      };
    }

    return {
      ...context,
      userId: context.userId ?? context.data?.__auditContext?.userId,
    };
  }

  /**
   * Register a custom audit callback.
   *
   * @param callback - Called on success or error.
   */
  public setAuditCallback(
    callback: (
      status: 'success' | 'error',
      action: string,
      context?: Record<string, any>,
    ) => Promise<void>,
  ): void {
    this.auditCallback = callback;
  }

  /**
   * Extract entity ID safely, handling different PK types.
   */
  private extractEntityId(entity: T): string | number | null {
    try {
      // Use helper function to get PK
      const pk = helper(entity).getPrimaryKey();

      // Handle undefined or null
      if (pk == null) {
        return null;
      }

      // Handle composite keys (array) - join with dash
      if (Array.isArray(pk)) {
        return pk.filter((v) => v != null).join('-') || null;
      }

      // Handle simple keys (string, number)
      return pk as string | number;
    } catch (error) {
      console.warn('[BaseRepository] Failed to extract entityId:', error);
      return null;
    }
  }

  private async handleAudit(
    status: 'success' | 'error',
    action: string,
    context: Record<string, any>,
  ): Promise<void> {
    if (!this.auditCallback) return;

    const entity = context.entity as T | undefined;
    const entityId = entity ? this.extractEntityId(entity) : null;

    const auditCtx = {
      ...this.buildAuditContext(context),
      entityId, // string | number | null
    };

    try {
      await this.auditCallback(status, action, auditCtx);
    } catch (auditError) {
      console.error(`[Audit Logging Failed: ${action}]`, auditError);
    }
  }

  public getEntityName(): string {
    const name: EntityName<T> = this.entityName;
    if (typeof name === 'string') return name;
    if (typeof name === 'function' && name.name) return name.name;
    return 'UnknownEntity';
  }

  private async handleError(
    error: Error,
    action: string,
    context: Record<string, any>,
  ): Promise<never> {
    console.error(`[${this.getEntityName()}] Operation failed:`, error);

    await this.handleAudit('error', action, { ...context, error });

    throw error;
  }

  // --------------------------------------------------------------------- //
  //                               CRUD METHODS
  // --------------------------------------------------------------------- //

  /**
   * Find all entities (optionally filtered).
   *
   * @param where   - Filter query.
   * @param options - Populate, orderBy, limit, etc.
   * @returns Array of entities.
   */
  async findAllEntities(
    where?: FilterQuery<T>,
    options?: FindOptions<T>,
  ): Promise<T[]> {
    return this.find(where ?? {}, options);
  }

  /**
   * Find entity by primary key.
   *
   * @param id - Primary key value.
   * @returns Entity or `null`.
   */
  async findById(id: number | string): Promise<T | null> {
    return this.findOne({ id } as FilterQuery<T>);
  }

  /**
   * Find one entity by arbitrary filter.
   *
   * @param where - Filter query.
   * @returns Entity or `null`.
   */
  async findOneBy(where: FilterQuery<T>): Promise<T | null> {
    return this.findOne(where);
  }

  /**
   * Create and persist a new entity.
   *
   * @param data - Entity data.
   * @returns Created entity.
   */
  async createEntity(data: EntityData<T>): Promise<T> {
    try {
      const entity = this.create(data as RequiredEntityData<T>);

      await this.getEntityManager().persistAndFlush(entity);

      await this.handleAudit('success', 'create', { data, entity });

      return entity;
    } catch (error) {
      await this.handleError(error as Error, 'create', { data });

      throw error;
    }
  }

  /**
   * Update an existing entity.
   *
   * @param entity - Entity instance.
   * @param data   - Partial data to assign.
   * @returns Updated entity.
   */
  async updateEntity(entity: T, data: Partial<T>): Promise<T> {
    try {
      wrap(entity).assign(data as any);

      await this.getEntityManager().flush();

      await this.handleAudit('success', 'update', { data, entity });

      return entity;
    } catch (error) {
      await this.handleError(error as Error, 'update', { data });

      throw error;
    }
  }

  /**
   * Delete a given entity.
   *
   * @param entity - Entity instance.
   */
  async deleteEntity(entity: T): Promise<void> {
    try {
      await this.getEntityManager().removeAndFlush(entity);

      await this.handleAudit('success', 'delete', { entity });
    } catch (error) {
      await this.handleError(error as Error, 'delete', { entity });

      throw error;
    }
  }

  /**
   * Delete entity by primary key.
   *
   * @param id - Primary key.
   * @returns `true` if deleted, `false` if not found.
   */
  async deleteById(id: number | string): Promise<boolean> {
    try {
      const entity = await this.findById(id);
      if (!entity) return false;
      await this.deleteEntity(entity);
      return true;
    } catch (error) {
      await this.handleError(error as Error, 'delete', { id });
      throw error;
    }
  }

  /**
   * Count entities matching a filter.
   *
   * @param where - Filter query.
   * @returns Number of matching rows.
   */
  async countBy(where?: FilterQuery<T>): Promise<number> {
    return this.count(where ?? {});
  }

  /**
   * Check if at least one entity matches the filter.
   *
   * @param where - Filter query.
   * @returns `true` if exists.
   */
  async exists(where: FilterQuery<T>): Promise<boolean> {
    return (await this.count(where)) > 0;
  }
}
