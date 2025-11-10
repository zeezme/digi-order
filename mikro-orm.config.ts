import { defineConfig } from '@mikro-orm/core';

export default defineConfig({
  dbName: 'digi_order',
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  debug: true,
  entities: ['./dist/modules/**/*.entity.js'],
  entitiesTs: ['./src/modules/**/*.entity.ts'],
});
