import { Entity, Property, ManyToOne, Index, OneToOne } from '@mikro-orm/core';
import { Order } from './order.entity';
import { BaseEntity } from '@src/util/entities/base.entity';
import { MenuItem } from '@src/modules/core_ms/menu/entities/menu-item.entity';
import { KitchenItem } from '@src/modules/core_ms/kitchen/entities/kitchen-item.entity';

@Entity()
@Index({ properties: ['companyId', 'order'] })
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order)
  order!: Order;

  @ManyToOne(() => MenuItem)
  menuItem!: MenuItem;

  @Property()
  quantity!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: number;

  @Property({ nullable: true, type: 'text' })
  notes?: string;

  @OneToOne(() => KitchenItem, {
    fieldName: 'kitchen_item_id',
    nullable: true,
    orphanRemoval: false,
  })
  kitchenItem?: KitchenItem;
}
