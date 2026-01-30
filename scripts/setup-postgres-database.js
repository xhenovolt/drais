#!/usr/bin/env node

/**
 * DRAIS PostgreSQL Database Setup Script
 * Version: 1.0.0
 *
 * Initializes a fresh PostgreSQL database with DRAIS schema
 * Usage:
 *   node scripts/setup-postgres-database.js [options]
 *
 * Options:
 *   --drop-existing    Drop all existing tables before creating
 *   --seed-demo        Seed with demo data
 *   --neon             Use Neon-specific optimizations
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const DROP_EXISTING = args.includes('--drop-existing');
const SEED_DEMO = args.includes('--seed-demo');

/**
 * Connect to PostgreSQL
 */
async function connectPostgres() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL');
    client.release();
    return pool;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nMake sure DATABASE_URL is set in .env.local:');
    console.error('DATABASE_URL=postgresql://user:password@host/database?sslmode=require');
    process.exit(1);
  }
}

/**
 * Drop all existing tables
 */
async function dropExistingTables(pool) {
  console.log('⚠️  Dropping existing tables...');

  try {
    // Get all tables
    const result = await pool.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
    `);

    // Drop all tables with CASCADE
    for (const { tablename } of result.rows) {
      await pool.query(`DROP TABLE IF EXISTS ${tablename} CASCADE`);
      console.log(`  ✓ Dropped ${tablename}`);
    }

    console.log('✅ All existing tables dropped\n');
  } catch (error) {
    console.error('❌ Error dropping tables:', error.message);
    throw error;
  }
}

/**
 * Create schema from SQL file
 */
async function createSchema(pool) {
  console.log('📋 Creating database schema...');

  try {
    // Read schema SQL file
    const schemaPath = path.join(__dirname, '../database/postgres_schema_v1.0.0.sql');

    if (!fs.existsSync(schemaPath)) {
      throw new Error(
        `Schema file not found at ${schemaPath}\n` +
          'Make sure postgres_schema_v1.0.0.sql exists in database/ directory'
      );
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    // Execute schema creation
    await pool.query(schemaSql);

    console.log('✅ Schema created successfully\n');
  } catch (error) {
    console.error('❌ Error creating schema:', error.message);
    throw error;
  }
}

/**
 * Seed demo data
 */
async function seedDemoData(pool) {
  console.log('🌱 Seeding demo data...');

  try {
    // Create demo school
    const schoolResult = await pool.query(
      `INSERT INTO schools (name, slug, code, email, phone, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      ['Demo School', 'demo-school', 'DEMO001', 'info@demoschool.edu', '+1234567890', 'active']
    );

    const schoolId = schoolResult.rows[0].id;
    console.log(`  ✓ Created demo school (ID: ${schoolId})`);

    // Create demo admin user
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash('Password123!', 12);

    const userResult = await pool.query(
      `INSERT INTO users (
        school_id, username, email, password_hash,
        first_name, last_name, role, account_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id`,
      [schoolId, 'admin', 'admin@demoschool.edu', hashedPassword, 'Admin', 'User', 'school_admin', 'active']
    );

    const adminId = userResult.rows[0].id;
    console.log(`  ✓ Created admin user (ID: ${adminId})`);

    // Create academic year
    const yearResult = await pool.query(
      `INSERT INTO academic_years (school_id, name, start_date, end_date, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        schoolId,
        '2024-2025',
        new Date('2024-01-01'),
        new Date('2024-12-31'),
        'active',
      ]
    );

    const yearId = yearResult.rows[0].id;
    console.log(`  ✓ Created academic year (ID: ${yearId})`);

    // Create demo class
    const classResult = await pool.query(
      `INSERT INTO classes (school_id, name, code, level, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [schoolId, 'Primary 1', 'P1', 'primary_1', 'active']
    );

    const classId = classResult.rows[0].id;
    console.log(`  ✓ Created demo class (ID: ${classId})`);

    // Create subject
    const subjectResult = await pool.query(
      `INSERT INTO subjects (school_id, name, code, subject_category, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [schoolId, 'Mathematics', 'MATH', 'science', 'active']
    );

    const subjectId = subjectResult.rows[0].id;
    console.log(`  ✓ Created demo subject (ID: ${subjectId})`);

    console.log('✅ Demo data seeded successfully\n');
  } catch (error) {
    console.error('❌ Error seeding demo data:', error.message);
    throw error;
  }
}

/**
 * Verify schema creation
 */
async function verifySchema(pool) {
  console.log('🔍 Verifying schema...');

  try {
    // Get all tables
    const result = await pool.query(`
      SELECT COUNT(*) as count FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    const tableCount = result.rows[0].count;
    console.log(`  ✓ Created ${tableCount} tables`);

    // List key tables
    const keyTables = ['users', 'sessions', 'schools', 'classes', 'subjects'];

    for (const table of keyTables) {
      const check = await pool.query(`
        SELECT COUNT(*) as count FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = $1
      `, [table]);

      if (check.rows[0].count > 0) {
        console.log(`  ✓ ${table} table exists`);
      } else {
        console.warn(`  ⚠ ${table} table missing`);
      }
    }

    console.log('✅ Schema verification complete\n');
  } catch (error) {
    console.error('❌ Verification error:', error.message);
    throw error;
  }
}

/**
 * Show connection info
 */
function showConnectionInfo() {
  console.log('📋 Connection Information');
  console.log('========================');
  console.log(`Database URL: ${process.env.DATABASE_URL.split('?')[0]}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n');
}

/**
 * Main setup function
 */
async function setup() {
  console.log('🚀 DRAIS PostgreSQL Database Setup');
  console.log('===================================\n');

  showConnectionInfo();

  const pool = await connectPostgres();

  try {
    if (DROP_EXISTING) {
      await dropExistingTables(pool);
    }

    await createSchema(pool);
    await verifySchema(pool);

    if (SEED_DEMO) {
      await seedDemoData(pool);
    }

    console.log('✅ Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update your .env.local with DATABASE_URL');
    console.log('2. Start your application: npm run dev');
    console.log('3. Test login with demo credentials:');
    console.log('   Email: admin@demoschool.edu');
    console.log('   Password: Password123!');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run setup
setup().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
