/**
 * =====================================================================
 * DRAIS Session Authentication System v2.0.0
 * =====================================================================
 * Complete PostgreSQL-backed session management with:
 * - Flexible authentication (email/phone/username auto-detection)
 * - Multi-device session tracking
 * - CSRF protection
 * - Session fixation prevention
 * - Cloudinary image upload support
 * - No JWT dependency
 * =====================================================================
 */

import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

let pool = null;

// =====================================================================
// DATABASE CONNECTION
// =====================================================================

export async function initPostgres() {
  try {
    const connectionString =
      process.env.DATABASE_URL ||
      (process.env.POSTGRES_HOST &&
        `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`) ||
      'postgresql://postgres:postgres@localhost:5432/drais';

    pool = new Pool({
      connectionString,
      max: parseInt(process.env.POSTGRES_POOL_MAX || '20'),
      idleTimeoutMillis: parseInt(process.env.POSTGRES_IDLE_TIMEOUT || '30000'),
      connectionTimeoutMillis: parseInt(process.env.POSTGRES_CONNECTION_TIMEOUT || '2000'),
      application_name: 'DRAIS_APP',
    });

    const client = await pool.connect();
    console.log('✅ PostgreSQL connection established');
    client.release();
    return pool;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    throw error;
  }
}

// =====================================================================
// CREDENTIAL GENERATION
// =====================================================================

export function generateSessionCredentials() {
  const sessionId = crypto.randomBytes(64).toString('hex');
  const secureToken = crypto.randomBytes(32).toString('hex');
  const csrfToken = crypto.randomBytes(32).toString('hex');
  return { sessionId, secureToken, csrfToken };
}

// =====================================================================
// PASSWORD OPERATIONS
// =====================================================================

export async function hashPassword(password) {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// =====================================================================
// AUTHENTICATION (FLEXIBLE: EMAIL/PHONE/USERNAME)
// =====================================================================

function detectIdentifierType(identifier) {
  if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(identifier)) {
    return 'email';
  }
  if (/^\+?[1-9]\d{1,14}$/.test(identifier.replace(/[\s()-]/g, ''))) {
    return 'phone';
  }
  return 'username';
}

export async function verifyCredentials(identifier, password, schoolId) {
  if (!pool) throw new Error('Database not initialized');

  try {
    const identifierType = detectIdentifierType(identifier);
    let query;
    let params;

    switch (identifierType) {
      case 'email':
        query = `SELECT id, school_id, email, password_hash, account_status, first_name, last_name, username, phone, role_id, is_super_admin FROM users WHERE school_id = $1 AND email = $2 AND deleted_at IS NULL LIMIT 1`;
        params = [schoolId, identifier.toLowerCase()];
        break;
      case 'phone':
        query = `SELECT id, school_id, email, password_hash, account_status, first_name, last_name, username, phone, role_id, is_super_admin FROM users WHERE school_id = $1 AND phone = $2 AND deleted_at IS NULL LIMIT 1`;
        params = [schoolId, identifier];
        break;
      default:
        query = `SELECT id, school_id, email, password_hash, account_status, first_name, last_name, username, phone, role_id, is_super_admin FROM users WHERE school_id = $1 AND username = $2 AND deleted_at IS NULL LIMIT 1`;
        params = [schoolId, identifier.toLowerCase()];
    }

    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      await recordFailedLoginAttempt(identifier, null, null, schoolId);
      return null;
    }

    const user = result.rows[0];

    if (user.account_status !== 'active') {
      await recordFailedLoginAttempt(identifier, null, null, schoolId, `Account ${user.account_status}`);
      return null;
    }

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      await recordFailedLoginAttempt(identifier, null, null, schoolId, 'Account locked');
      return null;
    }

    const passwordValid = await verifyPassword(password, user.password_hash);
    if (!passwordValid) {
      await pool.query(`UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1`, [user.id]);
      if (user.failed_login_attempts >= 4) {
        const lockUntil = new Date(Date.now() + 30 * 60 * 1000);
        await pool.query(`UPDATE users SET locked_until = $1 WHERE id = $2`, [lockUntil, user.id]);
        await recordSecurityEvent(user.school_id, user.id, 'account_locked', 'critical', 'Account locked due to failed login attempts');
      }
      await recordFailedLoginAttempt(identifier, null, null, schoolId, 'Invalid password');
      return null;
    }

    await pool.query(`UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1`, [user.id]);
    return user;
  } catch (error) {
    console.error('Error verifying credentials:', error);
    throw error;
  }
}

// =====================================================================
// SESSION MANAGEMENT
// =====================================================================

export async function createSession(userId, schoolId, options = {}) {
  if (!pool) throw new Error('Database not initialized');

  try {
    const { ipAddress = null, userAgent = null, deviceType = 'web', deviceName = null, deviceOs = null, deviceBrowser = null, rememberMe = false } = options;
    const { sessionId, secureToken, csrfToken } = generateSessionCredentials();
    const sessionTimeout = rememberMe ? 30 * 24 * 60 * 60 * 1000 : parseInt(process.env.SESSION_TIMEOUT || '86400000');
    const expiresAt = new Date(Date.now() + sessionTimeout);

    const result = await pool.query(
      `INSERT INTO sessions (id, user_id, school_id, secure_token, device_type, device_name, device_os, device_browser, ip_address, user_agent, authenticated, is_active, session_type, expires_at, csrf_token, csrf_token_created_at, created_at, last_activity_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`,
      [sessionId, userId, schoolId, secureToken, deviceType, deviceName, deviceOs, deviceBrowser, ipAddress, userAgent, true, true, rememberMe ? 'remember_me' : 'standard', expiresAt, csrfToken, new Date(), new Date(), new Date()]
    );

    await recordSessionActivity(sessionId, userId, schoolId, 'login', 'success', null, ipAddress);
    await pool.query(`UPDATE users SET last_login_at = $1, last_activity_at = $2 WHERE id = $3`, [new Date(), new Date(), userId]);

    return { sessionId, secureToken, csrfToken, expiresAt, sessionData: result.rows[0] };
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

export async function validateSession(sessionId, secureToken, schoolId = null) {
  if (!pool) throw new Error('Database not initialized');

  try {
    const result = await pool.query(
      `SELECT s.*, u.id as user_id, u.email, u.username, u.phone, u.first_name, u.last_name, u.role_id, u.is_super_admin, u.account_status, u.school_id FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = $1 AND s.secure_token = $2 LIMIT 1`,
      [sessionId, secureToken]
    );

    if (result.rows.length === 0) return null;

    const session = result.rows[0];

    if (new Date(session.expires_at) < new Date()) {
      await pool.query(`UPDATE sessions SET authenticated = false, is_active = false WHERE id = $1`, [sessionId]);
      return null;
    }

    if (!session.is_active || !session.authenticated) return null;
    if (session.account_status !== 'active') {
      await invalidateSession(sessionId, `User account is ${session.account_status}`);
      return null;
    }

    if (schoolId && session.school_id !== schoolId) return null;

    await pool.query(`UPDATE sessions SET last_activity_at = $1 WHERE id = $2`, [new Date(), sessionId]);
    await pool.query(`UPDATE users SET last_activity_at = $1 WHERE id = $2`, [new Date(), session.user_id]);

    return session;
  } catch (error) {
    console.error('Error validating session:', error);
    throw error;
  }
}

export async function invalidateSession(sessionId, reason = 'User logout') {
  if (!pool) throw new Error('Database not initialized');

  try {
    const sessionResult = await pool.query(`SELECT user_id, school_id FROM sessions WHERE id = $1`, [sessionId]);

    if (sessionResult.rows.length > 0) {
      const { user_id: userId, school_id: schoolId } = sessionResult.rows[0];
      await pool.query(`UPDATE sessions SET authenticated = false, is_active = false WHERE id = $1`, [sessionId]);
      await recordSessionActivity(sessionId, userId, schoolId, 'logout', 'success', reason);
    }

    return true;
  } catch (error) {
    console.error('Error invalidating session:', error);
    throw error;
  }
}

export async function getUserActiveSessions(userId) {
  if (!pool) throw new Error('Database not initialized');

  try {
    const result = await pool.query(
      `SELECT id, device_type, device_name, ip_address, created_at, last_activity_at, expires_at, (expires_at > NOW()) as is_valid FROM sessions WHERE user_id = $1 AND is_active = true AND authenticated = true ORDER BY last_activity_at DESC`,
      [userId]
    );

    return result.rows;
  } catch (error) {
    console.error('Error getting user sessions:', error);
    throw error;
  }
}

export async function invalidateAllUserSessions(userId, reason = 'Logout from all devices') {
  if (!pool) throw new Error('Database not initialized');

  try {
    const result = await pool.query(
      `UPDATE sessions SET authenticated = false, is_active = false WHERE user_id = $1 AND is_active = true RETURNING id, school_id`,
      [userId]
    );

    for (const session of result.rows) {
      await recordSessionActivity(session.id, userId, session.school_id, 'logout', 'success', reason);
    }

    return result.rows;
  } catch (error) {
    console.error('Error invalidating all sessions:', error);
    throw error;
  }
}

export async function cleanupExpiredSessions() {
  if (!pool) throw new Error('Database not initialized');

  try {
    const result = await pool.query(`DELETE FROM sessions WHERE expires_at < NOW() RETURNING id`);
    console.log(`🧹 Cleaned up ${result.rows.length} expired sessions`);
    return result.rows.length;
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
    throw error;
  }
}

// =====================================================================
// CSRF PROTECTION
// =====================================================================

export async function generateCSRFToken(sessionId) {
  if (!pool) throw new Error('Database not initialized');

  try {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    await pool.query(`UPDATE sessions SET csrf_token = $1, csrf_token_created_at = NOW() WHERE id = $2`, [csrfToken, sessionId]);
    return csrfToken;
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    throw error;
  }
}

export async function validateCSRFToken(sessionId, csrfToken) {
  if (!pool) throw new Error('Database not initialized');

  try {
    const result = await pool.query(`SELECT csrf_token, csrf_token_created_at FROM sessions WHERE id = $1`, [sessionId]);

    if (result.rows.length === 0) return false;

    const session = result.rows[0];

    if (session.csrf_token !== csrfToken) return false;

    const tokenAge = Date.now() - new Date(session.csrf_token_created_at).getTime();
    if (tokenAge > 60 * 60 * 1000) {
      await generateCSRFToken(sessionId);
    }

    return true;
  } catch (error) {
    console.error('Error validating CSRF token:', error);
    return false;
  }
}

// =====================================================================
// USER MANAGEMENT
// =====================================================================

export async function createUser(schoolId, userData) {
  if (!pool) throw new Error('Database not initialized');

  try {
    const { email = null, phone = null, username, password, firstName, lastName, roleId = null, isSuperAdmin = false, temporaryPassword = null } = userData;

    if (!email && !phone) throw new Error('Either email or phone must be provided');

    const passwordHash = await hashPassword(password);
    const tempPasswordHash = temporaryPassword ? await hashPassword(temporaryPassword) : null;

    const result = await pool.query(
      `INSERT INTO users (school_id, email, phone, username, password_hash, first_name, last_name, role_id, is_super_admin, temporary_password_hash, must_change_password, account_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id, school_id, email, phone, username, first_name, last_name, role_id, is_super_admin, account_status`,
      [schoolId, email ? email.toLowerCase() : null, phone, username.toLowerCase(), passwordHash, firstName, lastName, roleId, isSuperAdmin, tempPasswordHash, !!temporaryPassword, 'active']
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUserProfile(userId, schoolId, updates) {
  if (!pool) throw new Error('Database not initialized');

  try {
    const { firstName, lastName, nickname, bio, profilePhotoUrl = null, profilePhotoCloudinaryId = null, coverPhotoUrl = null, coverPhotoCloudinaryId = null, timezone, language, theme } = updates;

    const result = await pool.query(
      `UPDATE users SET first_name = COALESCE($2, first_name), last_name = COALESCE($3, last_name), nickname = COALESCE($4, nickname), bio = COALESCE($5, bio), profile_photo_url = COALESCE($6, profile_photo_url), profile_photo_cloudinary_id = COALESCE($7, profile_photo_cloudinary_id), cover_photo_url = COALESCE($8, cover_photo_url), cover_photo_cloudinary_id = COALESCE($9, cover_photo_cloudinary_id), timezone = COALESCE($10, timezone), language = COALESCE($11, language), theme = COALESCE($12, theme), updated_at = NOW() WHERE id = $1 AND school_id = $13 RETURNING *`,
      [userId, firstName, lastName, nickname, bio, profilePhotoUrl, profilePhotoCloudinaryId, coverPhotoUrl, coverPhotoCloudinaryId, timezone, language, theme, schoolId]
    );

    if (result.rows.length === 0) throw new Error('User not found');

    return result.rows[0];
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function changePassword(userId, schoolId, oldPassword, newPassword) {
  if (!pool) throw new Error('Database not initialized');

  try {
    const result = await pool.query(`SELECT password_hash FROM users WHERE id = $1 AND school_id = $2`, [userId, schoolId]);

    if (result.rows.length === 0) throw new Error('User not found');

    const passwordValid = await verifyPassword(oldPassword, result.rows[0].password_hash);
    if (!passwordValid) throw new Error('Current password is incorrect');

    const newPasswordHash = await hashPassword(newPassword);
    await pool.query(`UPDATE users SET password_hash = $1, password_changed_at = NOW(), must_change_password = FALSE, updated_at = NOW() WHERE id = $2`, [newPasswordHash, userId]);
    await invalidateAllUserSessions(userId, 'Password changed');

    return true;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}

export async function suspendUser(userId, reason = 'Account suspended') {
  if (!pool) throw new Error('Database not initialized');

  try {
    await pool.query(`UPDATE users SET account_status = 'suspended', updated_at = NOW() WHERE id = $1`, [userId]);

    const userResult = await pool.query(`SELECT school_id FROM users WHERE id = $1`, [userId]);
    const schoolId = userResult.rows[0].school_id;

    await invalidateAllUserSessions(userId, reason);
    await recordSecurityEvent(schoolId, userId, 'account_suspended', 'warning', reason);

    return true;
  } catch (error) {
    console.error('Error suspending user:', error);
    throw error;
  }
}

export async function reactivateUser(userId) {
  if (!pool) throw new Error('Database not initialized');

  try {
    await pool.query(`UPDATE users SET account_status = 'active', updated_at = NOW() WHERE id = $1`, [userId]);
    return true;
  } catch (error) {
    console.error('Error reactivating user:', error);
    throw error;
  }
}

export async function getUserById(userId, schoolId) {
  if (!pool) throw new Error('Database not initialized');

  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1 AND school_id = $2 AND deleted_at IS NULL`, [userId, schoolId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

// =====================================================================
// SECURITY EVENT LOGGING
// =====================================================================

export async function recordFailedLoginAttempt(identifier, ipAddress, userAgent, schoolId, reason = 'Invalid credentials') {
  if (!pool) throw new Error('Database not initialized');

  try {
    await pool.query(`INSERT INTO security_events (school_id, event_type, severity, ip_address, user_agent, description) VALUES ($1, $2, $3, $4, $5, $6)`, [schoolId, 'failed_login', 'warning', ipAddress, userAgent, `Failed login attempt for identifier: ${identifier}. Reason: ${reason}`]);
  } catch (error) {
    console.error('Error recording failed login:', error);
  }
}

export async function recordSecurityEvent(schoolId, userId, eventType, severity, description, metadata = {}) {
  if (!pool) throw new Error('Database not initialized');

  try {
    await pool.query(`INSERT INTO security_events (school_id, user_id, event_type, severity, description, metadata) VALUES ($1, $2, $3, $4, $5, $6)`, [schoolId, userId, eventType, severity, description, JSON.stringify(metadata)]);
  } catch (error) {
    console.error('Error recording security event:', error);
  }
}

export async function recordSessionActivity(sessionId, userId, schoolId, activityType, status, reason = null, ipAddress = null, deviceInfo = {}) {
  if (!pool) throw new Error('Database not initialized');

  try {
    await pool.query(`INSERT INTO session_activity (session_id, user_id, school_id, activity_type, status, reason, ip_address, device_info) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [sessionId, userId, schoolId, activityType, status, reason, ipAddress, JSON.stringify(deviceInfo)]);
  } catch (error) {
    console.error('Error recording session activity:', error);
  }
}

// =====================================================================
// UTILITY FUNCTIONS
// =====================================================================

export function getPool() {
  return pool;
}

export function extractSessionFromCookies(cookies) {
  const sessionId = cookies.get?.('session_id')?.value || cookies['session_id'];
  const sessionToken = cookies.get?.('session_token')?.value || cookies['session_token'];
  return { sessionId, sessionToken };
}

export function getClientIpAddress(request) {
  const forwardedFor = request.headers?.get?.('x-forwarded-for');
  const realIp = request.headers?.get?.('x-real-ip');

  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  if (realIp) return realIp;

  return request.ip || '127.0.0.1';
}

export function detectDeviceType(userAgent = '') {
  if (!userAgent) return 'unknown';
  if (/mobile|android|iPhone|iPad/i.test(userAgent)) {
    return /iPad/i.test(userAgent) ? 'tablet' : 'mobile';
  }
  return 'web';
}

// =====================================================================
// HELPER FUNCTIONS FOR v2 ROUTES
// =====================================================================

export async function getSessionFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = {};
  
  cookieHeader.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  });

  const { sessionId, sessionToken } = extractSessionFromCookies(cookies);
  
  if (!sessionId) {
    return null;
  }

  try {
    const session = await validateSession(sessionId, sessionToken);
    return session;
  } catch (error) {
    return null;
  }
}

export async function destroySession(sessionId) {
  return await invalidateSession(sessionId, 'User logout');
}

export function clearSessionCookies(response) {
  response.cookies.set('session_id', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  
  response.cookies.set('session_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  
  return response;
}

export function setSessionCookie(response, sessionId, options = {}) {
  const maxAge = options.stayLoggedIn ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day
  
  response.cookies.set('session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
    path: '/',
  });
  
  return response;
}

export default {
  initPostgres,
  generateSessionCredentials,
  hashPassword,
  verifyPassword,
  verifyCredentials,
  createSession,
  validateSession,
  invalidateSession,
  getUserActiveSessions,
  invalidateAllUserSessions,
  cleanupExpiredSessions,
  generateCSRFToken,
  validateCSRFToken,
  createUser,
  updateUserProfile,
  changePassword,
  suspendUser,
  reactivateUser,
  getUserById,
  recordFailedLoginAttempt,
  recordSecurityEvent,
  recordSessionActivity,
  getPool,
  extractSessionFromCookies,
  getSessionFromRequest,
  destroySession,
  clearSessionCookies,
  setSessionCookie,
  getClientIpAddress,
  detectDeviceType,
};
