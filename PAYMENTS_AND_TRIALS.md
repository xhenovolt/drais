# PAYMENTS & TRIALS SYSTEM

**Version:** 0.0.0050+  
**Status:** 40-day trial system implemented, payment plans seeded, DB-controlled trial duration

## Trial System Overview

### Free Trial (40 Days)
All new users automatically receive a 40-day free trial on the "Free Trial" plan.

**Trial Details:**
- **Duration:** 40 days (configurable in payment_plans.trial_period_days)
- **Access:** Full features during trial period
- **Cost:** Free ($0.00)
- **Auto-Upgrade:** False (manual choice to upgrade)

**Database Control:**
- Trial duration stored in `payment_plans.trial_period_days = 40`
- Can be changed by admin at any time
- All users automatically get the configured duration
- Duration is NOT per-user (all users get 40 days)

### Trial Period Storage
```sql
CREATE TABLE user_trials (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    plan_id BIGINT,                        -- FREE_TRIAL plan ID
    trial_start_date DATE NOT NULL,        -- First login or signup date
    trial_end_date DATE NOT NULL,          -- trial_start_date + 40 days
    is_active BOOLEAN DEFAULT true,        -- true until expired
    auto_upgrade_plan_id BIGINT,           -- Optional: auto-upgrade plan
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Calculation:**
```sql
-- On user signup
INSERT INTO user_trials (user_id, plan_id, trial_start_date, trial_end_date, is_active)
SELECT 
  u.id,
  p.id,
  CURRENT_DATE,
  CURRENT_DATE + (SELECT INTERVAL '1 day' * p.trial_period_days FROM payment_plans p WHERE p.plan_code='trial'),
  true
FROM users u, payment_plans p
WHERE u.id = $1 AND p.plan_code = 'trial';
```

### Trial Expiration Check
```sql
-- Get active trials
SELECT user_id, trial_end_date 
FROM user_trials 
WHERE is_active = true AND trial_end_date > NOW();

-- Check if user's trial expired
SELECT 
  CASE 
    WHEN trial_end_date > NOW() THEN 'active'
    ELSE 'expired'
  END as trial_status
FROM user_trials
WHERE user_id = $1;
```

### Trial Expiration Actions
When trial expires (trial_end_date < NOW()):

1. **Option A: Auto-Expire**
   ```sql
   UPDATE user_trials 
   SET is_active = false 
   WHERE trial_end_date < NOW();
   ```

2. **Option B: Auto-Upgrade**
   ```sql
   -- If auto_upgrade_plan_id is set
   INSERT INTO user_payment_plans (user_id, plan_id, start_date, is_active)
   SELECT user_id, auto_upgrade_plan_id, CURRENT_DATE, true
   FROM user_trials
   WHERE trial_end_date < NOW() AND auto_upgrade_plan_id IS NOT NULL;
   ```

3. **Option C: Manual Admin Action**
   - Extend trial: `UPDATE user_trials SET trial_end_date = trial_end_date + INTERVAL '7 days'`
   - Upgrade user: Insert into user_payment_plans

## Payment Plans

### Available Plans
```sql
SELECT id, plan_name, plan_code, price_monthly, trial_period_days, is_active 
FROM payment_plans 
ORDER BY sort_order;
```

**Tier 1: Free Trial**
- Code: `trial`
- Duration: 40 days (configurable)
- Price: 0 UGX/month
- Max Students: 50
- Max Staff: 10
- Max Schools: 1
- Features: Basic student management, SMS notifications, email support
- **Best For:** Evaluation and small testing schools

**Tier 2: Starter** 
- Code: `starter`
- Price: 150,000 UGX/month
- Max Students: 200
- Max Staff: 20
- Max Schools: 1
- Features: All Tier 1 + Fee management, Basic reports, Priority email support
- **Best For:** Small to medium schools

**Tier 3: Professional**
- Code: `professional`
- Price: 350,000 UGX/month
- Max Students: 500
- Max Staff: 50
- Max Schools: 1 (can expand)
- Features: All Tier 2 + Exam management, Advanced reports, Attendance tracking, Library management, WhatsApp integration
- **Best For:** Growing institutions and multi-campus networks

**Tier 4: Enterprise**
- Code: `enterprise`
- Price: Custom (contact sales)
- Max Students: Unlimited
- Max Staff: Unlimited
- Max Schools: 1+ (custom)
- Features: All Professional + Unlimited everything, AI analytics, Custom branding, Dedicated support, Multi-school management
- **Best For:** Large school networks and districts

### Plan Feature Schema
```sql
-- Features stored as JSONB array
{
  "student_management": true,
  "fee_management": true,
  "exam_management": true,
  "attendance_tracking": true,
  "library_management": true,
  "sms_notifications": true,
  "whatsapp_integration": false,
  "ai_analytics": false,
  "custom_branding": false,
  "api_access": false,
  "unlimited_schools": false
}
```

## User Payment Lifecycle

### 1. New User Registration
```
User signs up (email/password)
    ↓
Create user record in users table
    ↓
Create user_trials record with 40-day trial
    ↓
Create user_profiles record (basic info)
    ↓
Redirect to onboarding
    ↓
Trial now active → Full access granted
```

**SQL:**
```sql
BEGIN;
INSERT INTO users (email, password_hash, status) VALUES ($1, $2, 'active');
INSERT INTO user_trials (user_id, plan_id, trial_start_date, trial_end_date) 
  SELECT id, (SELECT id FROM payment_plans WHERE plan_code='trial'), 
         CURRENT_DATE, CURRENT_DATE + INTERVAL '40 days'
  FROM users WHERE email = $1;
INSERT INTO user_profiles (user_id, full_name) VALUES ((SELECT id FROM users WHERE email=$1), $3);
COMMIT;
```

### 2. During Trial (Days 1-40)
- User has full access
- No payment required
- Can explore all features
- Trial countdown available in UI

**Status Check:**
```sql
SELECT 
  'trial' as subscription_type,
  trial_end_date,
  (trial_end_date - CURRENT_DATE) as days_remaining,
  CASE 
    WHEN trial_end_date > CURRENT_DATE THEN 'active'
    ELSE 'expired'
  END as status
FROM user_trials
WHERE user_id = $1 AND is_active = true;
```

### 3. At Trial Expiration (Day 40)
Options:
- **Upgrade to Paid Plan** → Insert into user_payment_plans
- **Extend Trial** → Update trial_end_date (admin only)
- **Delete Account** → Soft delete or archive

**Upgrade SQL:**
```sql
INSERT INTO user_payment_plans (user_id, plan_id, start_date, is_active, auto_renew)
VALUES ($1, (SELECT id FROM payment_plans WHERE plan_code='starter'), 
        CURRENT_DATE, true, true);

UPDATE user_trials 
SET is_active = false 
WHERE user_id = $1;
```

### 4. Active Paid Subscription
User has one active plan in user_payment_plans with is_active=true.

**Access Control:**
```sql
SELECT COUNT(*) as has_access
FROM user_payment_plans
WHERE user_id = $1 AND is_active = true 
  AND (end_date IS NULL OR end_date > CURRENT_DATE);
```

## Admin Operations

### Extend User Trial
```sql
UPDATE user_trials 
SET trial_end_date = trial_end_date + INTERVAL '7 days',
    updated_at = NOW()
WHERE user_id = $1;
```

### Upgrade Trial User to Paid Plan
```sql
-- Step 1: Deactivate trial
UPDATE user_trials SET is_active = false WHERE user_id = $1;

-- Step 2: Add paid plan
INSERT INTO user_payment_plans (user_id, plan_id, start_date, is_active)
VALUES ($1, (SELECT id FROM payment_plans WHERE plan_code='starter'), 
        CURRENT_DATE, true);
```

### Change Trial Duration (Global)
```sql
-- Set all future trials to 30 days
UPDATE payment_plans 
SET trial_period_days = 30 
WHERE plan_code = 'trial';

-- Existing user trials are NOT retroactively changed
-- Only new signups get the new duration
```

### Extend Trial for Existing User
```sql
-- Recalculate end date
UPDATE user_trials
SET trial_end_date = trial_start_date + INTERVAL '1 day' * 
                     (SELECT trial_period_days FROM payment_plans 
                      WHERE plan_code='trial')
WHERE user_id = $1;

-- Or just add X days
UPDATE user_trials
SET trial_end_date = trial_end_date + INTERVAL '7 days'
WHERE user_id = $1;
```

### Downgrade User from Paid Plan
```sql
-- Step 1: End current plan
UPDATE user_payment_plans 
SET is_active = false, end_date = CURRENT_DATE 
WHERE user_id = $1 AND is_active = true;

-- Step 2: Create new trial (if allowed)
INSERT INTO user_trials (user_id, plan_id, trial_start_date, trial_end_date, is_active)
VALUES ($1, (SELECT id FROM payment_plans WHERE plan_code='trial'),
        CURRENT_DATE, CURRENT_DATE + INTERVAL '40 days', true);
```

## Feature Access Control

### Check User Access Level
```javascript
// src/lib/services/payment.service.js
export async function getUserAccessLevel(userId) {
  // Check trial
  const trial = await db.findOne('user_trials', { 
    user_id: userId,
    is_active: true 
  });
  if (trial && new Date(trial.trial_end_date) > new Date()) {
    return { type: 'trial', expiresAt: trial.trial_end_date };
  }
  
  // Check paid plan
  const plan = await db.findOne('user_payment_plans', {
    user_id: userId,
    is_active: true
  }, { populate: 'plan_id' });
  if (plan) {
    return { type: 'paid', plan: plan.plan };
  }
  
  // No access
  return { type: 'expired', message: 'Trial expired, no active plan' };
}
```

### Enforce Feature Limits
```sql
-- Count students for a school/user
SELECT COUNT(*) as student_count
FROM students
WHERE school_id = (SELECT school_id FROM user_profiles WHERE user_id = $1);

-- Get user's plan limits
SELECT plan.max_students, plan.max_staff, plan.features
FROM user_payment_plans upp
JOIN payment_plans plan ON upp.plan_id = plan.id
WHERE upp.user_id = $1 AND upp.is_active = true;

-- Check if user exceeded limit
IF student_count > plan.max_students THEN
  RAISE ERROR 'Student limit exceeded for this plan';
END IF;
```

## Database Maintenance

### Monthly: Update Expired Trials
```sql
-- Run once per month via cron job
UPDATE user_trials 
SET is_active = false 
WHERE trial_end_date < CURRENT_DATE AND is_active = true;
```

### Quarterly: Audit Payment Data
```sql
-- Find users with overlapping paid plans (shouldn't happen)
SELECT u.id, COUNT(upp.id) as plan_count
FROM users u
JOIN user_payment_plans upp ON u.id = upp.user_id AND upp.is_active = true
GROUP BY u.id
HAVING COUNT(upp.id) > 1;

-- Find users with both trial and paid plan (shouldn't happen)
SELECT ut.user_id
FROM user_trials ut
JOIN user_payment_plans upp ON ut.user_id = upp.user_id 
WHERE ut.is_active = true AND upp.is_active = true;
```

### Backup Payment Data
```bash
# Before any major changes
pg_dump $DATABASE_URL -t payment_plans -t user_trials -t user_payment_plans > payment_backup.sql
```

## Troubleshooting

### User Lost Access After 40 Days
**Scenario:** User completed trial but didn't upgrade
**Solution:**
1. Check `user_trials.trial_end_date` - should be in past
2. Check `user_payment_plans` - should be empty or inactive
3. Either extend trial or upgrade to paid plan

### User Sees "Trial Expired" but Should Have Access
**Scenario:** User paid but trial still showing as active
**Solution:**
```sql
-- Deactivate trial
UPDATE user_trials SET is_active = false WHERE user_id = $1;

-- Verify paid plan
SELECT * FROM user_payment_plans WHERE user_id = $1 AND is_active = true;
```

### Trial Date Calculations Wrong
**Scenario:** Trial should be 40 days but shows wrong end date
**Solution:**
```sql
-- Check payment_plans table
SELECT trial_period_days FROM payment_plans WHERE plan_code = 'trial';

-- Recalculate user's trial end date
UPDATE user_trials
SET trial_end_date = trial_start_date + INTERVAL '1 day' * 40
WHERE user_id = $1;
```

---

**Related Documentation:**
- AUTH_AND_ONBOARDING.md - Post-login access checks
- DATABASE_SCHEMA.md - Table structures
- DEPLOYMENT_AND_OPERATIONS.md - Admin procedures
