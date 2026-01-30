-- =====================================================================
-- DRAIS MySQL Seed Data
-- Version: 0.0.0050+
-- 
-- Populates essential reference data for MySQL deployments
-- Includes: payment plans, trial defaults
-- 
-- Usage: mysql -h host -u user -p database < seed.mysql.sql
-- Safe: Uses INSERT IGNORE to skip duplicates
-- =====================================================================

-- =====================================================================
-- PAYMENT PLANS (40-day trial default)
-- =====================================================================

-- Update existing plans to set 40-day trial default
UPDATE payment_plans 
SET trial_period_days = 40
WHERE plan_code = 'trial';

-- Verify plans exist
SELECT 'SEED DATA COMPLETE' as status;
SELECT COUNT(*) as plan_count FROM payment_plans;
SELECT plan_name, plan_code, trial_period_days FROM payment_plans ORDER BY sort_order;
