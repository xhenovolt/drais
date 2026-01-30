-- =====================================================================
-- DRAIS PostgreSQL Seed Data v0.0.0050+
-- Populates essential reference data for DRAIS system
-- Safe to run multiple times
-- =====================================================================

-- =====================================================================
-- PAYMENT PLANS (40-day trial default)
-- =====================================================================

-- Update existing plans to set 40-day trial default
UPDATE payment_plans 
SET trial_period_days = 40
WHERE plan_code IN ('trial', 'starter', 'professional');

-- Verify plans exist
SELECT '✅ Payment Plans Configured' as status, COUNT(*) as plan_count FROM payment_plans;
SELECT plan_name, plan_code, trial_period_days, is_trial FROM payment_plans ORDER BY sort_order;
