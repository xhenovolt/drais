#!/usr/bin/env node

/**
 * Database Migration Runner
 * Applies SQL migrations from src/lib/db/migrations/
 * Usage: node scripts/migrate.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPool } from '../src/lib/db/postgres.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIGRATIONS_DIR = path.join(__dirname, '../src/lib/db/migrations');

async function runMigrations() {
  const pool = await getPool();
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database migrations...');
    
    // Get all migration files
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    if (files.length === 0) {
      console.log('✅ No migrations to run');
      return;
    }
    
    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      
      console.log(`⏳ Running migration: ${file}`);
      
      try {
        await client.query(sql);
        console.log(`✅ Completed: ${file}`);
      } catch (error) {
        console.error(`❌ Failed: ${file}`);
        console.error(error.message);
        throw error;
      }
    }
    
    console.log('✅ All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
