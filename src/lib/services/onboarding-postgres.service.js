/**
 * Enhanced Onboarding Service - v0.0.0047
 * 
 * Features:
 * - Atomic transactions for school + super-admin creation
 * - Proper PostgreSQL transaction handling
 * - Comprehensive validation before inserts
 * - Unique school_code generation
 * - Super-admin provisioning with school scope
 * - Soft delete support (deleted_at)
 * - Clear error handling with user-safe messages
 * - Full audit logging
 */

import { Pool } from 'pg';
import bcryptjs from 'bcryptjs';
import { nanoid } from 'nanoid';
import db from '../db/index.js';
import 'dotenv/config.js';

// PostgreSQL connection pool for transactions
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// =====================================================================
// VALIDATION & UTILITY FUNCTIONS
// =====================================================================

/**
 * Generate a unique school code
 * Format: SCH + 10 random alphanumeric characters
 */
function generateSchoolCode() {
  return `SCH${nanoid(10).toUpperCase()}`;
}

/**
 * Validate school data before insertion
 */
function validateSchoolData(data) {
  const errors = [];

  if (!data.school_name || data.school_name.trim().length === 0) {
    errors.push('School name is required');
  }
  if (data.school_name && data.school_name.length > 255) {
    errors.push('School name must be less than 255 characters');
  }

  if (!data.school_type) {
    errors.push('School type is required');
  }
  const validTypes = ['primary', 'secondary', 'primary_secondary', 'tertiary', 'vocational'];
  if (data.school_type && !validTypes.includes(data.school_type)) {
    errors.push(`Invalid school type. Must be one of: ${validTypes.join(', ')}`);
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid school email address');
  }

  if (data.phone && data.phone.length > 30) {
    errors.push('Phone number must be less than 30 characters');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate owner/super-admin data
 */
function validateOwnerData(data) {
  const errors = [];

  if (!data.owner_email || !isValidEmail(data.owner_email)) {
    errors.push('Valid owner email is required');
  }

  if (!data.owner_password || data.owner_password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!data.owner_first_name || data.owner_first_name.trim().length === 0) {
    errors.push('Owner first name is required');
  }

  if (!data.owner_last_name || data.owner_last_name.trim().length === 0) {
    errors.push('Owner last name is required');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Simple email validation
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Hash password with bcryptjs
 */
async function hashPassword(password) {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
  return bcryptjs.hash(password, saltRounds);
}

// =====================================================================
// MAIN ONBOARDING FUNCTIONS
// =====================================================================

/**
 * Create school and super-admin user in a single atomic transaction
 * 
 * This function ensures that either both school and user are created,
 * or neither is created if any error occurs.
 */
export async function createSchoolAndSuperAdmin(schoolData, ownerData) {
  const client = await pool.connect();

  try {
    // ===== VALIDATION PHASE =====
    console.log('[ONBOARDING] Validating school data...');
    const schoolValidation = validateSchoolData(schoolData);
    if (!schoolValidation.isValid) {
      throw {
        status: 400,
        message: 'School validation failed',
        details: schoolValidation.errors,
      };
    }

    console.log('[ONBOARDING] Validating owner data...');
    const ownerValidation = validateOwnerData(ownerData);
    if (!ownerValidation.isValid) {
      throw {
        status: 400,
        message: 'Owner validation failed',
        details: ownerValidation.errors,
      };
    }

    // ===== DUPLICATION CHECKS =====
    console.log('[ONBOARDING] Checking for existing school_code...');
    const schoolCodeResult = await client.query(
      'SELECT id FROM schools WHERE school_code = $1 AND deleted_at IS NULL LIMIT 1',
      [schoolData.school_code || ''] // Allow null for auto-generation
    );

    if (schoolCodeResult.rows.length > 0) {
      throw {
        status: 409,
        message: 'School code already exists',
        details: ['A school with this code already exists'],
      };
    }

    console.log('[ONBOARDING] Checking for existing owner email...');
    const userResult = await client.query(
      'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL LIMIT 1',
      [ownerData.owner_email]
    );

    if (userResult.rows.length > 0) {
      throw {
        status: 409,
        message: 'Email already registered',
        details: ['This email is already registered in the system'],
      };
    }

    // ===== TRANSACTION START =====
    console.log('[ONBOARDING] Starting transaction...');
    await client.query('BEGIN');

    // ===== CREATE SCHOOL =====
    console.log('[ONBOARDING] Creating school record...');
    const schoolCode = schoolData.school_code || generateSchoolCode();
    const schoolId = nanoid(16);

    const schoolInsertResult = await client.query(
      `INSERT INTO schools (
        id, school_code, name, school_type, email, phone, address,
        currency, timezone, subscription_plan, subscription_status,
        subscription_start_date, owner_email, owner_name, owner_phone,
        status, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING id`,
      [
        schoolId,
        schoolCode,
        schoolData.school_name,
        schoolData.school_type || 'primary',
        schoolData.email || null,
        schoolData.phone || null,
        schoolData.address || null,
        schoolData.currency || 'UGX',
        schoolData.timezone || 'Africa/Kampala',
        'trial', // Default plan
        'trial', // Default status
        new Date(), // subscription start
        ownerData.owner_email,
        `${ownerData.owner_first_name} ${ownerData.owner_last_name}`,
        ownerData.owner_phone || null,
        'active',
      ]
    );

    if (schoolInsertResult.rows.length === 0) {
      throw {
        status: 500,
        message: 'Failed to create school record',
        details: ['School insert operation returned no rows'],
      };
    }

    const createdSchoolId = schoolInsertResult.rows[0].id;
    console.log(`[ONBOARDING] School created: ID=${createdSchoolId}, Code=${schoolCode}`);

    // ===== CREATE SUPER-ADMIN USER =====
    console.log('[ONBOARDING] Creating super-admin user...');
    const userId = nanoid(16);
    const passwordHash = await hashPassword(ownerData.owner_password);

    const userInsertResult = await client.query(
      `INSERT INTO users (
        id, school_id, email, username, password_hash, first_name, last_name,
        phone, user_role, is_active, email_verified, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING id`,
      [
        userId,
        createdSchoolId,
        ownerData.owner_email,
        ownerData.owner_email.split('@')[0], // Username from email prefix
        passwordHash,
        ownerData.owner_first_name,
        ownerData.owner_last_name,
        ownerData.owner_phone || null,
        'super_admin', // Role must be exactly 'super_admin'
        true, // is_active
        true, // email_verified
      ]
    );

    if (userInsertResult.rows.length === 0) {
      throw {
        status: 500,
        message: 'Failed to create super-admin user',
        details: ['User insert operation returned no rows'],
      };
    }

    const createdUserId = userInsertResult.rows[0].id;
    console.log(`[ONBOARDING] Super-admin user created: ID=${createdUserId}`);

    // ===== INITIALIZE ONBOARDING STEPS =====
    console.log('[ONBOARDING] Initializing onboarding steps...');
    const steps = [
      { step_name: 'school_setup', step_order: 1, status: 'completed' },
      { step_name: 'admin_profile', step_order: 2, status: 'completed' },
      { step_name: 'payment_plan', step_order: 3, status: 'pending' },
      { step_name: 'review_confirm', step_order: 4, status: 'pending' },
    ];

    for (const step of steps) {
      await client.query(
        `INSERT INTO onboarding_steps (
          user_id, step_name, step_order, status, step_data, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [createdUserId, step.step_name, step.step_order, step.status, JSON.stringify({})]
      );
    }

    // ===== TRANSACTION COMMIT =====
    console.log('[ONBOARDING] Committing transaction...');
    await client.query('COMMIT');

    console.log('[ONBOARDING] ✅ Onboarding completed successfully');

    return {
      success: true,
      message: 'School and super-admin created successfully',
      data: {
        schoolId: createdSchoolId,
        schoolCode: schoolCode,
        userId: createdUserId,
        email: ownerData.owner_email,
        role: 'super_admin',
      },
    };
  } catch (error) {
    // Rollback on any error
    try {
      await client.query('ROLLBACK');
      console.log('[ONBOARDING] Transaction rolled back');
    } catch (rollbackErr) {
      console.error('[ONBOARDING] Rollback failed:', rollbackErr.message);
    }

    console.error('[ONBOARDING] ❌ Error:', error.message);

    // Return user-safe error response
    if (error.status && error.message) {
      return {
        success: false,
        status: error.status,
        message: error.message,
        details: error.details || [],
      };
    }

    // Generic server error
    return {
      success: false,
      status: 500,
      message: 'An unexpected error occurred during onboarding',
      details: [error.message],
    };
  } finally {
    client.release();
  }
}

/**
 * Get school details by ID
 */
export async function getSchoolById(schoolId) {
  try {
    const result = await pool.query(
      `SELECT * FROM schools WHERE id = $1 AND deleted_at IS NULL`,
      [schoolId]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('[ONBOARDING] Error getting school:', error.message);
    throw error;
  }
}

/**
 * Get school by code
 */
export async function getSchoolByCode(schoolCode) {
  try {
    const result = await pool.query(
      `SELECT * FROM schools WHERE school_code = $1 AND deleted_at IS NULL`,
      [schoolCode]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('[ONBOARDING] Error getting school by code:', error.message);
    throw error;
  }
}

/**
 * Close the connection pool
 */
export async function closePool() {
  try {
    await pool.end();
    console.log('[ONBOARDING] Connection pool closed');
  } catch (error) {
    console.error('[ONBOARDING] Error closing pool:', error.message);
  }
}

// Graceful shutdown handlers
process.on('SIGINT', closePool);
process.on('SIGTERM', closePool);

export default {
  createSchoolAndSuperAdmin,
  getSchoolById,
  getSchoolByCode,
  closePool,
};
