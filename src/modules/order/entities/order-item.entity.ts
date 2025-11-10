import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { Order } from './order.entity';

@Entity()
@Index({ properties: ['order'] })
export class OrderItem {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Order)
  order!: Order;

  @Property()
  menuItemId!: number;

  @Property()
  quantity!: number;

  @Property({ nullable: true })
  notes?: string;
}
