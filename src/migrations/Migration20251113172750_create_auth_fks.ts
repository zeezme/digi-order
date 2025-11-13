import { Migration } from '@mikro-orm/migrations';

export class Migration20251113172750_create_auth_fks extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "user_role" alter column "user_id" type varchar(255) using ("user_id"::varchar(255));`,
    );

    this.addSql(
      `alter table "user_role" add constraint "user_role_user_id_foreign" foreign key ("user_id") references "user" ("supabase_id") on update cascade;`,
    );

    this.addSql(
      `alter table "user_role" add constraint "user_role_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "user_role" add constraint "user_role_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "user_role" drop constraint "user_role_user_id_foreign";`,
    );
    this.addSql(
      `alter table "user_role" drop constraint "user_role_company_id_foreign";`,
    );
    this.addSql(
      `alter table "user_role" drop constraint "user_role_role_id_foreign";`,
    );
    this.addSql(
      `alter table "user_role" alter column "user_id" type int using ("user_id"::int);`,
    );
  }
}
