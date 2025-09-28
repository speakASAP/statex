-- Initialize Statex database
-- This script runs automatically when PostgreSQL container starts

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create user if not exists (for compatibility)
DO $$ 
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'statex') THEN
      CREATE USER statex WITH PASSWORD 'statexpass';
   END IF;
END
$$;

-- Grant privileges on the database specified by POSTGRES_DB environment variable
-- The database is created automatically by PostgreSQL container
GRANT ALL PRIVILEGES ON DATABASE current_database() TO statex;
GRANT ALL ON SCHEMA public TO statex;

-- Set timezone
SET timezone = 'UTC'; 