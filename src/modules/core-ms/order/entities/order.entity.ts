import {
  Entity,
  Property,
  OneToMany,
  Collection,
  Index,
  Cascade,
  ManyToOne,
  OneToOne,
} from '@mikro-orm/core';
import { BaseEntity } from '@src/util/entities/base.entity';
import { Table } from '@src/modules/core-ms/table/entities/table.entity';
import { KitchenItem } from '@src/modules/core-ms/kitchen/entities/kitchen-item.entity';
import { OrderItem } from './order-item.entity';

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
@Index({ properties: ['companyId', 'table', 'deletedAt'] })
@Index({ properties: ['companyId', 'status', 'deletedAt'] })
@Index({ properties: ['companyId', 'createdAt'] })
export class Order extends BaseEntity {
  @ManyToOne(() => Table)
  table!: Table;

  @Property()
  @Index()
  companyId!: number;

  @OneToOne(() => Table, (table) => table.currentOrder, { nullable: true })
  currentTable?: Table;

  @Property({ type: 'string', default: OrderStatus.PENDING })
  @Index()
  status: OrderStatus = OrderStatus.PENDING;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
  })
  items = new Collection<OrderItem>(this);

  @OneToMany(() => KitchenItem, (item) => item.order)
  kitchenItems = new Collection<KitchenItem>(this);

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

  @Property({ nullable: true })
  serverId?: number;
}
