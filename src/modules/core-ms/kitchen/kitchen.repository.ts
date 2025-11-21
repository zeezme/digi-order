import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/util/repository/base.repository';
import { KitchenItem } from './entities/kitchen-item.entity';
import { KitchenItemStatus } from './entities/kitchen-item.entity';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { AuditRepository } from '@src/util/repository/audit.repository';

@Injectable()
export class KitchenItemRepository extends BaseRepository<KitchenItem> {
  constructor(em: SqlEntityManager, auditRepo: AuditRepository) {
    super(em, KitchenItem, auditRepo, 'KitchenItem');
  }

  async findAllByCompany(companyId: number) {
    return this.findAllEntities({ where: { companyId } });
  }

  async findOneByIdAndCompany(id: number, companyId: number) {
    return this.findOneBy({ where: { id, companyId } });
  }

  async findByOrderIdAndCompany(orderId: number, companyId: number) {
    return this.findAllEntities({ where: { order: orderId, companyId } });
  }

  async findByStatusAndCompany(status: KitchenItemStatus, companyId: number) {
    return this.findAllEntities({ where: { status, companyId } });
  }

  async updateStatusWithCompany(
    id: number,
    status: KitchenItemStatus,
    companyId: number,
  ) {
    const item = await this.findOneByIdAndCompany(id, companyId);
    if (!item) return null;

    item.status = status;
    await this.updateEntity({ data: { status }, entity: item });
    return item;
  }

  async deleteByIdAndCompany(id: number, companyId: number) {
    const item = await this.findOneByIdAndCompany(id, companyId);
    if (!item) return false;

    await this.deleteEntity({ entity: item });
    return true;
  }
}
