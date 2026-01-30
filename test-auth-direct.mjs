#!/usr/bin/env node

/**
 * Direct test of Jeton auth system
 * Tests without server, directly using libraries
 */

import { verifyCredentials } from './src/lib/auth.js';
import { createSession, getSession, deleteSession } from './src/lib/session.js';

async function test() {
  try {
    console.log('Testing Jeton authentication system...\n');

    // Test 1: Find and verify user
    console.log('Test 1: Verify credentials');
    const user = await verifyCredentials('test@website.tld', 'test123456');
    if (!user) {
      console.error('❌ User not found or password incorrect');
      process.exit(1);
    }
    console.log('✅ User verified:', user.email, '(ID:', user.id + ')');

    // Test 2: Create session
    console.log('\nTest 2: Create session');
    const sessionId = await createSession(user.id);
    console.log('✅ Session created:', sessionId);

    // Test 3: Get and validate session
    console.log('\nTest 3: Get session');
    const session = await getSession(sessionId);
    if (!session) {
      console.error('❌ Session not found');
      process.exit(1);
    }
    console.log('✅ Session valid:', {
      sessionId: session.id,
      userId: session.userId,
      email: session.user.email,
      role: session.user.role,
    });

    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

test();
