#!/bin/bash

# DRAIS User Status Checker
# Quickly check onboarding and trial status for any user

DB_USER="root"
DB_NAME="drais"

if [ -z "$1" ]; then
    echo "Usage: ./check-user-status.sh <email>"
    echo "Example: ./check-user-status.sh user@example.com"
    exit 1
fi

EMAIL=$1

echo "======================================"
echo "User Status: $EMAIL"
echo "======================================"

# Check if user exists
USER_EXISTS=$(mysql -u "$DB_USER" "$DB_NAME" -se "SELECT COUNT(*) FROM users WHERE email = '$EMAIL';")

if [ "$USER_EXISTS" -eq 0 ]; then
    echo "❌ User not found"
    exit 1
fi

# Get user details
mysql -u "$DB_USER" "$DB_NAME" -e "
SELECT 
    u.id,
    u.email,
    u.username,
    u.status as account_status,
    u.created_at
FROM users u
WHERE u.email = '$EMAIL';
"

echo ""
echo "Onboarding Status:"
mysql -u "$DB_USER" "$DB_NAME" -e "
SELECT 
    os.step_name,
    os.step_order,
    os.status,
    os.completed_at
FROM onboarding_steps os
JOIN users u ON os.user_id = u.id
WHERE u.email = '$EMAIL'
ORDER BY os.step_order;
"

echo ""
echo "Trial Status:"
mysql -u "$DB_USER" "$DB_NAME" -e "
SELECT 
    ut.start_date,
    ut.end_date,
    ut.status,
    DATEDIFF(ut.end_date, NOW()) as days_remaining
FROM user_trials ut
JOIN users u ON ut.user_id = u.id
WHERE u.email = '$EMAIL'
ORDER BY ut.created_at DESC
LIMIT 1;
"

echo ""
echo "Payment Plan:"
mysql -u "$DB_USER" "$DB_NAME" -e "
SELECT 
    pp.plan_name,
    upp.billing_cycle,
    upp.status,
    upp.start_date,
    upp.trial_end_date
FROM user_payment_plans upp
JOIN payment_plans pp ON upp.plan_id = pp.id
JOIN users u ON upp.user_id = u.id
WHERE u.email = '$EMAIL'
ORDER BY upp.created_at DESC
LIMIT 1;
"

echo ""
echo "Dashboard Access:"
USER_ID=$(mysql -u "$DB_USER" "$DB_NAME" -se "SELECT id FROM users WHERE email = '$EMAIL';")

ONBOARDING_COMPLETE=$(mysql -u "$DB_USER" "$DB_NAME" -se "
SELECT COUNT(*) = 4
FROM onboarding_steps
WHERE user_id = $USER_ID AND status = 'completed';
")

HAS_ACTIVE_TRIAL=$(mysql -u "$DB_USER" "$DB_NAME" -se "
SELECT COUNT(*) > 0
FROM user_trials
WHERE user_id = $USER_ID 
  AND status = 'active' 
  AND end_date >= NOW();
")

HAS_ACTIVE_PAYMENT=$(mysql -u "$DB_USER" "$DB_NAME" -se "
SELECT COUNT(*) > 0
FROM user_payment_plans
WHERE user_id = $USER_ID 
  AND status = 'active';
")

echo "Onboarding Complete: $([ "$ONBOARDING_COMPLETE" -eq 1 ] && echo '✅ Yes' || echo '❌ No')"
echo "Active Trial: $([ "$HAS_ACTIVE_TRIAL" -eq 1 ] && echo '✅ Yes' || echo '❌ No')"
echo "Active Payment Plan: $([ "$HAS_ACTIVE_PAYMENT" -eq 1 ] && echo '✅ Yes' || echo '❌ No')"

if [ "$ONBOARDING_COMPLETE" -eq 1 ] && ([ "$HAS_ACTIVE_TRIAL" -eq 1 ] || [ "$HAS_ACTIVE_PAYMENT" -eq 1 ]); then
    echo ""
    echo "🎉 Dashboard Access: GRANTED"
else
    echo ""
    echo "🚫 Dashboard Access: DENIED"
    if [ "$ONBOARDING_COMPLETE" -ne 1 ]; then
        echo "   → Redirect to: /onboarding/step1"
    else
        echo "   → Redirect to: /payment/select"
    fi
fi
