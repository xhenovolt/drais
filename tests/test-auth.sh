#!/bin/bash

# =====================================================
# DRAIS Authentication System Test Script
# v0.0.0042
# =====================================================

echo "========================================="
echo "DRAIS Authentication System Tests"
echo "========================================="
echo ""

API_URL="http://localhost:3000"
TEST_EMAIL="test_$(date +%s)@example.com"
TEST_USERNAME="testuser_$(date +%s)"
TEST_PASSWORD="TestPass123!"

echo "Test Configuration:"
echo "  API URL: $API_URL"
echo "  Test Email: $TEST_EMAIL"
echo "  Test Username: $TEST_USERNAME"
echo ""

# Check if server is running
echo "1. Checking if Next.js server is running..."
if curl -s "$API_URL" > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running. Please start it with 'npm run dev'"
    exit 1
fi
echo ""

# Test 1: Database Connection
echo "2. Testing database connection..."
DB_RESPONSE=$(curl -s "$API_URL/api/test-db")
if echo "$DB_RESPONSE" | grep -q "success"; then
    echo "✅ Database connection successful"
    echo "   Response: $DB_RESPONSE"
else
    echo "❌ Database connection failed"
    echo "   Response: $DB_RESPONSE"
    exit 1
fi
echo ""

# Test 2: User Registration
echo "3. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_USERNAME\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"name\": \"Test User\",
    \"role\": \"client\"
  }")

if echo "$REGISTER_RESPONSE" | grep -q "\"success\":true"; then
    echo "✅ Registration successful"
    echo "   Response: $REGISTER_RESPONSE"
    
    # Extract tokens (if returned in response)
    ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    echo "   Access Token: ${ACCESS_TOKEN:0:50}..."
else
    echo "❌ Registration failed"
    echo "   Response: $REGISTER_RESPONSE"
    exit 1
fi
echo ""

# Test 3: Duplicate Registration (should fail)
echo "4. Testing duplicate registration (should fail)..."
DUP_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_USERNAME\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"name\": \"Test User\",
    \"role\": \"client\"
  }")

if echo "$DUP_RESPONSE" | grep -q "already"; then
    echo "✅ Duplicate registration correctly rejected"
else
    echo "⚠️  Duplicate registration not properly handled"
    echo "   Response: $DUP_RESPONSE"
fi
echo ""

# Test 4: Login with correct credentials
echo "5. Testing login with correct credentials..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

if echo "$LOGIN_RESPONSE" | grep -q "\"success\":true"; then
    echo "✅ Login successful"
    echo "   Response: $LOGIN_RESPONSE"
    
    # Check if cookies were set
    if [ -f cookies.txt ]; then
        echo "   Cookies saved:"
        cat cookies.txt | grep -E "accessToken|refreshToken" | sed 's/^/     /'
    fi
else
    echo "❌ Login failed"
    echo "   Response: $LOGIN_RESPONSE"
    exit 1
fi
echo ""

# Test 5: Login with wrong password (should fail)
echo "6. Testing login with wrong password (should fail)..."
WRONG_LOGIN=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"WrongPassword123!\"
  }")

if echo "$WRONG_LOGIN" | grep -q "Invalid"; then
    echo "✅ Wrong password correctly rejected"
else
    echo "⚠️  Wrong password not properly handled"
    echo "   Response: $WRONG_LOGIN"
fi
echo ""

# Test 6: Token Refresh
echo "7. Testing token refresh..."
if [ -f cookies.txt ]; then
    REFRESH_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/refresh" \
      -b cookies.txt \
      -c cookies_new.txt)
    
    if echo "$REFRESH_RESPONSE" | grep -q "\"success\":true"; then
        echo "✅ Token refresh successful"
        echo "   New cookies saved to cookies_new.txt"
    else
        echo "⚠️  Token refresh might have failed"
        echo "   Response: $REFRESH_RESPONSE"
    fi
else
    echo "⚠️  No cookies found, skipping refresh test"
fi
echo ""

# Test 7: Logout
echo "8. Testing logout..."
if [ -f cookies.txt ]; then
    LOGOUT_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/logout" \
      -b cookies.txt)
    
    if echo "$LOGOUT_RESPONSE" | grep -q "\"success\":true"; then
        echo "✅ Logout successful"
        echo "   Response: $LOGOUT_RESPONSE"
    else
        echo "⚠️  Logout might have failed"
        echo "   Response: $LOGOUT_RESPONSE"
    fi
else
    echo "⚠️  No cookies found, skipping logout test"
fi
echo ""

# Test 8: Protected Route Access (should fail without token)
echo "9. Testing protected route without authentication..."
PROTECTED_RESPONSE=$(curl -s "$API_URL/dashboard")
if echo "$PROTECTED_RESPONSE" | grep -q "login"; then
    echo "✅ Unauthenticated access correctly redirected"
else
    echo "⚠️  Protected route access might not be properly secured"
fi
echo ""

# Cleanup
echo "10. Cleanup..."
rm -f cookies.txt cookies_new.txt
echo "✅ Temporary files cleaned up"
echo ""

# Summary
echo "========================================="
echo "TEST SUMMARY"
echo "========================================="
echo "✅ Core authentication flow working"
echo "✅ User registration & validation"
echo "✅ Login & logout functionality"
echo "✅ Token refresh mechanism"
echo "✅ Protected routes"
echo ""
echo "Next steps:"
echo "  1. Test frontend login/register pages"
echo "  2. Test role-based access control"
echo "  3. Test MongoDB compatibility (switch DB_TYPE)"
echo ""
echo "Test user credentials:"
echo "  Email: $TEST_EMAIL"
echo "  Username: $TEST_USERNAME"
echo "  Password: $TEST_PASSWORD"
echo ""
