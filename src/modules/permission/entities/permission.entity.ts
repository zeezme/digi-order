import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class Permission {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  key!: string;

  @Property()
  description!: string; // ex: "Criar empresa"

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
