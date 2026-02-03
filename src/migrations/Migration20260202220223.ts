import { Migration } from '@mikro-orm/migrations';

export class Migration20260202220223 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table "credential" (
        "id" serial primary key,
        "company_id" int not null,
        "created_at" timestamptz not null,
        "updated_at" timestamptz not null,
        "created_by" int not null,
        "updated_by" int not null,
        "deleted_at" timestamptz null,
        "deleted_by" int null,
        "user_id" int not null,
        "password_hash" varchar(255) not null,
        "password_updated_at" timestamptz null,
        "must_change_password" boolean not null default false,
        "failed_attempts" int not null default 0,
        "locked_until" timestamptz null
      );
    `);

    this.addSql(
      `create index "credential_company_id_index" on "credential" ("company_id");`,
    );
    this.addSql(
      `create index "credential_deleted_at_index" on "credential" ("deleted_at");`,
    );
    this.addSql(
      `alter table "credential" add constraint "credential_user_id_unique" unique ("user_id");`,
    );
    this.addSql(
      `create index "credential_user_id_index" on "credential" ("user_id");`,
    );
    this.addSql(`
      alter table "credential"
      add constraint "credential_user_id_foreign"
      foreign key ("user_id") references "user" ("id") on update cascade;
    `);

    this.addSql(
      `alter table "user_role" drop constraint "user_role_user_id_foreign";`,
    );

    this.addSql(`
      alter table "user_role"
      alter column "user_id" type int
      using "user_id"::int;
    `);

    this.addSql(`
      alter table "user_role"
      add constraint "user_role_user_id_foreign"
      foreign key ("user_id") references "user" ("id") on update cascade;
    `);

    this.addSql(`drop index "user_supabase_id_index";`);
    this.addSql(
      `alter table "user" drop constraint "user_supabase_id_unique";`,
    );
    this.addSql(`drop index "user_company_id_supabase_id_index";`);
    this.addSql(`alter table "user" drop column "supabase_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "user" add column "supabase_id" varchar(255) not null;`,
    );
    this.addSql(
      `create index "user_supabase_id_index" on "user" ("supabase_id");`,
    );
    this.addSql(
      `alter table "user" add constraint "user_supabase_id_unique" unique ("supabase_id");`,
    );
    this.addSql(
      `create index "user_company_id_supabase_id_index" on "user" ("company_id", "supabase_id");`,
    );

    this.addSql(
      `alter table "user_role" drop constraint "user_role_user_id_foreign";`,
    );
    this.addSql(`
      alter table "user_role"
      alter column "user_id" type varchar(255);
    `);

    this.addSql(`
      alter table "user_role"
      add constraint "user_role_user_id_foreign"
      foreign key ("user_id") references "user" ("supabase_id");
    `);

    this.addSql(`drop table if exists "credential";`);
  }
}
