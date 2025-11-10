import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  Index,
  Cascade,
} from '@mikro-orm/core';
import { OrderItem } from './order-item.entity.js';

@Entity()
@Index({ properties: ['tableId'] })
@Index({ properties: ['status'] })
export class Order {
  @PrimaryKey()
  id!: number;

  @Property()
  tableId!: number;

  @Property({ default: 'pending' })
  status: string = 'pending';

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
  })
  items = new Collection<OrderItem>(this);

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
