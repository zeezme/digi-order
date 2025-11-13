import { Migration } from '@mikro-orm/migrations';

export class Migration20251113170913_create_user extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "company_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "created_by" int not null, "updated_by" int not null, "deleted_at" timestamptz null, "deleted_by" int null, "supabase_id" varchar(255) not null, "email" varchar(255) not null, "name" varchar(255) not null, "phone" varchar(255) null, "avatar_url" varchar(255) null, "is_active" boolean not null default true);`);
    this.addSql(`create index "user_company_id_index" on "user" ("company_id");`);
    this.addSql(`create index "user_deleted_at_index" on "user" ("deleted_at");`);
    this.addSql(`create index "user_supabase_id_index" on "user" ("supabase_id");`);
    this.addSql(`alter table "user" add constraint "user_supabase_id_unique" unique ("supabase_id");`);
    this.addSql(`create index "user_company_id_deleted_at_index" on "user" ("company_id", "deleted_at");`);
    this.addSql(`create index "user_company_id_email_index" on "user" ("company_id", "email");`);
    this.addSql(`create index "user_company_id_supabase_id_index" on "user" ("company_id", "supabase_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }

}
