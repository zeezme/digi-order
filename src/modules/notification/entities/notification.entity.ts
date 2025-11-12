import { Entity, Property, Index } from '@mikro-orm/core';
import { BaseEntity } from '@src/util/entities/base.entity';

export enum NotificationType {
  ORDER_CREATED = 'order_created',
  ORDER_READY = 'order_ready',
  KITCHEN_ITEM_READY = 'kitchen_item_ready',
  TABLE_REQUESTED = 'table_requested',
  SYSTEM = 'system',
}
@Entity()
@Index({ properties: ['companyId', 'type', 'read', 'deletedAt'] })
@Index({ properties: ['companyId', 'userId', 'read'] })
@Index({ properties: ['companyId', 'createdAt'] })
export class Notification extends BaseEntity {
  @Property({ type: 'text' })
  message!: string;

  @Property({ type: 'string' })
  type!: NotificationType;

  @Property({ default: false })
  read: boolean = false;

  @Property({ nullable: true })
  readAt?: Date;

  @Property()
  @Index()
  userId!: number;

  @Property({ nullable: true })
  entityType?: string;

  @Property({ nullable: true })
  entityId?: number;

  @Property({ nullable: true })
  sentAt?: Date;

  @Property({ default: false })
  delivered: boolean = false;
}
