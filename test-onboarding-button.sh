#!/bin/bash

# Test Script: Complete Onboarding Flow
# This simulates a user going through onboarding to completion

BASE_URL="http://localhost:3000"
USER_ID=999  # Use a test user
SESSION_COOKIE="sessionUserId=$USER_ID"

echo "======================================"
echo "TESTING COMPLETE ONBOARDING FLOW"
echo "======================================"
echo ""

# Step 1: Check initial status
echo "1️⃣  INITIAL STATUS (before completing onboarding):"
echo "GET /api/onboarding/status"
RESPONSE=$(curl -s "$BASE_URL/api/onboarding/status" \
  -H "Cookie: $SESSION_COOKIE" | jq '.data | {completed, missingSteps, completedSteps, totalSteps}')
echo "$RESPONSE"
echo ""

# Step 2: Simulate completing a payment plan (which should trigger markOnboardingComplete)
echo "2️⃣  SELECTING PAYMENT PLAN (simulating payment completion):"
echo "POST /api/payment/select"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/payment/select" \
  -H "Cookie: $SESSION_COOKIE" \
  -H "Content-Type: application/json" \
  -d '{"plan_id": 16, "school_id": 1}' | jq '.')
echo "$RESPONSE"
echo ""

# Step 3: Check status AFTER payment selection
echo "3️⃣  STATUS AFTER PAYMENT SELECTION (should mark onboarding completed):"
echo "GET /api/onboarding/status"
RESPONSE=$(curl -s "$BASE_URL/api/onboarding/status" \
  -H "Cookie: $SESSION_COOKIE" | jq '.data | {completed, missingSteps, completedSteps, totalSteps}')
echo "$RESPONSE"
echo ""

# Step 4: Check the database directly
echo "4️⃣  DATABASE CHECK (direct query):"
echo "Expected: onboarding_completed should be FALSE for user ID 1 (not started)"
echo "Expected: onboarding_completed should be TRUE for user ID $USER_ID (completed)"
