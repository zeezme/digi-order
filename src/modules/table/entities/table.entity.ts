import { Entity, Index, Property } from '@mikro-orm/core';
import { BaseEntity } from '@src/util/entities/base.entity';

@Entity()
@Index({ properties: ['companyId', 'isOccupied', 'deletedAt'] })
@Index({ properties: ['companyId', 'number'] })
export class Table extends BaseEntity {
  @Property()
  number!: string;

  @Property({ default: false })
  isOccupied: boolean = false;

  @Property({ nullable: true })
  currentOrderId?: number;

  @Property({ default: 4 })
  capacity: number = 4;

  @Property({ nullable: true })
  section?: string; // dining area section

  @Property({ default: true })
  isActive: boolean = true;

  @Property({ nullable: true })
  occupiedAt?: Date;

  @Property({ nullable: true })
  occupiedBy?: number; // userId of waiter who seated the table
}
