import {
  Entity,
  Property,
  OneToMany,
  Collection,
  Index,
  Cascade,
} from '@mikro-orm/core';
import { OrderItem } from './order-item.entity';
import { BaseEntity } from '@src/util/entities/base.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  READY = 'ready',
  SERVED = 'served',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}
@Entity()
@Index({ properties: ['companyId', 'tableId', 'deletedAt'] })
@Index({ properties: ['companyId', 'status', 'deletedAt'] })
@Index({ properties: ['companyId', 'createdAt'] })
export class Order extends BaseEntity {
  @Property()
  tableId!: number;

  @Property({ type: 'string', default: OrderStatus.PENDING })
  @Index()
  status: OrderStatus = OrderStatus.PENDING;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
  })
  items = new Collection<OrderItem>(this);

  @Property({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number = 0;

  @Property({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number = 0;

  @Property({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number = 0;

  @Property({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number = 0;

  @Property({ nullable: true })
  confirmedAt?: Date;

  @Property({ nullable: true })
  completedAt?: Date;

  @Property({ nullable: true })
  paidAt?: Date;

  @Property({ nullable: true, type: 'text' })
  notes?: string;

  // Waiter/server who took the order
  @Property({ nullable: true })
  serverId?: number; // userId
}
