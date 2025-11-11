import { PrimaryKey, Property, Index } from '@mikro-orm/core';

/**
 * Base abstract entity with common audit fields
 * Provides soft delete and multi-tenancy support
 */
export abstract class BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  @Index()
  companyId!: number;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdBy!: number;

  @Property()
  updatedBy!: number;

  @Property({ nullable: true })
  @Index()
  deletedAt?: Date;

  @Property({ nullable: true })
  deletedBy?: number;
}
