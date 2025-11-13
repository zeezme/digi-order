import { Migration } from '@mikro-orm/migrations';

export class Migration20251113113821 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "company" ("id" serial primary key, "name" varchar(255) not null, "slug" varchar(255) not null, "is_active" boolean not null default true, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null);`,
    );
    this.addSql(`create index "company_name_index" on "company" ("name");`);
    this.addSql(
      `alter table "company" add constraint "company_slug_unique" unique ("slug");`,
    );
    this.addSql(
      `create index "company_deleted_at_index" on "company" ("deleted_at");`,
    );
    this.addSql(
      `create index "company_is_active_deleted_at_index" on "company" ("is_active", "deleted_at");`,
    );
    this.addSql(`create index "company_slug_index" on "company" ("slug");`);

    this.addSql(
      `create table "role" ("id" serial primary key, "name" varchar(255) not null, "description" text null, "permissions" jsonb null);`,
    );
    this.addSql(
      `alter table "role" add constraint "role_name_unique" unique ("name");`,
    );
    this.addSql(`create index "role_name_index" on "role" ("name");`);

    this.addSql(
      `create table "user_role" ("id" serial primary key, "user_id" varchar(255) not null, "company_id" int not null, "role_id" int not null, "created_at" timestamptz not null, "deleted_at" timestamptz null);`,
    );
    this.addSql(
      `create index "user_role_deleted_at_index" on "user_role" ("deleted_at");`,
    );
    this.addSql(
      `create index "user_role_company_id_role_id_index" on "user_role" ("company_id", "role_id");`,
    );
    this.addSql(
      `create index "user_role_user_id_company_id_deleted_at_index" on "user_role" ("user_id", "company_id", "deleted_at");`,
    );
    this.addSql(
      `create index "unique_user_company_role" on "user_role" ("user_id", "company_id", "role_id");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "company" cascade;`);

    this.addSql(`drop table if exists "role" cascade;`);

    this.addSql(`drop table if exists "user_role" cascade;`);
  }
}
