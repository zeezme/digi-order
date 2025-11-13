import {
  Entity,
  Property,
  Index,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { KitchenItem } from '@src/modules/core-ms/kitchen/entities/kitchen-item.entity';
import { OrderItem } from '@src/modules/core-ms/order/entities/order-item.entity';
import { BaseEntity } from '@src/util/entities/base.entity';

@Entity()
@Index({ properties: ['companyId', 'name'] })
@Index({ properties: ['companyId', 'isAvailable', 'deletedAt'] })
@Index({ properties: ['companyId', 'category'] })
export class MenuItem extends BaseEntity {
  @Property()
  name!: string;

  @Property({ nullable: true, type: 'text' })
  description?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @OneToMany(() => OrderItem, (item) => item.menuItem)
  orderItems = new Collection<OrderItem>(this);

  @OneToMany(() => KitchenItem, (item) => item.menuItem)
  kitchenItems = new Collection<KitchenItem>(this);

  @Property({ default: true })
  isAvailable: boolean = true;

  @Property({ nullable: true })
  category?: string;

  @Property({ nullable: true, type: 'json' })
  tags?: string[];

  @Property({ nullable: true })
  imageUrl?: string;

  @Property({ default: 0 })
  preparationTimeMinutes: number = 0;

  @Property({ default: true })
  trackInventory: boolean = false;

  @Property({ nullable: true })
  currentStock?: number;

  @Property({ nullable: true })
  lowStockThreshold?: number;
}
