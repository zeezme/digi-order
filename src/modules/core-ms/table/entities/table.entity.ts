import {
  Entity,
  Index,
  Property,
  OneToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { Order } from '@src/modules/core-ms/order/entities/order.entity';
import { BaseEntity } from '@src/util/entities/base.entity';

@Entity()
@Index({ properties: ['companyId', 'isOccupied', 'deletedAt'] })
@Index({ properties: ['companyId', 'number'] })
export class Table extends BaseEntity {
  @Property()
  number!: string;

  @Property({ default: false })
  isOccupied: boolean = false;

  @OneToOne(() => Order, {
    fieldName: 'current_order_id',
    nullable: true,
    orphanRemoval: false,
  })
  currentOrder?: Order;

  @OneToMany(() => Order, (order) => order.table)
  orders = new Collection<Order>(this);

  @Property({ default: 4 })
  capacity: number = 4;

  @Property({ nullable: true })
  section?: string;

  @Property({ default: true })
  isActive: boolean = true;

  @Property({ nullable: true })
  occupiedAt?: Date;

  @Property({ nullable: true })
  occupiedBy?: number;
}
