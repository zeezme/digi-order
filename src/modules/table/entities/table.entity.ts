import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
@Index({ properties: ['isOccupied'] })
export class Table {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  number!: string;

  @Property({ default: false })
  isOccupied: boolean = false;

  @Property({ nullable: true })
  currentOrderId?: number;
}
