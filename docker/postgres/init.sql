-- docker/postgres/init.sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Basic setup
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Create tables will be handled by Prisma migrations
-- This file is just for initial setup

DO $$
BEGIN
  RAISE NOTICE 'PostgreSQL initialized successfully!';
END $$;