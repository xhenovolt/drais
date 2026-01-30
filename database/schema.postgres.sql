-- =====================================================================
-- DRAIS PostgreSQL Complete Schema
-- Version: 0.0.0050+
-- 
-- Authoritative schema for PostgreSQL deployments (Neon)
-- This file combines all migrations into single idempotent deployment
-- 
-- Usage: psql $DATABASE_URL -f schema.postgres.sql
-- Safe: All CREATE TABLE statements use IF NOT EXISTS
-- =====================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Import base schema from v0.0.0048 (payment plans, trials, user payment plans)
\i migration_v0.0.0048_missing_trial_payment_tables.sql

-- Import extended schema from v0.0.0049 (critical tables + supporting tables)
\i migration_v0.0.0049_schema_parity.sql

-- =====================================================================
-- VERIFICATION
-- =====================================================================

\echo '✅ Schema deployment complete'

SELECT 'Final Schema Status' as status,
       COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

\echo 'Critical tables present:'
SELECT table_name 
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name IN ('onboarding_steps', 'user_profiles', 'user_trials', 'user_payment_plans', 'payment_plans')
ORDER BY table_name;
