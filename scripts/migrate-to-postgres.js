/**
 * PostgreSQL Schema Migration for DRAIS
 * DRAIS v0.0.0050
 * 
 * Migrates MySQL schema to PostgreSQL format
 * Ensures schema parity between MySQL and PostgreSQL
 * 
 * Run: node scripts/migrate-to-postgres.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postgres from '../src/lib/db/postgres.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Core tables that should exist in both MySQL and PostgreSQL
 */
const REQUIRED_TABLES = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      school_id BIGINT,
      branch_id BIGINT,
      username VARCHAR(80) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      phone VARCHAR(20),
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'student',
      permissions JSONB,
      status VARCHAR(50) DEFAULT 'active',
      email_verified_at TIMESTAMP,
      phone_verified_at TIMESTAMP,
      two_factor_enabled BOOLEAN DEFAULT FALSE,
      two_factor_secret VARCHAR(255),
      last_login_at TIMESTAMP,
      last_login_ip VARCHAR(45),
      login_attempts INT DEFAULT 0,
      locked_until TIMESTAMP,
      password_changed_at TIMESTAMP,
      reset_token VARCHAR(255),
      reset_token_expires_at TIMESTAMP,
      profile_image_url VARCHAR(255),
      bio TEXT,
      date_of_birth DATE,
      gender VARCHAR(20),
      address VARCHAR(255),
      city VARCHAR(100),
      country VARCHAR(100),
      zip_code VARCHAR(20),
      photo_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP,
      CONSTRAINT fk_users_school FOREIGN KEY (school_id) REFERENCES schools(id)
    );
    
    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_users_username ON users(username);
    CREATE INDEX idx_users_school_id ON users(school_id);
  `,

  sessions: `
    CREATE TABLE IF NOT EXISTS sessions (
      id BIGSERIAL PRIMARY KEY,
      session_id VARCHAR(255) UNIQUE NOT NULL,
      user_id BIGINT NOT NULL,
      csrf_token VARCHAR(255) NOT NULL,
      data TEXT,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ip_address VARCHAR(45),
      user_agent TEXT,
      CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    
    CREATE INDEX idx_sessions_session_id ON sessions(session_id);
    CREATE INDEX idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
  `,

  schools: `
    CREATE TABLE IF NOT EXISTS schools (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      code VARCHAR(50) UNIQUE,
      country VARCHAR(100),
      county VARCHAR(100),
      sub_county VARCHAR(100),
      ward VARCHAR(100),
      email VARCHAR(255),
      phone VARCHAR(20),
      website VARCHAR(255),
      principal_name VARCHAR(100),
      principal_email VARCHAR(255),
      principal_phone VARCHAR(20),
      school_type VARCHAR(50),
      registration_number VARCHAR(100),
      year_established INT,
      language_of_instruction VARCHAR(50),
      motto VARCHAR(255),
      address VARCHAR(255),
      logo_url VARCHAR(255),
      banner_url VARCHAR(255),
      currency VARCHAR(10) DEFAULT 'UGX',
      timezone VARCHAR(50) DEFAULT 'Africa/Kampala',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP
    );
    
    CREATE INDEX idx_schools_code ON schools(code);
  `,

  refresh_tokens: `
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL,
      token VARCHAR(500) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      revoked BOOLEAN DEFAULT FALSE,
      revoked_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    
    CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
    CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
  `,

  blacklisted_tokens: `
    CREATE TABLE IF NOT EXISTS blacklisted_tokens (
      id BIGSERIAL PRIMARY KEY,
      token VARCHAR(500) NOT NULL UNIQUE,
      user_id BIGINT,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_blacklisted_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
    
    CREATE INDEX idx_blacklisted_tokens_expires_at ON blacklisted_tokens(expires_at);
  `,

  user_roles: `
    CREATE TABLE IF NOT EXISTS user_roles (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL,
      role VARCHAR(50) NOT NULL,
      school_id BIGINT,
      assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_user_roles_school FOREIGN KEY (school_id) REFERENCES schools(id)
    );
    
    CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
  `,

  permissions: `
    CREATE TABLE IF NOT EXISTS permissions (
      id BIGSERIAL PRIMARY KEY,
      code VARCHAR(120) UNIQUE NOT NULL,
      description TEXT,
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  role_permissions: `
    CREATE TABLE IF NOT EXISTS role_permissions (
      id BIGSERIAL PRIMARY KEY,
      role VARCHAR(50) NOT NULL,
      permission_id BIGINT NOT NULL,
      school_id BIGINT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_role_perms_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
    );
    
    CREATE INDEX idx_role_perms_role ON role_permissions(role);
  `,

  students: `
    CREATE TABLE IF NOT EXISTS students (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL,
      school_id BIGINT NOT NULL,
      admission_number VARCHAR(50) UNIQUE,
      class_id BIGINT,
      stream VARCHAR(50),
      date_of_birth DATE,
      gender VARCHAR(20),
      mother_name VARCHAR(100),
      mother_phone VARCHAR(20),
      father_name VARCHAR(100),
      father_phone VARCHAR(20),
      guardian_name VARCHAR(100),
      guardian_phone VARCHAR(20),
      guardian_email VARCHAR(255),
      blood_group VARCHAR(5),
      allergies TEXT,
      medical_conditions TEXT,
      previous_school VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP,
      CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_students_school FOREIGN KEY (school_id) REFERENCES schools(id)
    );
    
    CREATE INDEX idx_students_user_id ON students(user_id);
    CREATE INDEX idx_students_school_id ON students(school_id);
  `,

  classes: `
    CREATE TABLE IF NOT EXISTS classes (
      id BIGSERIAL PRIMARY KEY,
      school_id BIGINT NOT NULL,
      name VARCHAR(100) NOT NULL,
      level VARCHAR(50),
      stream VARCHAR(50),
      capacity INT,
      teacher_id BIGINT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_classes_school FOREIGN KEY (school_id) REFERENCES schools(id),
      CONSTRAINT fk_classes_teacher FOREIGN KEY (teacher_id) REFERENCES users(id)
    );
    
    CREATE INDEX idx_classes_school_id ON classes(school_id);
  `,

  subjects: `
    CREATE TABLE IF NOT EXISTS subjects (
      id BIGSERIAL PRIMARY KEY,
      school_id BIGINT NOT NULL,
      name VARCHAR(100) NOT NULL,
      code VARCHAR(50),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_subjects_school FOREIGN KEY (school_id) REFERENCES schools(id)
    );
    
    CREATE INDEX idx_subjects_school_id ON subjects(school_id);
  `,

  teachers: `
    CREATE TABLE IF NOT EXISTS teachers (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL,
      school_id BIGINT NOT NULL,
      employee_number VARCHAR(50) UNIQUE,
      qualification VARCHAR(255),
      specialization VARCHAR(100),
      department VARCHAR(100),
      employment_date DATE,
      status VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_teachers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_teachers_school FOREIGN KEY (school_id) REFERENCES schools(id)
    );
    
    CREATE INDEX idx_teachers_user_id ON teachers(user_id);
    CREATE INDEX idx_teachers_school_id ON teachers(school_id);
  `,
};

/**
 * Connect and run migrations
 */
async function migrate() {
  try {
    console.log('🚀 Starting PostgreSQL Schema Migration...');
    console.log('');

    const pool = await postgres.initPostgres();

    // Create tables
    for (const [tableName, createSql] of Object.entries(REQUIRED_TABLES)) {
      try {
        console.log(`📊 Creating table: ${tableName}...`);
        await postgres.rawQuery(createSql);
        console.log(`✅ Table ${tableName} created successfully`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Table ${tableName} already exists`);
        } else {
          console.error(`❌ Error creating ${tableName}:`, error.message);
          throw error;
        }
      }
    }

    console.log('');
    console.log('✅ PostgreSQL schema migration completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Update .env to set: PRIMARY_DB=postgres');
    console.log('2. Ensure POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE are set');
    console.log('3. For Neon: Use DATABASE_URL instead of individual credentials');
    console.log('4. Run: npm run dev');
    console.log('5. Test connection: curl http://localhost:3000/api/test-db');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
migrate();
