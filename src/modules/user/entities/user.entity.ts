import { Entity, Property, Index } from '@mikro-orm/core';
import { BaseEntity } from '@src/util/entities/base.entity';
import { Collection, OneToMany } from '@mikro-orm/core';
import { UserRole } from '@src/modules/permission/entities/user-role.entity';

@Entity()
@Index({ properties: ['companyId', 'supabaseId'] })
@Index({ properties: ['companyId', 'email'] })
@Index({ properties: ['companyId', 'deletedAt'] })
export class User extends BaseEntity {
  @Property({ unique: true })
  @Index()
  supabaseId!: string;

  @Property()
  email!: string;

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
