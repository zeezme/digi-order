import {
  Entity,
  Property,
  Index,
  PrimaryKey,
  ManyToOne,
} from '@mikro-orm/core';
import { Role } from './role.entity';
import { User } from '../../user/entities/user.entity';
import { Company } from '../../company/entities/company.entity';

@Entity()
@Index({
  properties: ['user', 'company', 'role'],
  name: 'unique_user_company_role',
})
@Index({ properties: ['user', 'company', 'deletedAt'] })
@Index({ properties: ['company', 'role'] })
export class UserRole {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User, {
    fieldName: 'user_id',
    referenceColumnName: 'supabase_id',
  })
  user!: User;

  @ManyToOne(() => Company)
  company!: Company;

  @ManyToOne(() => Role)
  role!: Role;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ nullable: true })
  @Index()
  deletedAt?: Date;
}
