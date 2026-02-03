import { Entity, Property, OneToOne, Index } from '@mikro-orm/core';
import { BaseEntity } from '@src/util/entities/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
@Index({ properties: ['user'] })
export class Credential extends BaseEntity {
  @OneToOne(() => User, { owner: true })
  user!: User;

  @Property()
  passwordHash!: string;

  @Property({ nullable: true })
  passwordUpdatedAt?: Date;

  @Property({ default: false })
  mustChangePassword: boolean = false;

  @Property({ default: 0 })
  failedAttempts: number = 0;

  @Property({ nullable: true })
  lockedUntil?: Date;

  // versioning
  @Property({ default: 0 })
  tokenVersion: number = 0;

  // refresh token
  @Property({ nullable: true })
  refreshToken?: string;

  @Property({ nullable: true })
  refreshTokenExpiresAt?: Date;
}
