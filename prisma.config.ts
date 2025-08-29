// prisma.config.ts
import { defineConfig } from 'prisma/config';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Завантажуємо змінні середовища в правильному порядку
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasourceUrl: process.env.DATABASE_URL
});
