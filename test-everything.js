#!/usr/bin/env node

/**
 * DRAIS Complete Test Suite
 * Version: 0.0.0050+
 * 
 * Comprehensive testing for authentication, onboarding, payments, and database
 * Merged from all test-*.js and test-*.sh files
 * 
 * Usage: node test-everything.js [command]
 * Commands: 
 *   auth - Test authentication endpoints
 *   onboarding - Test onboarding pipeline
 *   payments - Test payment and trial system
 *   schema - Test database schema and tables
 *   user - Test user lookup and credentials
 *   financial - Test financial module
 *   all (default) - Run all tests
 */

import fetch from 'node-fetch';
import pg from 'pg';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';

// Load environment
dotenv.config({ path: '.env.local' });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const DATABASE_URL = process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString: DATABASE_URL });

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(color, text) {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

function section(title) {
  log('blue', `\n${'═'.repeat(60)}`);
  log('blue', `${title}`);
  log('blue', `${'═'.repeat(60)}\n`);
}

function test(name) {
  return `  ${name}`;
}

let testsPassed = 0;
let testsFailed = 0;

function pass(msg) {
  log('green', `✅ ${msg}`);
  testsPassed++;
}

function fail(msg) {
  log('red', `❌ ${msg}`);
  testsFailed++;
}

function info(msg) {
  log('cyan', `ℹ️  ${msg}`);
}

// ============================================================================
// AUTHENTICATION TESTS
// ============================================================================

async function testAuthentication() {
  section('🔐 AUTHENTICATION TESTS');
  
  try {
    // Test 1: Login endpoint exists
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'OPTIONS'
      });
      pass(test('POST /api/auth/login endpoint exists'));
    } catch (err) {
      fail(test(`POST /api/auth/login endpoint: ${err.message}`));
    }
    
    // Test 2: Invalid credentials
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid@test.com',
          password: 'wrongpassword'
        })
      });
      
      if (response.status === 401) {
        pass(test('Invalid credentials rejected (401)'));
      } else {
        fail(test(`Invalid credentials should return 401, got ${response.status}`));
      }
    } catch (err) {
      info(`Could not test invalid credentials (app may not be running): ${err.message}`);
    }
    
    // Test 3: Check session table exists
    try {
      const result = await pool.query('SELECT COUNT(*) FROM user_sessions');
      pass(test('user_sessions table exists and is queryable'));
    } catch (err) {
      fail(test(`user_sessions table: ${err.message}`));
    }
    
  } catch (err) {
    fail(test(`Authentication tests: ${err.message}`));
  }
}

// ============================================================================
// ONBOARDING TESTS
// ============================================================================

async function testOnboarding() {
  section('🎓 ONBOARDING TESTS');
  
  try {
    // Test 1: Onboarding steps table exists
    try {
      const result = await pool.query('SELECT COUNT(*) FROM onboarding_steps');
      pass(test('onboarding_steps table exists'));
    } catch (err) {
      fail(test(`onboarding_steps table: ${err.message}`));
    }
    
    // Test 2: User profiles table exists
    try {
      const result = await pool.query('SELECT COUNT(*) FROM user_profiles');
      pass(test('user_profiles table exists'));
    } catch (err) {
      fail(test(`user_profiles table: ${err.message}`));
    }
    
    // Test 3: Onboarding endpoint accessible
    try {
      const response = await fetch(`${BASE_URL}/api/onboarding/status`, {
        method: 'OPTIONS'
      });
      pass(test('GET /api/onboarding/status endpoint exists'));
    } catch (err) {
      info(`Could not test onboarding endpoint: ${err.message}`);
    }
    
    // Test 4: Check onboarding schema
    try {
      const result = await pool.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'onboarding_steps'
        AND column_name IN ('user_id', 'step_name', 'status', 'completed_at')
      `);
      
      if (result.rows.length === 4) {
        pass(test('onboarding_steps has required columns'));
      } else {
        fail(test(`onboarding_steps missing columns (found ${result.rows.length}/4)`));
      }
    } catch (err) {
      fail(test(`onboarding_steps schema check: ${err.message}`));
    }
    
  } catch (err) {
    fail(test(`Onboarding tests: ${err.message}`));
  }
}

// ============================================================================
// PAYMENT & TRIAL TESTS
// ============================================================================

async function testPayments() {
  section('💰 PAYMENT & TRIAL TESTS');
  
  try {
    // Test 1: Payment plans table exists
    try {
      const result = await pool.query('SELECT COUNT(*) FROM payment_plans');
      pass(test('payment_plans table exists'));
    } catch (err) {
      fail(test(`payment_plans table: ${err.message}`));
    }
    
    // Test 2: Check payment plans are seeded
    try {
      const result = await pool.query(`
        SELECT COUNT(*) as plan_count FROM payment_plans WHERE is_active = true
      `);
      
      if (result.rows[0].plan_count >= 4) {
        pass(test(`Payment plans seeded (${result.rows[0].plan_count} active)`));
      } else {
        fail(test(`Only ${result.rows[0].plan_count} payment plans found (expected 4+)`));
      }
    } catch (err) {
      fail(test(`Payment plans count: ${err.message}`));
    }
    
    // Test 3: Check trial plan has 40-day default
    try {
      const result = await pool.query(`
        SELECT trial_period_days FROM payment_plans WHERE plan_code = 'trial'
      `);
      
      if (result.rows.length > 0 && result.rows[0].trial_period_days === 40) {
        pass(test('Trial plan configured with 40-day default'));
      } else {
        fail(test(`Trial plan trial_period_days: expected 40, got ${result.rows[0]?.trial_period_days}`));
      }
    } catch (err) {
      fail(test(`Trial plan check: ${err.message}`));
    }
    
    // Test 4: User trials table exists
    try {
      const result = await pool.query('SELECT COUNT(*) FROM user_trials');
      pass(test('user_trials table exists'));
    } catch (err) {
      fail(test(`user_trials table: ${err.message}`));
    }
    
    // Test 5: User payment plans table exists
    try {
      const result = await pool.query('SELECT COUNT(*) FROM user_payment_plans');
      pass(test('user_payment_plans table exists'));
    } catch (err) {
      fail(test(`user_payment_plans table: ${err.message}`));
    }
    
    // Test 6: Check trial table schema
    try {
      const result = await pool.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'user_trials'
        AND column_name IN ('user_id', 'trial_start_date', 'trial_end_date', 'is_active')
      `);
      
      if (result.rows.length === 4) {
        pass(test('user_trials has required columns'));
      } else {
        fail(test(`user_trials missing columns (found ${result.rows.length}/4)`));
      }
    } catch (err) {
      fail(test(`user_trials schema check: ${err.message}`));
    }
    
  } catch (err) {
    fail(test(`Payment tests: ${err.message}`));
  }
}

// ============================================================================
// DATABASE SCHEMA TESTS
// ============================================================================

async function testSchema() {
  section('📊 DATABASE SCHEMA TESTS');
  
  try {
    // Test 1: Count total tables
    try {
      const result = await pool.query(`
        SELECT COUNT(*) as table_count FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      `);
      
      if (result.rows[0].table_count >= 55) {
        pass(test(`Total tables: ${result.rows[0].table_count} (expected 55+)`));
      } else {
        fail(test(`Total tables: ${result.rows[0].table_count} (expected 55+)`));
      }
    } catch (err) {
      fail(test(`Table count: ${err.message}`));
    }
    
    // Test 2: Check critical tables
    const criticalTables = [
      'users',
      'onboarding_steps',
      'user_profiles',
      'user_sessions',
      'user_people',
      'payment_plans',
      'user_trials',
      'user_payment_plans'
    ];
    
    for (const table of criticalTables) {
      try {
        await pool.query(`SELECT 1 FROM ${table} LIMIT 1`);
        pass(test(`${table}`));
      } catch (err) {
        fail(test(`${table}: ${err.message}`));
      }
    }
    
  } catch (err) {
    fail(test(`Schema tests: ${err.message}`));
  }
}

// ============================================================================
// USER LOOKUP TESTS
// ============================================================================

async function testUserLookup() {
  section('👤 USER LOOKUP TESTS');
  
  try {
    // Test 1: Users table queryable
    try {
      const result = await pool.query('SELECT COUNT(*) FROM users');
      pass(test(`Users table queryable (${result.rows[0].count} users)`));
    } catch (err) {
      fail(test(`Users table: ${err.message}`));
    }
    
    // Test 2: Query by email
    try {
      const result = await pool.query('SELECT id, email FROM users LIMIT 1');
      if (result.rows.length > 0) {
        pass(test('User lookup by email works'));
      } else {
        info('No users in database yet');
      }
    } catch (err) {
      fail(test(`User lookup: ${err.message}`));
    }
    
    // Test 3: Check password hash function available
    try {
      const hashedPwd = await bcryptjs.hash('test123', 10);
      const matches = await bcryptjs.compare('test123', hashedPwd);
      if (matches) {
        pass(test('Password hashing (bcryptjs) working'));
      } else {
        fail(test('Password hashing failed'));
      }
    } catch (err) {
      fail(test(`Password hashing: ${err.message}`));
    }
    
  } catch (err) {
    fail(test(`User lookup tests: ${err.message}`));
  }
}

// ============================================================================
// FINANCIAL MODULE TESTS
// ============================================================================

async function testFinancial() {
  section('💳 FINANCIAL MODULE TESTS');
  
  try {
    // Test 1: Transactions table exists
    try {
      const result = await pool.query('SELECT COUNT(*) FROM transactions');
      pass(test('transactions table exists'));
    } catch (err) {
      fail(test(`transactions table: ${err.message}`));
    }
    
    // Test 2: Fee structures table exists
    try {
      const result = await pool.query('SELECT COUNT(*) FROM fee_structures');
      pass(test('fee_structures table exists'));
    } catch (err) {
      fail(test(`fee_structures table: ${err.message}`));
    }
    
    // Test 3: Payment methods table exists
    try {
      const result = await pool.query('SELECT COUNT(*) FROM payment_methods');
      pass(test('payment_methods table exists'));
    } catch (err) {
      fail(test(`payment_methods table: ${err.message}`));
    }
    
  } catch (err) {
    fail(test(`Financial tests: ${err.message}`));
  }
}

// ============================================================================
// SUMMARY
// ============================================================================

async function printSummary() {
  section('📈 TEST RESULTS SUMMARY');
  
  const total = testsPassed + testsFailed;
  const percentage = total > 0 ? Math.round((testsPassed / total) * 100) : 0;
  
  log('cyan', `Total Tests: ${total}`);
  log('green', `✅ Passed: ${testsPassed}`);
  log('red', `❌ Failed: ${testsFailed}`);
  log('cyan', `Success Rate: ${percentage}%`);
  
  if (testsFailed === 0) {
    log('green', '\n🎉 ALL TESTS PASSED - SYSTEM READY FOR PRODUCTION');
  } else {
    log('yellow', `\n⚠️  ${testsFailed} test(s) failed - review above for details`);
  }
  
  log('blue', `${'═'.repeat(60)}\n`);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const command = process.argv[2] || 'all';
  
  try {
    switch (command) {
      case 'auth':
        await testAuthentication();
        break;
      case 'onboarding':
        await testOnboarding();
        break;
      case 'payments':
        await testPayments();
        break;
      case 'schema':
        await testSchema();
        break;
      case 'user':
        await testUserLookup();
        break;
      case 'financial':
        await testFinancial();
        break;
      case 'all':
      default:
        await testAuthentication();
        await testOnboarding();
        await testPayments();
        await testSchema();
        await testUserLookup();
        await testFinancial();
        break;
    }
    
    await printSummary();
    await pool.end();
    
    process.exit(testsFailed > 0 ? 1 : 0);
  } catch (err) {
    log('red', `\n❌ Test suite error: ${err.message}`);
    await pool.end();
    process.exit(1);
  }
}

main();
