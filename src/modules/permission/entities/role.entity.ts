import {
  Entity,
  Property,
  Index,
  PrimaryKey,
  ManyToMany,
  Collection,
} from '@mikro-orm/core';
import { Permission } from './permission.entity';

export enum RoleType {
  ADMIN = 'admin',
  MANAGER = 'manager',
  WAITER = 'waiter',
  KITCHEN = 'kitchen',
  CASHIER = 'cashier',
}

@Entity()
@Index({ properties: ['name'] })
export class Role {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'string', unique: true })
  name!: RoleType;

  @Property({ nullable: true, type: 'text' })
  description?: string;

  @Property({ type: 'json', nullable: true })
  permissions?: string[];

  @ManyToMany(() => Permission)
  permissionEntities = new Collection<Permission>(this);
}
