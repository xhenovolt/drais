#!/usr/bin/env node

/**
 * Test Neon PostgreSQL Connection
 * Tests connectivity to the Neon database
 */

import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');

// Load environment
dotenv.config({ path: envPath });

async function testConnection() {
  console.log('\n🔗 Testing Neon PostgreSQL Connection...\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not set in .env.local');
    process.exit(1);
  }

  console.log('📍 Connection String (masked):');
  const dbUrl = process.env.DATABASE_URL;
  const masked = dbUrl.replace(/:[^:@]*@/, ':****@');
  console.log(`   ${masked}\n`);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('⏳ Connecting to Neon database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Test query
    console.log('📊 Running test query...');
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    
    console.log('✅ Query executed successfully!\n');
    console.log('📈 Server Information:');
    console.log(`   Current Time: ${result.rows[0].current_time}`);
    console.log(`   PostgreSQL: ${result.rows[0].postgres_version.split(',')[0]}\n`);

    // List tables
    console.log('📋 Checking for existing tables...');
    const tablesResult = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );
    
    if (tablesResult.rows.length === 0) {
      console.log('   No tables found (fresh database)\n');
      console.log('💡 Next Steps:');
      console.log('   1. Run: npm run migrate:postgres');
      console.log('   2. Run: node scripts/seed-postgres-data.js');
    } else {
      console.log(`   Found ${tablesResult.rows.length} table(s):\n`);
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      console.log();
    }

    console.log('✨ Connection test passed!\n');

  } catch (error) {
    console.error('❌ Connection failed!\n');
    console.error('Error:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Hint: Check that the hostname is correct and DNS is accessible');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Hint: Check that the database host is reachable');
    } else if (error.code === '28P01') {
      console.error('\n💡 Hint: Authentication failed - check username and password');
    } else if (error.code === '3D000') {
      console.error('\n💡 Hint: Database does not exist - check database name');
    }
    
    console.error('\nFull Error:');
    console.error(error);
    process.exit(1);

  } finally {
    await client.end();
  }
}

testConnection().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
