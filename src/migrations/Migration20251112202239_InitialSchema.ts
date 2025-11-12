import { Migration } from '@mikro-orm/migrations';

export class Migration20251112202239_InitialSchema extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "audit_log" ("id" serial primary key, "company_id" int not null, "user_id" int not null, "entity_type" varchar(255) not null, "entity_id" int not null, "action" varchar(255) not null, "old_values" jsonb null, "new_values" jsonb null, "ip_address" varchar(255) null, "user_agent" varchar(255) null, "created_at" timestamptz not null);`,
    );
    this.addSql(
      `create index "audit_log_company_id_index" on "audit_log" ("company_id");`,
    );
    this.addSql(
      `create index "audit_log_company_id_created_at_index" on "audit_log" ("company_id", "created_at");`,
    );
    this.addSql(
      `create index "audit_log_company_id_user_id_created_at_index" on "audit_log" ("company_id", "user_id", "created_at");`,
    );
    this.addSql(
      `create index "audit_log_company_id_entity_type_entity_id_index" on "audit_log" ("company_id", "entity_type", "entity_id");`,
    );

    this.addSql(
      `create table "kitchen_item" ("id" serial primary key, "company_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "created_by" int not null, "updated_by" int not null, "deleted_at" timestamptz null, "deleted_by" int null, "order_id" int not null, "menu_item_id" int not null, "status" varchar(255) not null default 'pending', "started_at" timestamptz null, "completed_at" timestamptz null, "estimated_completion_time" timestamptz null, "notes" varchar(255) null, "prepared_by" int null);`,
    );
    this.addSql(
      `create index "kitchen_item_company_id_index" on "kitchen_item" ("company_id");`,
    );
    this.addSql(
      `create index "kitchen_item_deleted_at_index" on "kitchen_item" ("deleted_at");`,
    );
    this.addSql(
      `create index "kitchen_item_status_index" on "kitchen_item" ("status");`,
    );
    this.addSql(
      `create index "kitchen_item_company_id_deleted_at_index" on "kitchen_item" ("company_id", "deleted_at");`,
    );
    this.addSql(
      `create index "kitchen_item_company_id_order_id_index" on "kitchen_item" ("company_id", "order_id");`,
    );
    this.addSql(
      `create index "kitchen_item_company_id_status_index" on "kitchen_item" ("company_id", "status");`,
    );

    this.addSql(
      `create table "menu_item" ("id" serial primary key, "company_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "created_by" int not null, "updated_by" int not null, "deleted_at" timestamptz null, "deleted_by" int null, "name" varchar(255) not null, "description" text null, "price" numeric(10,2) not null, "is_available" boolean not null default true, "category" varchar(255) null, "tags" jsonb null, "image_url" varchar(255) null, "preparation_time_minutes" int not null default 0, "track_inventory" boolean not null default true, "current_stock" int null, "low_stock_threshold" int null);`,
    );
    this.addSql(
      `create index "menu_item_company_id_index" on "menu_item" ("company_id");`,
    );
    this.addSql(
      `create index "menu_item_deleted_at_index" on "menu_item" ("deleted_at");`,
    );
    this.addSql(
      `create index "menu_item_company_id_category_index" on "menu_item" ("company_id", "category");`,
    );
    this.addSql(
      `create index "menu_item_company_id_is_available_deleted_at_index" on "menu_item" ("company_id", "is_available", "deleted_at");`,
    );
    this.addSql(
      `create index "menu_item_company_id_name_index" on "menu_item" ("company_id", "name");`,
    );

    this.addSql(
      `create table "notification" ("id" serial primary key, "company_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "created_by" int not null, "updated_by" int not null, "deleted_at" timestamptz null, "deleted_by" int null, "message" text not null, "type" varchar(255) not null, "read" boolean not null default false, "read_at" timestamptz null, "user_id" int not null, "entity_type" varchar(255) null, "entity_id" int null, "sent_at" timestamptz null, "delivered" boolean not null default false);`,
    );
    this.addSql(
      `create index "notification_company_id_index" on "notification" ("company_id");`,
    );
    this.addSql(
      `create index "notification_deleted_at_index" on "notification" ("deleted_at");`,
    );
    this.addSql(
      `create index "notification_user_id_index" on "notification" ("user_id");`,
    );
    this.addSql(
      `create index "notification_company_id_created_at_index" on "notification" ("company_id", "created_at");`,
    );
    this.addSql(
      `create index "notification_company_id_user_id_read_index" on "notification" ("company_id", "user_id", "read");`,
    );
    this.addSql(
      `create index "notification_company_id_type_read_deleted_at_index" on "notification" ("company_id", "type", "read", "deleted_at");`,
    );

    this.addSql(
      `create table "order" ("id" serial primary key, "company_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "created_by" int not null, "updated_by" int not null, "deleted_at" timestamptz null, "deleted_by" int null, "table_id" int not null, "status" varchar(255) not null default 'pending', "subtotal" numeric(10,2) not null default 0, "tax" numeric(10,2) not null default 0, "discount" numeric(10,2) not null default 0, "total" numeric(10,2) not null default 0, "confirmed_at" timestamptz null, "completed_at" timestamptz null, "paid_at" timestamptz null, "notes" text null, "server_id" int null);`,
    );
    this.addSql(
      `create index "order_company_id_index" on "order" ("company_id");`,
    );
    this.addSql(
      `create index "order_deleted_at_index" on "order" ("deleted_at");`,
    );
    this.addSql(`create index "order_status_index" on "order" ("status");`);
    this.addSql(
      `create index "order_company_id_created_at_index" on "order" ("company_id", "created_at");`,
    );
    this.addSql(
      `create index "order_company_id_status_deleted_at_index" on "order" ("company_id", "status", "deleted_at");`,
    );
    this.addSql(
      `create index "order_company_id_table_id_deleted_at_index" on "order" ("company_id", "table_id", "deleted_at");`,
    );

    this.addSql(
      `create table "order_item" ("id" serial primary key, "company_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "created_by" int not null, "updated_by" int not null, "deleted_at" timestamptz null, "deleted_by" int null, "order_id" int not null, "menu_item_id" int not null, "quantity" int not null, "unit_price" numeric(10,2) not null, "total_price" numeric(10,2) not null, "notes" text null, "kitchen_item_id" int null);`,
    );
    this.addSql(
      `create index "order_item_company_id_index" on "order_item" ("company_id");`,
    );
    this.addSql(
      `create index "order_item_deleted_at_index" on "order_item" ("deleted_at");`,
    );
    this.addSql(
      `create index "order_item_company_id_order_id_index" on "order_item" ("company_id", "order_id");`,
    );

    this.addSql(
      `create table "table" ("id" serial primary key, "company_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "created_by" int not null, "updated_by" int not null, "deleted_at" timestamptz null, "deleted_by" int null, "number" varchar(255) not null, "is_occupied" boolean not null default false, "current_order_id" int null, "capacity" int not null default 4, "section" varchar(255) null, "is_active" boolean not null default true, "occupied_at" timestamptz null, "occupied_by" int null);`,
    );
    this.addSql(
      `create index "table_company_id_index" on "table" ("company_id");`,
    );
    this.addSql(
      `create index "table_deleted_at_index" on "table" ("deleted_at");`,
    );
    this.addSql(
      `create index "table_company_id_number_index" on "table" ("company_id", "number");`,
    );
    this.addSql(
      `create index "table_company_id_is_occupied_deleted_at_index" on "table" ("company_id", "is_occupied", "deleted_at");`,
    );

    this.addSql(
      `alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;`,
    );
  }
}
