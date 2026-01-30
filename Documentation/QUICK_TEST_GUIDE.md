# 🚀 DRAIS Onboarding - Quick Test Guide

## ⚡ Quick Start Testing (5 Minutes)

### 1. Open Registration Page
```
http://localhost:3000/auth/register
```

### 2. Register New User
```
Email: test_onboarding_001@example.com
Password: Test123!@#
```

### 3. Expected Flow
```
✓ Registration Success
  ↓
✓ Redirect to /onboarding/step1
  ↓
✓ Complete School Setup
  ↓
✓ Redirect to /onboarding/step2
  ↓
✓ Complete Admin Profile
  ↓
✓ Redirect to /payment/select (or step3)
  ↓
✓ Select Free Trial
  ↓
✓ Redirect to /onboarding/step3
  ↓
✓ Review & Complete
  ↓
✓ Redirect to /dashboard
```

---

## 🔍 Quick Verification

### Check User Status
```bash
./test-onboarding-helper.sh status test_onboarding_001@example.com
```

**Expected Output**:
- ✅ All 4 steps completed
- ✅ School name populated
- ✅ User profile has full_name
- ✅ Payment plan: Free Trial
- ✅ Trial end date: +14 days
- ✅ Dashboard Access: ALLOWED

---

## 🧪 Quick Tests

### Test 1: Complete Flow (2 minutes)
1. Register → Complete all steps → Dashboard ✓

### Test 2: Dashboard Protection (1 minute)
1. Register new user: `test_incomplete_001@example.com`
2. Navigate to `/dashboard` directly
3. **Expected**: Redirected to `/onboarding/step1`

### Test 3: Payment Required (1 minute)
1. Complete steps 1-2 (skip payment)
2. Navigate to `/dashboard`
3. **Expected**: Redirected to `/payment/select`

---

## 📊 Database Quick Checks

### All Steps Completed?
```sql
SELECT COUNT(*) FROM onboarding_steps 
WHERE user_id = (SELECT id FROM users WHERE email = 'test_onboarding_001@example.com')
AND status = 'completed';
-- Expected: 4
```

### Active Subscription?
```sql
SELECT * FROM user_payment_plans 
WHERE user_id = (SELECT id FROM users WHERE email = 'test_onboarding_001@example.com')
AND status = 'active';
-- Expected: 1 row with trial_end_date = NOW() + 14 days
```

### Dashboard Access?
```sql
-- Check canAccessDashboard logic
SELECT 
  (SELECT COUNT(*) = 4 FROM onboarding_steps WHERE user_id = u.id AND status = 'completed') AS onboarding_complete,
  (SELECT COUNT(*) > 0 FROM user_payment_plans WHERE user_id = u.id AND status = 'active') AS has_subscription
FROM users u
WHERE email = 'test_onboarding_001@example.com';
-- Expected: onboarding_complete=1, has_subscription=1
```

---

## 🐛 Common Issues & Fixes

### Issue: Registration doesn't redirect to onboarding
**Check**: `src/app/auth/register/page.js` line 52
```javascript
router.push('/onboarding/step1'); // Should NOT be '/dashboard'
```

### Issue: Dashboard accessible without onboarding
**Check**: `middleware.js` has onboarding routes
```javascript
const onboardingRoutes = ['/onboarding', '/payment/select'];
```

### Issue: Payment plan not saving
**Check**: Database has payment_plans
```bash
./test-onboarding-helper.sh plans
# Should show 4 plans
```

### Issue: Trigger not creating profile
**Check**: Trigger exists
```bash
./test-onboarding-helper.sh verify
# Should show: ✓ Trigger 'after_user_insert' exists
```

---

## 🎯 Success Checklist

After completing one full test:

- [ ] User registered successfully
- [ ] Redirected to `/onboarding/step1` (NOT dashboard)
- [ ] Step 1 saved school information
- [ ] Step 2 saved admin profile
- [ ] Payment plan selection worked
- [ ] Trial end date calculated (+14 days)
- [ ] Step 3 showed all steps completed
- [ ] Final completion redirected to dashboard
- [ ] Dashboard is accessible
- [ ] Database has all records

**If all checked**: ✅ **Onboarding System Working!**

---

## 🧹 Cleanup After Testing

```bash
# Delete all test users
./test-onboarding-helper.sh cleanup

# Verify cleanup
./test-onboarding-helper.sh list
# Should show: No test users
```

---

## 📱 API Testing (Optional)

### Test GET /api/payment/plans
```bash
curl http://localhost:3000/api/payment/plans | jq
```

### Test GET /api/onboarding/status (requires auth cookie)
```bash
curl http://localhost:3000/api/onboarding/status \
  -H "Cookie: access_token=YOUR_JWT_TOKEN" | jq
```

---

## 🔗 Quick Links

- **Registration**: http://localhost:3000/auth/register
- **Onboarding Step 1**: http://localhost:3000/onboarding/step1
- **Payment Plans**: http://localhost:3000/payment/select
- **Dashboard**: http://localhost:3000/dashboard

---

## 📞 Need Help?

1. **Full Test Plan**: See `ONBOARDING_TEST_PLAN.md`
2. **Implementation Details**: See `ONBOARDING_IMPLEMENTATION_SUMMARY.md`
3. **Helper Script**: Run `./test-onboarding-helper.sh help`

---

**Status**: ✅ Ready to Test  
**Time Required**: ~5 minutes per full test  
**Current Version**: v0.0.0042
