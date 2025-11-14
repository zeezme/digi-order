import {
  Entity,
  Property,
  Index,
  PrimaryKey,
  ManyToMany,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { Permission } from './permission.entity';
import { UserRole } from './user-role.entity';

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

  @ManyToMany(() => Permission)
  permissionEntities = new Collection<Permission>(this);

  @OneToMany(() => UserRole, (ur) => ur.role)
  userRoles = new Collection<UserRole>(this);
}
