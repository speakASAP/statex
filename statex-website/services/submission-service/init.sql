-- StateX Submission Service Database Initialization
-- This file is used by Docker Compose to initialize the database

-- Create database if it doesn't exist (this is handled by POSTGRES_DB)
-- CREATE DATABASE IF NOT EXISTS statex_submissions;

-- Create user if it doesn't exist (this is handled by POSTGRES_USER)
-- CREATE USER IF NOT EXISTS statex_user WITH PASSWORD 'statex_password';

-- Grant privileges
-- GRANT ALL PRIVILEGES ON DATABASE statex_submissions TO statex_user;

-- The tables will be created by SQLAlchemy when the application starts
-- This file is mainly for any additional database setup if needed
