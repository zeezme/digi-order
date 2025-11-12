import { defineConfig } from '@mikro-orm/postgresql';
import { config } from 'dotenv';

config();

export default defineConfig({
  dbName: process.env.DB_NAME || 'digi_order',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  debug: process.env.DB_DEBUG === 'true',

  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],

  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
});
