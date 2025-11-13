import { Entity, Property, Index, PrimaryKey } from '@mikro-orm/core';

@Entity()
@Index({
  properties: ['userId', 'companyId', 'roleId'],
  name: 'unique_user_company_role',
})
@Index({ properties: ['userId', 'companyId', 'deletedAt'] })
@Index({ properties: ['companyId', 'roleId'] })
export class UserRole {
  @PrimaryKey()
  id!: number;

  @Property()
  userId!: string; // Supabase UUID

  @Property()
  companyId!: number;

  @Property()
  roleId!: number;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ nullable: true })
  @Index()
  deletedAt?: Date;
}
