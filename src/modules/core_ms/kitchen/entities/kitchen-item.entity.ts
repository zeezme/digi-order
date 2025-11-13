import { Entity, Property, Index, ManyToOne, OneToOne } from '@mikro-orm/core';
import { MenuItem } from '@src/modules/core_ms/menu/entities/menu-item.entity';
import { OrderItem } from '@src/modules/core_ms/order/entities/order-item.entity';
import { Order } from '@src/modules/core_ms/order/entities/order.entity';
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
@Index({ properties: ['companyId', 'order'] }) // 'orderId' mudou para 'order'
@Index({ properties: ['companyId', 'deletedAt'] })
export class KitchenItem extends BaseEntity {
  @ManyToOne(() => Order)
  order!: Order;

  @ManyToOne(() => MenuItem)
  menuItem!: MenuItem;

  @OneToOne(() => OrderItem, (item) => item.kitchenItem, {
    mappedBy: 'kitchenItem',
    nullable: true,
  })
  orderItem?: OrderItem;

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
