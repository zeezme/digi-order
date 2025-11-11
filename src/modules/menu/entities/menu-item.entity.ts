import { Entity, Property, Index } from '@mikro-orm/core';
import { BaseEntity } from 'src/util/entities/base.entity';
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
