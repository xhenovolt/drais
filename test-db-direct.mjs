#!/usr/bin/env node

/**
 * Direct database test
 */

import pg from 'pg';

const { Pool } = pg;

async function test() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Testing direct DB connection...\n');
    
    const result = await pool.query('SELECT id, email FROM users LIMIT 1');
    console.log('✅ Query succeeded:', result.rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

test();
