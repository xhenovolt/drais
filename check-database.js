#!/usr/bin/env node

/**
 * DRAIS Database Diagnostic Tool
 * Version: 0.0.0050+
 * 
 * Comprehensive database checking and validation
 * Merged from: check-neon-branch.js, check-schools-schema.js, check-table-schema.js
 * 
 * Usage: node check-database.js [command]
 * Commands: connection, tables, schema, critical, schools, all (default)
 */

import pg from 'pg';
import dotenv from 'dotenv';

// Load environment
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || 
  'postgresql://neondb_owner:npg_HExwNUY6aVP9@ep-small-sound-adgn2dmu-pooler.c-2.us-east-1.aws.neon.tech/drais?sslmode=require&channel_binding=require';

const pool = new pg.Pool({ connectionString });

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m'
};

function log(color, text) {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

async function checkConnection() {
  log('blue', '\n═══════════════════════════════════════════════════════════');
  log('blue', '🔌 DATABASE CONNECTION CHECK');
  log('blue', '═══════════════════════════════════════════════════════════\n');
  
  try {
    const result = await pool.query(`
      SELECT 
        current_database() as database,
        current_schema() as current_schema,
        inet_server_addr() as server_addr,
        current_user as user,
        version()
    `);
    
    const row = result.rows[0];
    log('green', '✅ Connected successfully');
    console.log(`  Database: ${row.database}`);
    console.log(`  Schema: ${row.current_schema}`);
    console.log(`  User: ${row.user}`);
    console.log(`  Server: ${row.server_addr || 'localhost'}`);
    console.log(`  Version: ${row.version.split(',')[0]}`);
    return true;
  } catch (err) {
    log('red', `❌ Connection failed: ${err.message}`);
    return false;
  }
}

async function checkTableCount() {
  log('blue', '\n═══════════════════════════════════════════════════════════');
  log('blue', '📊 TABLE COUNT CHECK');
  log('blue', '═══════════════════════════════════════════════════════════\n');
  
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema='public' AND table_type='BASE TABLE'
    `);
    
    const count = result.rows[0].table_count;
    log('green', `✅ Total tables: ${count}`);
    
    if (count >= 55) {
      log('green', '✅ Table count matches expected (55+)');
    } else {
      log('yellow', `⚠️  Expected 55+ tables, found ${count}`);
    }
    return true;
  } catch (err) {
    log('red', `❌ Error: ${err.message}`);
    return false;
  }
}

async function checkCriticalTables() {
  log('blue', '\n═══════════════════════════════════════════════════════════');
  log('blue', '🔑 CRITICAL TABLES CHECK');
  log('blue', '═══════════════════════════════════════════════════════════\n');
  
  const criticalTables = [
    'onboarding_steps',
    'user_profiles',
    'user_trials',
    'user_payment_plans',
    'payment_plans'
  ];
  
  let allPresent = true;
  
  for (const table of criticalTables) {
    try {
      const result = await pool.query(
        `SELECT COUNT(*) as cnt FROM ${table} LIMIT 1`
      );
      log('green', `✅ ${table}`);
    } catch (err) {
      log('red', `❌ ${table} (MISSING)`);
      allPresent = false;
    }
  }
  
  if (allPresent) {
    log('green', '\n✅ All critical tables present');
  } else {
    log('red', '\n❌ Some critical tables missing');
  }
  
  return allPresent;
}

async function listAllTables() {
  log('blue', '\n═══════════════════════════════════════════════════════════');
  log('blue', '📋 ALL TABLES IN PUBLIC SCHEMA');
  log('blue', '═══════════════════════════════════════════════════════════\n');
  
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema='public' AND table_type='BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log(`Total: ${result.rows.length} tables\n`);
    result.rows.forEach((row, idx) => {
      console.log(`${(idx + 1).toString().padStart(2)}. ${row.table_name}`);
    });
    return true;
  } catch (err) {
    log('red', `❌ Error: ${err.message}`);
    return false;
  }
}

async function checkSchoolsSchema() {
  log('blue', '\n═══════════════════════════════════════════════════════════');
  log('blue', '🏫 SCHOOLS TABLE SCHEMA');
  log('blue', '═══════════════════════════════════════════════════════════\n');
  
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'schools'
      ORDER BY ordinal_position
    `);
    
    if (result.rows.length === 0) {
      log('yellow', '⚠️  Schools table not found');
      return false;
    }
    
    console.log('Columns:\n');
    result.rows.forEach(row => {
      const nullable = row.is_nullable === 'YES' ? '' : ' NOT NULL';
      const def = row.column_default ? ` DEFAULT ${row.column_default}` : '';
      console.log(`  ${row.column_name}: ${row.data_type}${nullable}${def}`);
    });
    
    console.log(`\nTotal: ${result.rows.length} columns`);
    
    const hasSchoolCode = result.rows.some(r => r.column_name === 'school_code');
    const hasCode = result.rows.some(r => r.column_name === 'code');
    
    console.log('\nAnalysis:');
    console.log(`  Has 'school_code' column: ${hasSchoolCode ? '✓ YES' : '✗ NO'}`);
    console.log(`  Has 'code' column: ${hasCode ? '✓ YES' : '✗ NO'}`);
    
    return true;
  } catch (err) {
    log('red', `❌ Error: ${err.message}`);
    return false;
  }
}

async function checkPaymentPlans() {
  log('blue', '\n═══════════════════════════════════════════════════════════');
  log('blue', '💰 PAYMENT PLANS');
  log('blue', '═══════════════════════════════════════════════════════════\n');
  
  try {
    const result = await pool.query(`
      SELECT id, plan_name, plan_code, trial_period_days, is_active 
      FROM payment_plans 
      ORDER BY sort_order
    `);
    
    if (result.rows.length === 0) {
      log('yellow', '⚠️  No payment plans found');
      return false;
    }
    
    log('green', `✅ Found ${result.rows.length} payment plans\n`);
    
    result.rows.forEach(row => {
      const status = row.is_active ? '🟢' : '⚫';
      const trial = row.trial_period_days ? ` (${row.trial_period_days} day trial)` : '';
      console.log(`  ${status} ${row.plan_name} [${row.plan_code}]${trial}`);
    });
    
    return true;
  } catch (err) {
    log('red', `❌ Error: ${err.message}`);
    return false;
  }
}

async function runAllChecks() {
  const connected = await checkConnection();
  if (!connected) {
    log('red', '\n❌ Cannot proceed - database not connected');
    process.exit(1);
  }
  
  await checkTableCount();
  await checkCriticalTables();
  await listAllTables();
  await checkSchoolsSchema();
  await checkPaymentPlans();
  
  log('blue', '\n═══════════════════════════════════════════════════════════');
  log('green', '✅ ALL CHECKS COMPLETE');
  log('blue', '═══════════════════════════════════════════════════════════\n');
}

// Main execution
const command = process.argv[2] || 'all';

(async () => {
  try {
    switch (command) {
      case 'connection':
        await checkConnection();
        break;
      case 'tables':
        await listAllTables();
        break;
      case 'critical':
        await checkCriticalTables();
        break;
      case 'schema':
        await checkSchoolsSchema();
        break;
      case 'plans':
        await checkPaymentPlans();
        break;
      case 'all':
      default:
        await runAllChecks();
        break;
    }
    
    await pool.end();
  } catch (err) {
    log('red', `\n❌ Error: ${err.message}`);
    process.exit(1);
  }
})();
