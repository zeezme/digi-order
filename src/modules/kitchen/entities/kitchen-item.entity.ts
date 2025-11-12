import { Entity, Property, Index } from '@mikro-orm/core';
import { BaseEntity } from '@src/util/entities/base.entity';

export enum KitchenItemStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  READY = 'ready',
  SERVED = 'served',
  CANCELLED = 'cancelled',
}

@Entity()
@Index({ properties: ['companyId', 'status'] })
@Index({ properties: ['companyId', 'orderId'] })
@Index({ properties: ['companyId', 'deletedAt'] })
export class KitchenItem extends BaseEntity {
  @Property()
  orderId!: number;

  @Property()
  menuItemId!: number;

  @Property({ type: 'string', default: KitchenItemStatus.PENDING })
  @Index()
  status: KitchenItemStatus = KitchenItemStatus.PENDING;

  @Property({ nullable: true })
  startedAt?: Date;

  @Property({ nullable: true })
  completedAt?: Date;

  @Property({ nullable: true })
  estimatedCompletionTime?: Date;

  @Property({ nullable: true })
  notes?: string;

  @Property({ nullable: true })
  preparedBy?: number;
}
