import { Migration } from '@mikro-orm/migrations';

export class Migration20260203005204 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "credential" add column "token_version" int not null default 0, add column "refresh_token" varchar(255) null, add column "refresh_token_expires_at" timestamptz null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "credential" drop column "token_version", drop column "refresh_token", drop column "refresh_token_expires_at";`);
  }

}
