import { Migration } from '@mikro-orm/migrations';

export class Migration20251113172025_create_fks extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "table" add constraint "table_current_order_id_foreign" foreign key ("current_order_id") references "order" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "table" add constraint "table_current_order_id_unique" unique ("current_order_id");`);

    this.addSql(`alter table "order" add constraint "order_table_id_foreign" foreign key ("table_id") references "table" ("id") on update cascade;`);

    this.addSql(`alter table "kitchen_item" add constraint "kitchen_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;`);
    this.addSql(`alter table "kitchen_item" add constraint "kitchen_item_menu_item_id_foreign" foreign key ("menu_item_id") references "menu_item" ("id") on update cascade;`);

    this.addSql(`alter table "order_item" add constraint "order_item_menu_item_id_foreign" foreign key ("menu_item_id") references "menu_item" ("id") on update cascade;`);
    this.addSql(`alter table "order_item" add constraint "order_item_kitchen_item_id_foreign" foreign key ("kitchen_item_id") references "kitchen_item" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "order_item" add constraint "order_item_kitchen_item_id_unique" unique ("kitchen_item_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "kitchen_item" drop constraint "kitchen_item_order_id_foreign";`);
    this.addSql(`alter table "kitchen_item" drop constraint "kitchen_item_menu_item_id_foreign";`);

    this.addSql(`alter table "order" drop constraint "order_table_id_foreign";`);

    this.addSql(`alter table "order_item" drop constraint "order_item_menu_item_id_foreign";`);
    this.addSql(`alter table "order_item" drop constraint "order_item_kitchen_item_id_foreign";`);

    this.addSql(`alter table "table" drop constraint "table_current_order_id_foreign";`);

    this.addSql(`alter table "order_item" drop constraint "order_item_kitchen_item_id_unique";`);

    this.addSql(`alter table "table" drop constraint "table_current_order_id_unique";`);
  }

}
