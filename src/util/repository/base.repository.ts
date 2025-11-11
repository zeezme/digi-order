import { EntityRepository } from '@mikro-orm/postgresql';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { FilterQuery, FindOptions, EntityData, wrap } from '@mikro-orm/core';
import { AuditRepository } from './audit.repository';

/**
 * ### BaseRepository provides common CRUD operations and optional audit logging
 * ### for all MikroORM entities. It extends `EntityRepository` from MikroORM.
 *
 * @template T - The entity type.
 */
export abstract class BaseRepository<
  T extends object,
> extends EntityRepository<T> {
  /** Optional callback triggered when a database operation fails, used for audit logging */
  private auditCallback?: (
    error: Error,
    context?: Record<string, any>,
  ) => Promise<void>;

  /**
   * Creates an instance of BaseRepository.
   *
   * @param em - The MikroORM SqlEntityManager instance.
   * @param entityClass - The entity class this repository manages.
   * @param auditRepo - Optional AuditRepository to automatically log errors.
   * @param entityType - Optional string identifier for the entity type (used in audit logs).
   */
  constructor(
    em: SqlEntityManager,
    entityClass: new () => T,
    auditRepo?: AuditRepository,
    entityType?: string,
  ) {
    super(em, entityClass);

    if (auditRepo && entityType) {
      this.setAuditCallback(async (error, context) => {
        const companyId = Number(
          (context?.data as { companyId?: unknown })?.companyId ?? 0,
        );

        await auditRepo.logAction({
          companyId,
          entityType,
          action: 'ERROR',
          newValues: {
            message: error.message,
            stack: error.stack,
            context,
          },
        });
      });
    }
  }

  /**
   * Sets a callback function for audit/error logging.
   *
   * @param callback - Function called when a database operation fails.
   */
  public setAuditCallback(
    callback: (error: Error, context?: Record<string, any>) => Promise<void>,
  ) {
    this.auditCallback = callback;
  }

  /**
   * Returns a string representation of the entity name.
   *
   * @returns The entity name as a string.
   */
  public getEntityName(): string {
    const name = this.entityName;
    if (typeof name === 'string') return name;
    if (typeof name === 'function' && name.name) return name.name;
    return 'UnknownEntity';
  }

  /**
   * Handles errors internally and triggers the audit callback if set.
   *
   * @param error - The error thrown by a database operation.
   * @param context - Optional context for the audit log.
   * @throws The original error after logging.
   */
  private async handleError(error: Error, context: Record<string, any>) {
    const entityName = this.getEntityName();
    console.error(`[${entityName}] Database operation failed:`, error);

    if (this.auditCallback) {
      try {
        await this.auditCallback(error, context);
      } catch (auditError) {
        console.error('[Audit Logging Failed]', auditError);
      }
    }

    throw error;
  }

  /**
   * Finds all entities optionally filtered by conditions.
   *
   * @param where - Optional filter conditions.
   * @param options - Optional find options (populate, orderBy, limit, etc.).
   * @returns A promise resolving to an array of entities.
   */
  async findAllEntities(
    where?: FilterQuery<T>,
    options?: FindOptions<T>,
  ): Promise<T[]> {
    return this.find(where || {}, options);
  }

  /**
   * Finds a single entity by its primary key.
   *
   * @param id - The entity's primary key.
   * @returns A promise resolving to the entity or null if not found.
   */
  async findById(id: number | string): Promise<T | null> {
    return this.findOne({ id } as FilterQuery<T>);
  }

  /**
   * Finds a single entity matching the given filter.
   *
   * @param where - Filter conditions.
   * @returns A promise resolving to the entity or null if not found.
   */
  async findOneBy(where: FilterQuery<T>): Promise<T | null> {
    return this.findOne(where);
  }

  /**
   * Creates a new entity and persists it to the database.
   *
   * @param data - Entity data to create.
   * @returns A promise resolving to the created entity.
   * @throws The error is logged and rethrown if the operation fails.
   */
  async createEntity(data: EntityData<T>): Promise<T> {
    try {
      const entity = this.create(data as any);
      await this.getEntityManager().persistAndFlush(entity);
      return entity;
    } catch (error) {
      await this.handleError(error as Error, { action: 'create', data });
      throw error;
    }
  }

  /**
   * Updates an existing entity with new data.
   *
   * @param entity - The entity to update.
   * @param data - Partial entity data to update.
   * @returns A promise resolving to the updated entity.
   * @throws The error is logged and rethrown if the operation fails.
   */
  async updateEntity(entity: T, data: Partial<T>): Promise<T> {
    try {
      wrap(entity).assign(data as any);
      await this.getEntityManager().flush();
      return entity;
    } catch (error) {
      await this.handleError(error as Error, { action: 'update', data });
      throw error;
    }
  }

  /**
   * Deletes a given entity from the database.
   *
   * @param entity - The entity to delete.
   * @throws The error is logged and rethrown if the operation fails.
   */
  async deleteEntity(entity: T): Promise<void> {
    try {
      await this.getEntityManager().removeAndFlush(entity);
    } catch (error) {
      await this.handleError(error as Error, { action: 'delete', entity });
      throw error;
    }
  }

  /**
   * Deletes an entity by its primary key.
   *
   * @param id - The primary key of the entity to delete.
   * @returns A promise resolving to true if the entity was deleted, false if not found.
   * @throws The error is logged and rethrown if the operation fails.
   */
  async deleteById(id: number | string): Promise<boolean> {
    try {
      const entity = await this.findById(id);
      if (!entity) return false;
      await this.deleteEntity(entity);
      return true;
    } catch (error) {
      await this.handleError(error as Error, { action: 'deleteById', id });
      throw error;
    }
  }

  /**
   * Counts entities matching the optional filter.
   *
   * @param where - Optional filter conditions.
   * @returns A promise resolving to the number of matching entities.
   */
  async countBy(where?: FilterQuery<T>): Promise<number> {
    return this.count(where || {});
  }

  /**
   * Checks whether at least one entity matches the given filter.
   *
   * @param where - Filter conditions.
   * @returns A promise resolving to true if at least one entity exists, false otherwise.
   */
  async exists(where: FilterQuery<T>): Promise<boolean> {
    const count = await this.count(where);
    return count > 0;
  }
}
