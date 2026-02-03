import { Entity, Property, Index } from '@mikro-orm/core';
import { BaseEntity } from '@src/util/entities/base.entity';
import { Collection, OneToMany } from '@mikro-orm/core';
import { UserRole } from '../../permission/entities/user-role.entity';

@Entity()
@Index({ properties: ['companyId', 'email'] })
@Index({ properties: ['companyId', 'deletedAt'] })
export class User extends BaseEntity {
  @Property()
  email!: string;

  @Property()
  @Index()
  companyId!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  phone?: string;

  @Property({ nullable: true })
  avatarUrl?: string;

  @Property({ default: true })
  isActive: boolean = true;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles = new Collection<UserRole>(this);
}
