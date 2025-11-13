import { Entity, Property, Index, PrimaryKey } from '@mikro-orm/core';

@Entity()
@Index({ properties: ['slug'] })
@Index({ properties: ['isActive', 'deletedAt'] })
export class Company {
  @PrimaryKey()
  id!: number;

  @Property()
  @Index()
  name!: string;

  @Property({ unique: true })
  slug!: string;

  @Property({ default: true })
  isActive: boolean = true;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  @Index()
  deletedAt?: Date;
}
