import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';

@Entity()
@Index({ properties: ['status'] })
@Index({ properties: ['orderId'] })
export class KitchenItem {
  @PrimaryKey()
  id!: number;

  @Property()
  orderId!: number;

  @Property()
  menuItemId!: number;

  @Property({ default: 'pending' })
  status: string = 'pending';

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
