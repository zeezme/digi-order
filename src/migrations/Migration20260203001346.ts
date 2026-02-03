import { Migration } from '@mikro-orm/migrations';

export class Migration20260203001346 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user_role" drop constraint "user_role_user_id_foreign";`);

    this.addSql(`alter table "user_role" add constraint "user_role_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_role" drop constraint "user_role_user_id_foreign";`);

    this.addSql(`alter table "user_role" add constraint "user_role_user_id_foreign" foreign key ("user_id") references "user" ("supabase_id") on update cascade;`);
  }

}
