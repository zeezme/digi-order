import { Migration } from '@mikro-orm/migrations';

export class Migration20251113115657_create_permission extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "permission" ("id" serial primary key, "key" varchar(255) not null, "description" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz null);`);
    this.addSql(`alter table "permission" add constraint "permission_key_unique" unique ("key");`);

    this.addSql(`create table "role_permission_entities" ("role_id" int not null, "permission_id" int not null, constraint "role_permission_entities_pkey" primary key ("role_id", "permission_id"));`);

    this.addSql(`alter table "role_permission_entities" add constraint "role_permission_entities_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "role_permission_entities" add constraint "role_permission_entities_permission_id_foreign" foreign key ("permission_id") references "permission" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "role_permission_entities" drop constraint "role_permission_entities_permission_id_foreign";`);

    this.addSql(`drop table if exists "permission" cascade;`);

    this.addSql(`drop table if exists "role_permission_entities" cascade;`);
  }

}
