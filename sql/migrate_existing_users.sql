-- =====================================================
-- Migration: Add Onboarding Steps for Existing Users
-- DRAIS v0.0.0043
-- Run this to retroactively add onboarding steps for users created before onboarding system
-- =====================================================

USE drais;

-- Check how many users don't have onboarding steps
SELECT COUNT(DISTINCT u.id) as users_without_onboarding
FROM users u
LEFT JOIN onboarding_steps os ON u.id = os.user_id
WHERE os.id IS NULL;

-- Create user_profiles for users who don't have one
INSERT INTO user_profiles (user_id, school_id, created_at)
SELECT u.id, u.school_id, NOW()
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE up.id IS NULL;

-- Add onboarding steps for existing users who don't have them
INSERT INTO onboarding_steps (user_id, step_name, step_order, status, created_at)
SELECT u.id, 'school_setup', 1, 'completed', NOW()
FROM users u
LEFT JOIN onboarding_steps os ON u.id = os.user_id AND os.step_name = 'school_setup'
WHERE os.id IS NULL;

INSERT INTO onboarding_steps (user_id, step_name, step_order, status, created_at, completed_at)
SELECT u.id, 'admin_profile', 2, 'completed', NOW(), NOW()
FROM users u
LEFT JOIN onboarding_steps os ON u.id = os.user_id AND os.step_name = 'admin_profile'
WHERE os.id IS NULL;

INSERT INTO onboarding_steps (user_id, step_name, step_order, status, created_at, completed_at)
SELECT u.id, 'payment_plan', 3, 'completed', NOW(), NOW()
FROM users u
LEFT JOIN onboarding_steps os ON u.id = os.user_id AND os.step_name = 'payment_plan'
WHERE os.id IS NULL;

INSERT INTO onboarding_steps (user_id, step_name, step_order, status, created_at, completed_at)
SELECT u.id, 'review_confirm', 4, 'completed', NOW(), NOW()
FROM users u
LEFT JOIN onboarding_steps os ON u.id = os.user_id AND os.step_name = 'review_confirm'
WHERE os.id IS NULL;

-- Grant existing users a 30-day trial (since they're already using the system)
INSERT INTO user_trials (user_id, start_date, end_date, status, trial_type, created_at)
SELECT 
    u.id,
    NOW(),
    DATE_ADD(NOW(), INTERVAL 30 DAY),
    'active',
    '30_day_trial',
    NOW()
FROM users u
LEFT JOIN user_trials ut ON u.id = ut.user_id
WHERE ut.id IS NULL;

-- Add trial payment plan for existing users
INSERT INTO user_payment_plans (user_id, plan_id, billing_cycle, status, start_date, trial_end_date, created_at)
SELECT 
    u.id,
    (SELECT id FROM payment_plans WHERE plan_code = 'trial' LIMIT 1),
    'monthly',
    'active',
    NOW(),
    DATE_ADD(NOW(), INTERVAL 30 DAY),
    NOW()
FROM users u
LEFT JOIN user_payment_plans upp ON u.id = upp.user_id
WHERE upp.id IS NULL;

-- Verify the migration
SELECT 
    'Total Users' as metric,
    COUNT(*) as count
FROM users
UNION ALL
SELECT 
    'Users with Profiles',
    COUNT(DISTINCT up.user_id)
FROM user_profiles up
UNION ALL
SELECT 
    'Users with Onboarding Steps',
    COUNT(DISTINCT os.user_id)
FROM onboarding_steps os
UNION ALL
SELECT 
    'Users with Complete Onboarding',
    COUNT(DISTINCT user_id)
FROM (
    SELECT user_id, COUNT(*) as completed_steps
    FROM onboarding_steps
    WHERE status = 'completed'
    GROUP BY user_id
    HAVING completed_steps = 4
) as complete_users
UNION ALL
SELECT 
    'Users with Active Trials',
    COUNT(DISTINCT user_id)
FROM user_trials
WHERE status = 'active'
UNION ALL
SELECT 
    'Users with Payment Plans',
    COUNT(DISTINCT user_id)
FROM user_payment_plans
WHERE status = 'active';

-- Show sample of migrated users
SELECT 
    u.id,
    u.email,
    u.username,
    COUNT(DISTINCT os.id) as onboarding_steps,
    SUM(CASE WHEN os.status = 'completed' THEN 1 ELSE 0 END) as completed_steps,
    MAX(CASE WHEN ut.id IS NOT NULL THEN 'Yes' ELSE 'No' END) as has_trial,
    MAX(CASE WHEN upp.id IS NOT NULL THEN 'Yes' ELSE 'No' END) as has_payment_plan
FROM users u
LEFT JOIN onboarding_steps os ON u.id = os.user_id
LEFT JOIN user_trials ut ON u.id = ut.user_id
LEFT JOIN user_payment_plans upp ON u.id = upp.user_id
GROUP BY u.id, u.email, u.username
LIMIT 10;
