/**
 * Session Management Library (Jeton Compatible)
 * Adapted to DRAIS existing schema
 * 
 * Provides session creation, validation, and deletion
 * Uses PostgreSQL for persistence and jeton_session HTTP-only cookie
 */

import crypto from 'crypto';
import { getPool } from './db/postgres.js';

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Generate a session token
 * Returns a random string suitable for storing as session_token in the database
 */
function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a new session for a user
 * 
 * @param {string|number} userId - User ID
 * @returns {Promise<string>} Session token (stored in jeton_session cookie)
 */
export async function createSession(userId) {
  if (!userId) {
    throw new Error('userId is required');
  }

  try {
    const pool = await getPool();
    
    const expiresAt = new Date(Date.now() + SESSION_DURATION);
    const now = new Date();
    const sessionToken = generateSessionToken();
    
    const result = await pool.query(
      `INSERT INTO sessions (user_id, session_token, created_at, last_activity, expires_at, is_active, school_id)
       VALUES ($1, $2, $3, $4, $5, $6, (SELECT school_id FROM users WHERE id = $1))
       RETURNING session_token`,
      [userId, sessionToken, now, now, expiresAt, true]
    );

    const token = result.rows[0].session_token;
    return token;
  } catch (error) {
    console.error('[Session] Create session error:', error);
    throw new Error('Failed to create session');
  }
}

/**
 * Get and validate a session
 * 
 * @param {string} sessionToken - Session token
 * @returns {Promise<Object|null>} Session object with user data, or null if invalid/expired
 */
export async function getSession(sessionToken) {
  if (!sessionToken) {
    return null;
  }

  try {
    const pool = await getPool();
    
    const result = await pool.query(
      `SELECT 
         s.session_token,
         s.user_id,
         s.school_id,
         s.expires_at,
         s.last_activity,
         u.id,
         u.email,
         u.role,
         u.status
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.session_token = $1
       AND s.expires_at > CURRENT_TIMESTAMP
       AND u.status = 'active'
       AND s.is_active = true
       LIMIT 1`,
      [sessionToken]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    
    // CRITICAL: Verify school_id exists
    if (!row.school_id) {
      console.error('[Session] User has no school_id. Session rejected.');
      return null;
    }
    
    return {
      id: row.session_token,
      userId: row.user_id,
      expiresAt: row.expires_at,
      lastActivity: row.last_activity,
      schoolId: row.school_id,
      user: {
        id: row.id,
        email: row.email,
        role: row.role,
        status: row.status,
        school_id: row.school_id,
      },
    };
  } catch (error) {
    console.error('[Session] Get session error:', error);
    return null;
  }
}

/**
 * Delete a session (logout)
 * 
 * @param {string} sessionToken - Session token
 * @returns {Promise<void>}
 */
export async function deleteSession(sessionToken) {
  if (!sessionToken) {
    return;
  }

  try {
    const pool = await getPool();
    
    await pool.query(
      'UPDATE sessions SET is_active = false WHERE session_token = $1',
      [sessionToken]
    );
  } catch (error) {
    console.error('[Session] Delete session error:', error);
    // Non-blocking error - session may already be deleted
  }
}

/**
 * Update session activity timestamp
 * Called on each request to track last activity
 * 
 * @param {string} sessionToken - Session token
 * @returns {Promise<void>}
 */
export async function updateSessionActivity(sessionToken) {
  if (!sessionToken) {
    return;
  }

  try {
    const pool = await getPool();
    
    await pool.query(
      'UPDATE sessions SET last_activity = CURRENT_TIMESTAMP WHERE session_token = $1',
      [sessionToken]
    );
  } catch (error) {
    console.error('[Session] Update activity error:', error);
    // Non-blocking error
  }
}

/**
 * Delete all sessions for a user (logout all devices)
 * 
 * @param {string|number} userId - User ID
 * @returns {Promise<void>}
 */
export async function deleteAllUserSessions(userId) {
  if (!userId) {
    return;
  }

  try {
    const pool = await getPool();
    
    await pool.query(
      'UPDATE sessions SET is_active = false WHERE user_id = $1',
      [userId]
    );
  } catch (error) {
    console.error('[Session] Delete all user sessions error:', error);
    // Non-blocking error
  }
}

/**
 * Get secure cookie options for jeton_session
 * Configured for serverless (Vercel) compatibility
 * 
 * @returns {Object} Cookie options for setting response.cookies.set()
 */
export function getSecureCookieOptions() {
  const isDev = process.env.NODE_ENV === 'development';
  
  return {
    httpOnly: true,
    secure: !isDev, // Secure in production
    sameSite: 'lax', // Cross-site cookie handling
    maxAge: 604800, // 7 days in seconds
    path: '/', // Available site-wide
    // Don't set domain in serverless - let browser handle it
  };
}


