#!/usr/bin/env node

/**
 * Test dashboard access with session cookie
 */

const BASE_URL = 'http://localhost:3001';
const SESSION_TOKEN = '05ded563-e2c2-4619-a39e-980fc8243b25';

async function testDashboard() {
  console.log('🎯 Testing dashboard access with session cookie...\n');

  try {
    console.log(`📤 Requesting dashboard with sessionId=${SESSION_TOKEN}...`);

    const response = await fetch(`${BASE_URL}/dashboard`, {
      headers: {
        'Cookie': `sessionId=${SESSION_TOKEN}`,
      },
      redirect: 'manual',
    });

    console.log(`\n✓ Response received`);
    console.log(`  Status: ${response.status}`);

    if (response.status === 302 || response.status === 307) {
      const location = response.headers.get('location');
      console.log(`  Redirect: ${location}`);
      console.log(`\n❌ Still redirecting to login - session not validated!`);
    } else if (response.status === 200) {
      console.log(`\n✅ Dashboard accessible! Session is working!`);
      const html = await response.text();
      console.log(`  Content length: ${html.length} bytes`);
    } else {
      console.log(`  Unexpected status code`);
    }

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

testDashboard();
