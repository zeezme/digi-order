import { Injectable } from '@nestjs/common';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { BaseRepository } from 'src/util/repository/base.repository';
import { AuditRepository } from 'src/util/repository/audit.repository';
import { KitchenItem, KitchenItemStatus } from './entities/kitchen-item.entity';

@Injectable()
export class KitchenItemRepository extends BaseRepository<KitchenItem> {
  constructor(em: SqlEntityManager, auditRepo?: AuditRepository) {
    super(em, KitchenItem, auditRepo, 'KitchenItem');
  }

  async findByOrderId(orderId: number): Promise<KitchenItem[]> {
    return this.findAllEntities({ orderId });
  }

  async findByStatus(status: KitchenItemStatus): Promise<KitchenItem[]> {
    return this.findAllEntities({ status });
  }

  async findPendingByOrderId(orderId: number): Promise<KitchenItem[]> {
    return this.findAllEntities({ orderId, status: KitchenItemStatus.PENDING });
  }

  async updateStatus(
    id: number,
    status: KitchenItemStatus,
  ): Promise<KitchenItem> {
    const item = await this.findById(id);
    if (!item) {
      throw new Error(`Kitchen item with ID ${id} not found`);
    }
    return this.updateEntity(item, { status });
  }

  async countByStatus(status: KitchenItemStatus): Promise<number> {
    return this.countBy({ status });
  }
}
