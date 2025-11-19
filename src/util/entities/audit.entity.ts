import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
@Index({ properties: ['companyId', 'entityType', 'entityId'] })
@Index({ properties: ['companyId', 'userId', 'createdAt'] })
@Index({ properties: ['companyId', 'createdAt'] })
export class AuditLog {
  @PrimaryKey()
  id!: number;

  @Property()
  @Index()
  companyId!: number;

  @Property()
  userId!: number;

  @Property()
  entityType!: string;

  @Property()
  entityId!: number;

  @Property()
  action!: string;

  @Property({ type: 'json', nullable: true })
  oldValues?: Record<string, any>;

  @Property({ type: 'json', nullable: true })
  newValues?: Record<string, any>;

  @Property({ nullable: true })
  ipAddress?: string;

  @Property({ nullable: true })
  userAgent?: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
