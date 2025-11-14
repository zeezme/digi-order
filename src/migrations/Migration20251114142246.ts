import { Migration } from '@mikro-orm/migrations';

export class Migration20251114001 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "role" drop column if exists "permissions";');
  }

  async down(): Promise<void> {
    this.addSql(`
      alter table "role"
      add column "permissions" jsonb null;
    `);
  }
}
