-- Add missing columns to ensure schema compatibility

-- Add end_date alias to user_trials (maps trial_end_date)
ALTER TABLE user_trials 
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP;

-- Add plan_id alias to user_payment_plans (maps payment_plan_id)
ALTER TABLE user_payment_plans 
ADD COLUMN IF NOT EXISTS plan_id INT;

-- Add price_monthly and price_yearly aliases to payment_plans
ALTER TABLE payment_plans
ADD COLUMN IF NOT EXISTS price_monthly NUMERIC(12, 2),
ADD COLUMN IF NOT EXISTS price_yearly NUMERIC(12, 2);

-- Create views to handle column mapping for backward compatibility
-- user_trials view normalizes column names
CREATE OR REPLACE VIEW v_user_trials AS
SELECT 
  id,
  user_id,
  payment_plan_id,
  payment_plan_id as plan_id,
  trial_start_date,
  trial_end_date,
  trial_end_date as end_date,
  trial_days_used,
  trial_days_remaining,
  status,
  created_at,
  updated_at
FROM user_trials;

-- user_payment_plans view normalizes column names
CREATE OR REPLACE VIEW v_user_payment_plans AS
SELECT 
  id,
  user_id,
  payment_plan_id,
  payment_plan_id as plan_id,
  billing_cycle,
  status,
  start_date,
  end_date,
  auto_renew,
  created_at,
  updated_at
FROM user_payment_plans;

-- payment_plans view normalizes prices
CREATE OR REPLACE VIEW v_payment_plans AS
SELECT 
  id,
  plan_name,
  plan_code,
  description,
  price_termly,
  price_annual,
  COALESCE(price_monthly, price_termly) as price_monthly,
  COALESCE(price_yearly, price_annual) as price_yearly,
  trial_period_days,
  is_trial,
  is_active,
  sort_order,
  created_at,
  updated_at
FROM payment_plans;

\echo '✅ Schema compatibility layer created with views!';
