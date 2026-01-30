/**
 * Authentication Utilities Library (Jeton Compatible)
 * 
 * Provides password hashing, verification, and user lookup
 * Uses bcryptjs for password security and parameterized queries for SQL safety
 */

import bcrypt from 'bcryptjs';
import { getPool } from './db/postgres.js';

const BCRYPT_SALT_ROUNDS = 10;

/**
 * Hash a plain-text password using bcrypt
 * 
 * @param {string} password - Plain-text password
 * @returns {Promise<string>} Bcrypt hash
 */
export async function hashPassword(password) {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  try {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  } catch (error) {
    console.error('[Auth] Hash password error:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Compare a plain-text password with a bcrypt hash
 * 
 * @param {string} password - Plain-text password to check
 * @param {string} hash - Bcrypt hash to compare against
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
export async function comparePassword(password, hash) {
  if (!password || !hash) {
    return false;
  }

  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('[Auth] Compare password error:', error);
    return false;
  }
}

/**
 * Find user by email address
 * 
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null if not found
 */
export async function findUserByEmail(email) {
  if (!email) {
    return null;
  }

  try {
    const pool = await getPool();
    
    const result = await pool.query(
      `SELECT id, email, password_hash, role, status, created_at
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('[Auth] Find user by email error:', error);
    return null;
  }
}

/**
 * Find user by ID
 * 
 * @param {string|number} userId - User ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
export async function findUserById(userId) {
  if (!userId) {
    return null;
  }

  try {
    const pool = await getPool();
    
    const result = await pool.query(
      `SELECT id, email, password_hash, role, status, created_at
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [userId]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('[Auth] Find user by ID error:', error);
    return null;
  }
}

/**
 * Verify user credentials (combined find + compare)
 * Used in login endpoint
 * 
 * @param {string} email - User email
 * @param {string} password - Plain-text password
 * @returns {Promise<Object|null>} User object if valid, null if invalid
 */
export async function verifyCredentials(email, password) {
  if (!email || !password) {
    return null;
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return null;
    }

    const passwordValid = await comparePassword(password, user.password_hash);
    if (!passwordValid) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('[Auth] Verify credentials error:', error);
    return null;
  }
}

/**
 * Create a new user with hashed password
 * 
 * @param {string} email - User email
 * @param {string} password - Plain-text password
 * @param {string} role - User role (default: 'student')
 * @returns {Promise<Object>} New user object
 */
export async function createUser(email, password, role = 'student') {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  try {
    const pool = await getPool();
    
    // Check if user already exists
    const existing = await findUserByEmail(email);
    if (existing) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, status, created_at, updated_at)
       VALUES ($1, $2, $3, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, email, role, status, created_at`,
      [email, passwordHash, role]
    );

    return result.rows[0];
  } catch (error) {
    console.error('[Auth] Create user error:', error);
    throw error;
  }
}

/**
 * Update user's last login timestamp
 * 
 * @param {string|number} userId - User ID
 * @returns {Promise<void>}
 */
export async function updateLastLogin(userId) {
  if (!userId) {
    return;
  }

  try {
    const pool = await getPool();
    
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
  } catch (error) {
    console.error('[Auth] Update last login error:', error);
    // Non-blocking error
  }
}
