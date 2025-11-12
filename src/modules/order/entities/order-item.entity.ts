import { Entity, Property, ManyToOne, Index } from '@mikro-orm/core';
import { Order } from './order.entity';
import { BaseEntity } from '@src/util/entities/base.entity';

@Entity()
@Index({ properties: ['companyId', 'order'] })
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order)
  order!: Order;

  @Property()
  menuItemId!: number;

  @Property()
  quantity!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number; // Snapshot price at time of order

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: number; // quantity * unitPrice

  @Property({ nullable: true, type: 'text' })
  notes?: string;

  // Link to kitchen items for this order item
  @Property({ nullable: true })
  kitchenItemId?: number;
}
