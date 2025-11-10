import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';

@Entity()
@Index({ properties: ['name'] })
export class MenuItem {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property()
  price!: number;

  @Property({ default: true })
  isAvailable: boolean = true;

  @Property({ nullable: true })
  category?: string;

  @Property({ nullable: true })
  tags?: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
