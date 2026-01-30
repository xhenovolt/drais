# DRAIS v0.0.0042 - Onboarding System Test Plan

## Test Environment
- **Server**: http://localhost:3000
- **Database**: MySQL (drais)
- **Version**: v0.0.0042

## Database Verification ✅
- [x] user_profiles table exists
- [x] onboarding_steps table exists
- [x] payment_plans table exists (4 plans)
- [x] user_payment_plans table exists
- [x] schools table exists
- [x] after_user_insert trigger exists

## Payment Plans Verified ✅
| Plan | Code | Monthly Price | Trial Days |
|------|------|---------------|------------|
| Free Trial | trial | UGX 0 | 14 days |
| Starter | starter | UGX 150,000 | 0 days |
| Professional | professional | UGX 350,000 | 0 days |
| Enterprise | enterprise | UGX 750,000 | 0 days |

---

## Test Scenario 1: Complete Onboarding Flow (Happy Path)

### Step 1: User Registration
1. Navigate to http://localhost:3000/auth/register
2. Fill in registration form:
   - Email: `test_onboarding_001@example.com`
   - Password: `Test123!@#`
   - Confirm Password: `Test123!@#`
3. Click "Register"
4. **Expected**: 
   - ✅ Toast: "Registration successful!"
   - ✅ Redirect to `/onboarding/step1`
   - ✅ Database: user_profiles created
   - ✅ Database: 4 onboarding_steps created (all 'pending')

**Verification SQL**:
```sql
SELECT u.id, u.email, up.full_name, os.step_name, os.status
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN onboarding_steps os ON u.id = os.user_id
WHERE u.email = 'test_onboarding_001@example.com'
ORDER BY os.step_order;
```

---

### Step 2: School Setup (Onboarding Step 1)
1. Verify on `/onboarding/step1` page
2. Verify progress bar shows "Step 1 of 4 (25%)"
3. Fill in form:
   - School Name: `Test Academy` (required)
   - School Type: `Secondary School`
   - Address: `123 Main Street`
   - City: `Kampala`
   - Country: `Uganda`
   - Phone: `+256700123456`
   - Email: `info@testacademy.com`
4. Click "Continue"
5. **Expected**:
   - ✅ POST to `/api/onboarding/step` with `stepName='school_setup'`
   - ✅ Toast: "School information saved"
   - ✅ Redirect to `/onboarding/step2`
   - ✅ Database: schools record created
   - ✅ Database: onboarding_steps.school_setup → status='completed'

**Verification SQL**:
```sql
SELECT s.school_name, s.school_type, s.address, s.city, os.status
FROM schools s
JOIN users u ON s.owner_user_id = u.id
JOIN onboarding_steps os ON os.user_id = u.id AND os.step_name = 'school_setup'
WHERE u.email = 'test_onboarding_001@example.com';
```

---

### Step 3: Admin Profile (Onboarding Step 2)
1. Verify on `/onboarding/step2` page
2. Verify progress bar shows "Step 2 of 4 (50%)"
3. Fill in form:
   - Full Name: `John Doe Admin` (required)
   - Phone: `+256700987654`
   - Address: `456 Admin Street`
   - City: `Kampala`
   - Country: `Uganda`
   - Timezone: `Africa/Kampala`
   - Language: `English`
4. Click "Continue"
5. **Expected**:
   - ✅ POST to `/api/onboarding/step` with `stepName='admin_profile'`
   - ✅ Toast: "Admin profile updated"
   - ✅ Redirect to `/onboarding/step3` (or `/payment/select` if not yet selected)
   - ✅ Database: user_profiles.full_name updated
   - ✅ Database: onboarding_steps.admin_profile → status='completed'

**Verification SQL**:
```sql
SELECT up.full_name, up.phone, up.timezone, up.language, os.status
FROM user_profiles up
JOIN users u ON up.user_id = u.id
JOIN onboarding_steps os ON os.user_id = u.id AND os.step_name = 'admin_profile'
WHERE u.email = 'test_onboarding_001@example.com';
```

---

### Step 4: Payment Plan Selection
1. Verify on `/payment/select` page (if redirected here)
2. Verify 4 payment plan cards displayed
3. Verify "Free Trial" plan is auto-selected
4. Verify plan details:
   - Free Trial: UGX 0/month, 14-day trial, 50 students
   - Starter: UGX 150,000/month or UGX 1,620,000/year, 200 students
   - Professional: UGX 350,000/month or UGX 3,780,000/year, 500 students
   - Enterprise: UGX 750,000/month or UGX 8,100,000/year, Unlimited students
5. Select "Free Trial" plan (already selected)
6. Click "Continue"
7. **Expected**:
   - ✅ POST to `/api/payment/select` with `planCode='trial'`
   - ✅ Toast: "Payment plan selected successfully"
   - ✅ Redirect to `/onboarding/step3`
   - ✅ Database: user_payment_plans record created
   - ✅ Database: trial_end_date = current_date + 14 days
   - ✅ Database: status='active'
   - ✅ Database: onboarding_steps.payment_plan → status='completed'

**Verification SQL**:
```sql
SELECT u.email, pp.plan_name, upp.billing_cycle, upp.status, 
       upp.start_date, upp.trial_end_date,
       DATEDIFF(upp.trial_end_date, CURDATE()) AS days_remaining
FROM users u
JOIN user_payment_plans upp ON u.id = upp.user_id
JOIN payment_plans pp ON upp.plan_id = pp.id
WHERE u.email = 'test_onboarding_001@example.com';
```

---

### Step 5: Review & Confirmation (Onboarding Step 3)
1. Verify on `/onboarding/step3` page
2. Verify progress bar shows "Step 4 of 4 (100%)"
3. Verify all steps show checkmarks:
   - ✅ School Setup
   - ✅ Admin Profile
   - ✅ Payment Plan Selection
   - ✅ Review & Confirmation (pending)
4. Verify payment plan summary shows "Free Trial - Active (14 days remaining)"
5. Click "Complete Setup"
6. **Expected**:
   - ✅ POST to `/api/onboarding/step` with `stepName='review_confirm'`
   - ✅ Toast: "Onboarding completed successfully!"
   - ✅ Redirect to `/dashboard`
   - ✅ Database: onboarding_steps.review_confirm → status='completed'
   - ✅ Database: all 4 steps have status='completed'

**Verification SQL**:
```sql
SELECT os.step_name, os.status, os.completed_at
FROM onboarding_steps os
JOIN users u ON os.user_id = u.id
WHERE u.email = 'test_onboarding_001@example.com'
ORDER BY os.step_order;
```

---

### Step 6: Dashboard Access Verification
1. Verify successfully landed on `/dashboard`
2. Verify dashboard content loads
3. **Expected**:
   - ✅ Dashboard accessible
   - ✅ User profile info available
   - ✅ No redirect to onboarding

---

## Test Scenario 2: Dashboard Protection (Incomplete Onboarding)

### Setup
1. Register new user: `test_incomplete_001@example.com`
2. **DO NOT** complete onboarding steps

### Test Dashboard Access
1. Navigate directly to http://localhost:3000/dashboard
2. **Expected**:
   - ✅ Middleware blocks access
   - ✅ Redirect to `/onboarding/step1`
   - ✅ Toast/message: "Please complete onboarding first"

**Verification SQL**:
```sql
SELECT u.email, os.step_name, os.status
FROM users u
JOIN onboarding_steps os ON u.id = os.user_id
WHERE u.email = 'test_incomplete_001@example.com'
ORDER BY os.step_order;
```

---

## Test Scenario 3: Onboarding Without Payment Plan

### Setup
1. Register new user: `test_no_payment_001@example.com`
2. Complete Step 1 (school setup)
3. Complete Step 2 (admin profile)
4. **DO NOT** select payment plan
5. Navigate to `/onboarding/step3`

### Test Review Page
1. Verify on `/onboarding/step3`
2. Verify steps 1-2 show checkmarks
3. Verify "Payment Plan Selection" shows warning/incomplete
4. Verify "Complete Setup" button is **DISABLED**
5. **Expected**:
   - ✅ Cannot complete onboarding without payment plan
   - ✅ Warning message displayed
   - ✅ Button disabled

---

## Test Scenario 4: Direct Dashboard Access (No Payment Plan)

### Setup
1. Use user from Scenario 3 (`test_no_payment_001@example.com`)
2. Complete all onboarding steps BUT skip payment selection
3. Navigate directly to `/dashboard`

### Test Dashboard Access
1. **Expected**:
   - ✅ Middleware blocks access
   - ✅ Redirect to `/payment/select`
   - ✅ Message: "Please select a payment plan"

**Verification via API**:
```bash
# Test canAccessDashboard endpoint
curl -X GET http://localhost:3000/api/access/dashboard \
  -H "Cookie: access_token=<JWT_TOKEN>" \
  -H "Content-Type: application/json"

# Expected Response:
{
  "allowed": false,
  "reason": "no_active_subscription",
  "redirectTo": "/payment/select"
}
```

---

## Test Scenario 5: Paid Plan Selection

### Setup
1. Register new user: `test_paid_plan_001@example.com`
2. Complete Step 1 (school setup)
3. Complete Step 2 (admin profile)
4. Navigate to `/payment/select`

### Test Paid Plan Selection
1. Verify on `/payment/select`
2. Select "Starter" plan
3. Toggle billing cycle to "Yearly"
4. Verify price updates to UGX 1,620,000/year
5. Click "Continue"
6. **Expected**:
   - ✅ POST to `/api/payment/select` with `planId=2, billingCycle='yearly'`
   - ✅ Database: user_payment_plans.billing_cycle='yearly'
   - ✅ Database: end_date calculated (current_date + 1 year)
   - ✅ Database: trial_end_date = NULL (no trial for paid plans)

**Verification SQL**:
```sql
SELECT u.email, pp.plan_name, upp.billing_cycle, 
       upp.start_date, upp.end_date, upp.trial_end_date
FROM users u
JOIN user_payment_plans upp ON u.id = upp.user_id
JOIN payment_plans pp ON upp.plan_id = pp.id
WHERE u.email = 'test_paid_plan_001@example.com';
```

---

## Test Scenario 6: Resume Onboarding (Partial Completion)

### Setup
1. Register new user: `test_resume_001@example.com`
2. Complete Step 1 (school setup)
3. **LOG OUT** or close browser
4. Log back in

### Test Onboarding Resume
1. After login, **Expected**:
   - ✅ Middleware detects incomplete onboarding
   - ✅ Redirect to current step (`/onboarding/step2`)
   - ✅ Can complete remaining steps

---

## API Endpoint Tests

### Test 1: GET /api/onboarding/status
```bash
curl -X GET http://localhost:3000/api/onboarding/status \
  -H "Cookie: access_token=<JWT_TOKEN>"
```
**Expected Response**:
```json
{
  "success": true,
  "steps": [
    {"step_name": "school_setup", "status": "completed", "step_order": 1},
    {"step_name": "admin_profile", "status": "completed", "step_order": 2},
    {"step_name": "payment_plan", "status": "completed", "step_order": 3},
    {"step_name": "review_confirm", "status": "pending", "step_order": 4}
  ],
  "completed": false,
  "currentStep": "review_confirm",
  "totalSteps": 4,
  "completedSteps": 3
}
```

### Test 2: GET /api/payment/plans
```bash
curl -X GET http://localhost:3000/api/payment/plans
```
**Expected Response**:
```json
{
  "success": true,
  "plans": [
    {
      "id": 1,
      "plan_name": "Free Trial",
      "plan_code": "trial",
      "price_monthly": 0,
      "price_yearly": 0,
      "trial_period_days": 14,
      "features": [...],
      "max_students": 50
    },
    ...
  ]
}
```

### Test 3: GET /api/payment/status
```bash
curl -X GET http://localhost:3000/api/payment/status \
  -H "Cookie: access_token=<JWT_TOKEN>"
```
**Expected Response**:
```json
{
  "success": true,
  "hasActiveSubscription": true,
  "currentPlan": {
    "plan_name": "Free Trial",
    "billing_cycle": "monthly",
    "status": "active",
    "trial_end_date": "2025-12-20T00:00:00.000Z"
  }
}
```

### Test 4: GET /api/access/dashboard
```bash
curl -X GET http://localhost:3000/api/access/dashboard \
  -H "Cookie: access_token=<JWT_TOKEN>"
```
**Expected Response (Allowed)**:
```json
{
  "allowed": true,
  "reason": "access_granted"
}
```

**Expected Response (Blocked - Incomplete Onboarding)**:
```json
{
  "allowed": false,
  "reason": "onboarding_incomplete",
  "redirectTo": "/onboarding/step1"
}
```

---

## Database Cleanup (After Testing)

```sql
-- Delete test users and cascading data
DELETE FROM users WHERE email LIKE 'test_%@example.com';

-- Verify cleanup
SELECT COUNT(*) FROM users WHERE email LIKE 'test_%@example.com';
-- Expected: 0
```

---

## Success Criteria ✅

- [ ] User registration redirects to onboarding (not dashboard)
- [ ] All 4 onboarding steps complete successfully
- [ ] School record created in database
- [ ] User profile updated with admin info
- [ ] Payment plan selection creates subscription
- [ ] Trial end date calculated correctly (current + 14 days)
- [ ] Dashboard accessible after completing all steps
- [ ] Dashboard blocked without onboarding completion
- [ ] Dashboard blocked without active payment plan
- [ ] Middleware redirects to correct step/page
- [ ] API endpoints return correct data
- [ ] Database trigger creates profile + steps on user insert
- [ ] All SQL queries execute without errors

---

## Known Issues & Workarounds

None identified yet. Update this section during testing.

---

## Test Results

### Test Date: _____________
### Tester: _____________

| Scenario | Status | Notes |
|----------|--------|-------|
| 1. Complete Onboarding Flow | ⬜ Pass / ⬜ Fail | |
| 2. Dashboard Protection | ⬜ Pass / ⬜ Fail | |
| 3. No Payment Plan | ⬜ Pass / ⬜ Fail | |
| 4. Direct Dashboard Access | ⬜ Pass / ⬜ Fail | |
| 5. Paid Plan Selection | ⬜ Pass / ⬜ Fail | |
| 6. Resume Onboarding | ⬜ Pass / ⬜ Fail | |
| API Endpoint Tests | ⬜ Pass / ⬜ Fail | |

---

## Next Steps After Testing

1. Document any bugs found
2. Create GitHub issues for bugs
3. Update middleware logic if needed
4. Add additional error handling
5. Create onboarding/index.js redirect page
6. Add "Resume Onboarding" banner for incomplete users
7. Test MongoDB compatibility (switch DB_TYPE)
8. Performance testing with multiple users
9. Security audit of API endpoints
10. Prepare for production deployment

---

**Version**: v0.0.0042  
**Last Updated**: 2025-12-06  
**Status**: Ready for Testing
