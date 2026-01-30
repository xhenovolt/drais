#!/usr/bin/env node

/**
 * Test login flow
 */

const BASE_URL = 'http://localhost:3000';

async function testLogin() {
  console.log('🔐 Testing login flow...\n');

  try {
    // 1. Login
    console.log('1️⃣  Logging in...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'test@website.tld',
        password: 'test123456'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('   Status:', loginRes.status);
    const loginData = await loginRes.json();
    console.log('   Response:', JSON.stringify(loginData, null, 2));

    // Check Set-Cookie header
    const setCookieHeader = loginRes.headers.get('set-cookie');
    console.log('   Set-Cookie:', setCookieHeader ? 'YES' : 'NO');
    if (setCookieHeader) {
      console.log('   Cookie value:', setCookieHeader.substring(0, 80) + '...');
    }

    // 2. Try to access dashboard
    console.log('\n2️⃣  Accessing dashboard...');
    const dashRes = await fetch(`${BASE_URL}/dashboard`, {
      redirect: 'manual',
      signal: controller.signal
    });
    console.log('   Status:', dashRes.status);
    if (dashRes.status === 307 || dashRes.status === 302) {
      console.log('   Redirect to:', dashRes.headers.get('location'));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();
