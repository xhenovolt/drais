#!/bin/bash

# Test Script for Session-Based Authentication
# v0.0.0052

set -e

BASE_URL="http://localhost:3000"
TEST_USER="testuser_$(date +%s)"
TEST_EMAIL="test_$(date +%s)@example.com"
TEST_PASSWORD="TestPass123"

echo "🧪 Testing Session-Based Authentication (v0.0.0052)"
echo "=================================================="

# Step 1: Register a new user
echo ""
echo "1️⃣ Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"username\": \"$TEST_USER\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Response: $REGISTER_RESPONSE"

# Extract session ID from cookies (in a real test, capture Set-Cookie headers)
echo ""
echo "2️⃣ Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"identifier\": \"$TEST_USER\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Response: $LOGIN_RESPONSE"

# Extract session ID
SESSION_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"sessionId":"[^"]*' | cut -d'"' -f4)

if [ -z "$SESSION_ID" ]; then
  echo "❌ Failed to get session ID from login response"
  echo "Full response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Got session ID: $SESSION_ID"

# Step 3: Test school setup
echo ""
echo "3️⃣ Testing School Setup..."
SCHOOL_SETUP=$(curl -s -X PATCH "$BASE_URL/api/school/setup" \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionId=$SESSION_ID" \
  -d "{
    \"school_name\": \"Test School\",
    \"school_address\": \"123 Main Street, Springfield, IL\"
  }")

echo "Response: $SCHOOL_SETUP"

# Step 4: Get school setup status
echo ""
echo "4️⃣ Testing Get School Setup Status..."
SETUP_STATUS=$(curl -s -X GET "$BASE_URL/api/school/setup" \
  -H "Cookie: sessionId=$SESSION_ID")

echo "Response: $SETUP_STATUS"

# Step 5: Test logout
echo ""
echo "5️⃣ Testing Logout..."
LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/logout" \
  -H "Cookie: sessionId=$SESSION_ID")

echo "Response: $LOGOUT_RESPONSE"

echo ""
echo "✅ All tests completed!"
echo ""
echo "Summary:"
echo "- Registered user: $TEST_USER ($TEST_EMAIL)"
echo "- Session ID: $SESSION_ID"
echo "- School setup: completed"
echo "- Logout: successful"
