import { SqlEntityManager } from '@mikro-orm/postgresql';
import {
  AutoPath,
  FilterQuery,
  FindAllOptions,
  FindOptions,
} from '@mikro-orm/core';
import { BaseRepository } from './base.repository';
import { AuditLog } from '../entities/audit.entity';

export class AuditRepository extends BaseRepository<AuditLog> {
  constructor(em: SqlEntityManager) {
    super(em, AuditLog);
  }

  /**
   * Find all audit logs for a specific entity (e.g., an order or menu item)
   * @param entityType - Type of entity ('Order', 'MenuItem', etc.)
   * @param entityId - ID of the entity
   * @param options - Additional find options
   * @returns Promise with array of AuditLog
   */
  async findByEntity(
    entityType: string,
    entityId: number,
    options?: Pick<
      FindAllOptions<AuditLog>,
      'populate' | 'orderBy' | 'limit' | 'offset'
    >,
  ): Promise<AuditLog[]> {
    return this.findAllEntities({
      where: { entityType, entityId },
      ...options,
    });
  }

  /**
   * Find all audit logs for a company optionally filtered by user
   * @param companyId - ID of the company
   * @param userId - Optional user ID to filter by
   * @param options - Additional find options
   * @returns Promise with array of AuditLog
   */
  async findByCompany(
    companyId: number,
    userId?: number,
    options?: Omit<FindOptions<AuditLog>, 'populate'> & {
      populate?: readonly AutoPath<AuditLog, any>[];
    },
  ): Promise<AuditLog[]> {
    const where: FilterQuery<AuditLog> = { companyId };
    if (userId) where.userId = userId;
    return this.findAllEntities({ where, ...options });
  }

  /**
   * Create a new audit log entry
   * @param data - AuditLog data
   * @returns Promise with the created AuditLog
   */
  async logAction(data: Partial<AuditLog>): Promise<AuditLog> {
    return this.createEntity({ data });
  }
}
