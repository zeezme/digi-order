import { Migration } from '@mikro-orm/migrations';

export class Migration20260203020257 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "menu_item" drop column "created_by";`);

    this.addSql(`alter table "notification" drop column "created_by";`);

    this.addSql(`alter table "table" drop column "created_by";`);

    this.addSql(`alter table "order" drop column "created_by";`);

    this.addSql(`alter table "kitchen_item" drop column "created_by";`);

    this.addSql(`alter table "order_item" drop column "created_by";`);

    this.addSql(`alter table "user" drop column "created_by";`);

    this.addSql(`alter table "credential" drop column "created_by";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "menu_item" add column "created_by" int not null;`);

    this.addSql(`alter table "notification" add column "created_by" int not null;`);

    this.addSql(`alter table "table" add column "created_by" int not null;`);

    this.addSql(`alter table "order" add column "created_by" int not null;`);

    this.addSql(`alter table "kitchen_item" add column "created_by" int not null;`);

    this.addSql(`alter table "order_item" add column "created_by" int not null;`);

    this.addSql(`alter table "user" add column "created_by" int not null;`);

    this.addSql(`alter table "credential" add column "created_by" int not null;`);
  }

}
