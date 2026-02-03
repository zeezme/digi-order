import { Migration } from '@mikro-orm/migrations';

export class Migration20260203021232 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop index "credential_company_id_index";`);
    this.addSql(`alter table "credential" drop column "company_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "credential" add column "company_id" int not null;`);
    this.addSql(`create index "credential_company_id_index" on "credential" ("company_id");`);
  }

}
