import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';

@Entity()
@Index({ properties: ['type', 'read'] })
export class Notification {
  @PrimaryKey()
  id!: number;

  @Property()
  message!: string;

  @Property()
  type!: string;

  @Property({ default: false })
  read: boolean = false;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
