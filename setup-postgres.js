import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

/**
 * Create Missing Tables & Validate Role Enum
 */

async function createMissingTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const client = await pool.connect();
    console.log('🔧 Setting up PostgreSQL schema...\n');

    // 1. Check and create persons table if missing
    console.log('1️⃣  Checking persons table...');
    const personTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'persons'
      );
    `);

    if (!personTableCheck.rows[0].exists) {
      console.log('  Creating persons table...');
      await client.query(`
        CREATE TABLE persons (
          id BIGSERIAL PRIMARY KEY,
          school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
          first_name VARCHAR(100) NOT NULL,
          middle_name VARCHAR(100),
          last_name VARCHAR(100) NOT NULL,
          date_of_birth DATE,
          gender VARCHAR(50),
          phone VARCHAR(30),
          national_id VARCHAR(100),
          email VARCHAR(255),
          address TEXT,
          city VARCHAR(100),
          state VARCHAR(100),
          country VARCHAR(100),
          postal_code VARCHAR(20),
          avatar_url VARCHAR(500),
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP DEFAULT NULL,
          CONSTRAINT unique_person_email UNIQUE (email, school_id),
          CONSTRAINT unique_person_phone UNIQUE (phone, school_id)
        );
        CREATE INDEX idx_persons_school_id ON persons(school_id);
        CREATE INDEX idx_persons_email ON persons(email);
        CREATE INDEX idx_persons_phone ON persons(phone);
      `);
      console.log('  ✓ persons table created');
    } else {
      console.log('  ✓ persons table exists');
    }

    // 2. Check and create sessions table
    console.log('\n2️⃣  Checking sessions table...');
    const sessionTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'sessions'
      );
    `);

    if (!sessionTableCheck.rows[0].exists) {
      console.log('  Creating sessions table...');
      await client.query(`
        CREATE TABLE sessions (
          id BIGSERIAL PRIMARY KEY,
          user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
          session_token VARCHAR(500) NOT NULL UNIQUE,
          ip_address VARCHAR(45),
          user_agent TEXT,
          device_type VARCHAR(50),
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP NOT NULL,
          CONSTRAINT valid_session_times CHECK (created_at <= last_activity AND last_activity <= expires_at)
        );
        CREATE INDEX idx_sessions_user_id ON sessions(user_id);
        CREATE INDEX idx_sessions_school_id ON sessions(school_id);
        CREATE INDEX idx_sessions_token ON sessions(session_token);
        CREATE INDEX idx_sessions_is_active ON sessions(is_active);
        CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
      `);
      console.log('  ✓ sessions table created');
    } else {
      console.log('  ✓ sessions table exists');
    }

    // 3. Check role enum and valid values
    console.log('\n3️⃣  Checking role enum...');
    const roleEnumCheck = await client.query(`
      SELECT e.enumlabel
      FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'user_role'
      ORDER BY e.enumsortorder;
    `);

    if (roleEnumCheck.rows.length === 0) {
      console.log('  Creating user_role enum...');
      await client.query(`
        CREATE TYPE user_role AS ENUM (
          'superadmin',
          'admin',
          'teacher',
          'student',
          'parent'
        );
      `);
      // Alter users table to use new enum
      await client.query(`
        ALTER TABLE users 
        ALTER COLUMN role TYPE user_role 
        USING role::user_role;
      `);
      console.log('  ✓ user_role enum created');
    } else {
      console.log('  ✓ user_role enum exists with values:');
      roleEnumCheck.rows.forEach(row => console.log(`    - ${row.enumlabel}`));
    }

    // 4. Verify school exists
    console.log('\n4️⃣  Checking schools...');
    const schoolCheck = await client.query(`
      SELECT id, name, code FROM schools LIMIT 1;
    `);

    if (schoolCheck.rows.length === 0) {
      console.log('  Creating default school...');
      await client.query(`
        INSERT INTO schools (name, code, status)
        VALUES ('Default School', 'DEFAULT001', 'active')
        ON CONFLICT (code) DO NOTHING;
      `);
      console.log('  ✓ Default school created');
    } else {
      console.log('  ✓ Schools exist:');
      schoolCheck.rows.forEach(school => {
        console.log(`    - ${school.name} (${school.code})`);
      });
    }

    // 5. Summary
    console.log('\n✅ PostgreSQL schema setup complete!');

    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createMissingTables();
