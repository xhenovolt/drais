#!/usr/bin/env node

/**
 * Simple login test with detailed logging
 */

const BASE_URL = 'http://localhost:3000';

async function testLogin() {
  console.log('🔐 Testing login...\n');

  try {
    console.log('📤 Sending login request...');
    const startTime = Date.now();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏱️  Request timeout after 10 seconds');
      controller.abort();
    }, 10000);

    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'test@website.tld',
        password: 'test123456',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    console.log(`✓ Response received in ${duration}ms`);
    console.log(`  Status: ${response.status}`);

    const data = await response.json();
    console.log(`  Data: ${JSON.stringify(data, null, 2)}`);

    // Check cookie
    const setCookie = response.headers.get('set-cookie');
    console.log(`  Set-Cookie: ${setCookie ? 'YES ✓' : 'NO ✗'}`);
    if (setCookie) {
      console.log(`    Cookie: ${setCookie.split(';')[0]}`);
    }

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

testLogin();
