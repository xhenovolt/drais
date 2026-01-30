/**
 * Database-Agnostic User Service
 * DRAIS v0.0.0042
 * 
 * Supports both MySQL, PostgreSQL, and MongoDB through unified interface
 * Switch database by changing PRIMARY_DB in .env
 */

import db from '../db/index.js';
import { hashPassword, comparePassword } from '../auth/jwt-enhanced.js';

// Try to use PostgreSQL-specific auth for server-side rendering
let postgresAuth = null;
try {
  postgresAuth = await import('../auth/postgres-auth.js');
} catch (error) {
  // Fallback to db adapter if not in server context
  console.log('Using database adapter for user queries');
}

/**
 * Find user by email - SAFE IMPLEMENTATION
 */
export async function findUserByEmail(email) {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email address');
  }
  
  try {
    // Use PostgreSQL-specific auth if available
    if (postgresAuth && postgresAuth.findUserByEmail) {
      return await postgresAuth.findUserByEmail(email);
    }
    // Fallback to db adapter
    return await db.findOne('users', { email });
  } catch (error) {
    console.error('Find user by email failed:', error.message);
    throw error;
  }
}

/**
 * Find user by username - SAFE IMPLEMENTATION
 */
export async function findUserByUsername(username) {
  if (!username || typeof username !== 'string') {
    throw new Error('Invalid username');
  }
  
  try {
    // Use PostgreSQL-specific auth if available
    if (postgresAuth && postgresAuth.findUserByUsername) {
      return await postgresAuth.findUserByUsername(username);
    }
    // Fallback to db adapter
    return await db.findOne('users', { username });
  } catch (error) {
    console.error('Find user by username failed:', error.message);
    throw error;
  }
}

/**
 * Find user by ID - SAFE IMPLEMENTATION
 */
export async function findUserById(id) {
  if (!id) {
    throw new Error('Invalid user ID');
  }
  
  try {
    // Use PostgreSQL-specific auth if available
    if (postgresAuth && postgresAuth.findUserById) {
      return await postgresAuth.findUserById(id);
    }
    // Fallback to db adapter
    return await db.findOne('users', { id });
  } catch (error) {
    console.error('Find user by ID failed:', error.message);
    throw error;
  }
}

/**
 * Create new user - SAFE IMPLEMENTATION WITH SCHEMA VALIDATION
 * Aligns with PostgreSQL users table schema and ENUM constraints
 * Valid roles: admin, teacher, student, parent, superadmin
 */
export async function createUser(userData) {
  const { username, email, password, role = 'student', school_id = null, name, person_id = null } = userData;

  // Validate inputs
  if (!username || !email || !password) {
    throw new Error('Username, email, and password are required');
  }

  if (typeof username !== 'string' || username.length < 3) {
    throw new Error('Username must be at least 3 characters');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email address');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  // Validate role against PostgreSQL ENUM constraint
  const validRoles = ['admin', 'teacher', 'student', 'parent', 'superadmin'];
  const normalizedRole = (role || 'student').toLowerCase();
  if (!validRoles.includes(normalizedRole)) {
    throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
  }

  // Check if email already exists (SAFE - uses object-based query)
  try {
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      throw new Error('Email already registered');
    }
  } catch (error) {
    if (error.message === 'Email already registered') throw error;
    console.error('Error checking existing email:', error.message);
    throw new Error('Failed to create user - database error');
  }

  // Check if username already exists (SAFE - uses object-based query)
  try {
    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }
  } catch (error) {
    if (error.message === 'Username already taken') throw error;
    console.error('Error checking existing username:', error.message);
    throw new Error('Failed to create user - database error');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    // Use safe insert method - works across all databases
    // PostgreSQL schema: users(id, school_id, person_id, username, password_hash, role, email, email_verified, two_factor_enabled, last_login, created_at, updated_at)
    const result = await db.insert('users', {
      school_id: school_id || 1,  // Default to school 1
      person_id: person_id || null,  // Optional person reference
      username,
      password_hash: hashedPassword,
      role: normalizedRole,  // Use validated enum value
      email: email.toLowerCase(),  // Normalize email to lowercase
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Return created user
    if (!result.insertId && !result.insertedId) {
      throw new Error('User creation failed - no ID returned');
    }

    const userId = result.insertId || result.insertedId;
    return await findUserById(userId);
  } catch (error) {
    console.error('User creation failed:', error.message);
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

/**
 * Verify user credentials
 */
export async function verifyUserCredentials(emailOrUsername, password) {
  // Try to find by email first, then username
  let user = await findUserByEmail(emailOrUsername);
  if (!user) {
    user = await findUserByUsername(emailOrUsername);
  }

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare password
  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  return user;
}

/**
 * Update user's last login
 */
export async function updateLastLogin(userId) {
  const dbType = db.getType();

  if (dbType === 'mysql') {
    await db.update('users', { last_login: new Date() }, 'id = ?', [userId]);
  } else {
    // MongoDB
    await db.update('users', { last_login: new Date() }, { _id: userId });
  }
}

/**
 * Get user with role information
 */
export async function getUserWithRole(userId) {
  const dbType = db.getType();

  if (dbType === 'mysql') {
    const rows = await db.query(
      `SELECT u.*, r.name as role_name, r.permissions 
       FROM users u 
       LEFT JOIN roles r ON u.role = r.id 
       WHERE u.id = ? LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  } else {
    // MongoDB - simple role lookup
    const user = await db.findOne('users', { _id: userId });
    if (!user) return null;

    const role = await db.findOne('roles', { id: user.role });
    if (role) {
      user.role_name = role.name;
      user.permissions = role.permissions;
    }

    return user;
  }
}

/**
 * Store refresh token (for token rotation)
 */
export async function storeRefreshToken(userId, refreshToken, expiresAt) {
  const dbType = db.getType();

  if (dbType === 'mysql') {
    // Check if refresh_tokens table exists, if not use simple storage
    try {
      await db.insert('refresh_tokens', {
        user_id: userId,
        token: refreshToken,
        expires_at: expiresAt,
        created_at: new Date(),
      });
    } catch (error) {
      // Table might not exist, skip for now
      console.warn('refresh_tokens table not found, skipping storage');
    }
  } else {
    // MongoDB
    try {
      await db.insert('refresh_tokens', {
        user_id: userId,
        token: refreshToken,
        expires_at: expiresAt,
        created_at: new Date(),
      });
    } catch (error) {
      console.warn('Could not store refresh token:', error.message);
    }
  }
}

/**
 * Validate refresh token exists in database
 */
export async function validateRefreshToken(userId, refreshToken) {
  const dbType = db.getType();

  try {
    if (dbType === 'mysql') {
      const rows = await db.query(
        'SELECT * FROM refresh_tokens WHERE user_id = ? AND token = ? AND expires_at > NOW() LIMIT 1',
        [userId, refreshToken]
      );
      return rows[0] || null;
    } else {
      // MongoDB
      return await db.findOne('refresh_tokens', {
        user_id: userId,
        token: refreshToken,
        expires_at: { $gt: new Date() },
      });
    }
  } catch (error) {
    // Table might not exist yet
    return null;
  }
}

/**
 * Invalidate refresh token (logout)
 */
export async function invalidateRefreshToken(refreshToken) {
  const dbType = db.getType();

  try {
    if (dbType === 'mysql') {
      await db.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    } else {
      // MongoDB
      await db.delete('refresh_tokens', { token: refreshToken });
    }
  } catch (error) {
    // Table might not exist, that's okay
    console.warn('Could not invalidate token:', error.message);
  }
}

/**
 * Invalidate all user refresh tokens (logout from all devices)
 */
export async function invalidateAllUserTokens(userId) {
  const dbType = db.getType();

  try {
    if (dbType === 'mysql') {
      await db.query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
    } else {
      // MongoDB
      await db.delete('refresh_tokens', { user_id: userId });
    }
  } catch (error) {
    console.warn('Could not invalidate user tokens:', error.message);
  }
}

/**
 * Clean up expired refresh tokens
 */
export async function cleanExpiredTokens() {
  const dbType = db.getType();

  try {
    if (dbType === 'mysql') {
      await db.query('DELETE FROM refresh_tokens WHERE expires_at < NOW()');
    } else {
      // MongoDB
      await db.delete('refresh_tokens', { expires_at: { $lt: new Date() } });
    }
  } catch (error) {
    console.warn('Could not clean expired tokens:', error.message);
  }
}

/**
 * Blacklist access token (for secure logout)
 * v0.0.0046
 */
export async function blacklistAccessToken(token, expiryTimestamp) {
  const dbType = db.getType();

  try {
    if (dbType === 'mysql') {
      await db.insert('blacklisted_tokens', {
        token,
        expires_at: new Date(expiryTimestamp * 1000),
        blacklisted_at: new Date(),
      });
    } else {
      // MongoDB
      await db.insert('blacklisted_tokens', {
        token,
        expires_at: new Date(expiryTimestamp * 1000),
        blacklisted_at: new Date(),
      });
    }
  } catch (error) {
    console.error('Error blacklisting token:', error);
    throw new Error(`Failed to blacklist token: ${error.message}`);
  }
}

/**
 * Check if token is blacklisted
 * v0.0.0046
 */
export async function isTokenBlacklisted(token) {
  const dbType = db.getType();

  try {
    if (dbType === 'mysql') {
      const rows = await db.query(
        'SELECT * FROM blacklisted_tokens WHERE token = ? AND expires_at > NOW() LIMIT 1',
        [token]
      );
      return rows && rows.length > 0;
    } else {
      // MongoDB
      const result = await db.findOne('blacklisted_tokens', {
        token,
        expires_at: { $gt: new Date() },
      });
      return result !== null;
    }
  } catch (error) {
    // If table doesn't exist, assume not blacklisted
    console.warn('Could not check blacklist:', error.message);
    return false;
  }
}

/**
 * Clean expired blacklisted tokens
 * v0.0.0046
 */
export async function cleanExpiredBlacklistedTokens() {
  const dbType = db.getType();

  try {
    if (dbType === 'mysql') {
      await db.query('DELETE FROM blacklisted_tokens WHERE expires_at < NOW()');
    } else {
      // MongoDB
      await db.delete('blacklisted_tokens', { expires_at: { $lt: new Date() } });
    }
  } catch (error) {
    console.warn('Could not clean blacklisted tokens:', error.message);
  }
}

/**
 * Destroy all active user sessions (for secure logout)
 * v0.0.0046
 */
export async function destroyUserSession(userId) {
  const dbType = db.getType();

  try {
    if (dbType === 'mysql') {
      // Delete from user_sessions table
      await db.query('DELETE FROM user_sessions WHERE user_id = ?', [userId]);
      
      // Also invalidate all refresh tokens
      await invalidateAllUserTokens(userId);
    } else {
      // MongoDB
      await db.delete('user_sessions', { user_id: userId });
      await invalidateAllUserTokens(userId);
    }
  } catch (error) {
    console.warn('Could not destroy user sessions:', error.message);
    // Still try to invalidate refresh tokens even if session deletion fails
    try {
      await invalidateAllUserTokens(userId);
    } catch (innerError) {
      console.error('Failed to invalidate tokens:', innerError);
    }
  }
}

/**
 * Create user session (for session tracking)
 * v0.0.0046
 */
export async function createUserSession(userId, sessionData = {}) {
  const dbType = db.getType();
  const { ip_address, user_agent, device_type } = sessionData;

  try {
    if (dbType === 'mysql') {
      const result = await db.insert('user_sessions', {
        user_id: userId,
        ip_address: ip_address || null,
        user_agent: user_agent || null,
        device_type: device_type || null,
        created_at: new Date(),
        last_activity: new Date(),
      });
      return result.insertId;
    } else {
      // MongoDB
      const result = await db.insert('user_sessions', {
        user_id: userId,
        ip_address: ip_address || null,
        user_agent: user_agent || null,
        device_type: device_type || null,
        created_at: new Date(),
        last_activity: new Date(),
      });
      return result.insertedId;
    }
  } catch (error) {
    console.warn('Could not create session:', error.message);
    return null;
  }
}

/**
 * Update session last activity
 * v0.0.0046
 */
export async function updateSessionActivity(sessionId) {
  const dbType = db.getType();

  try {
    if (dbType === 'mysql') {
      await db.update('user_sessions', { last_activity: new Date() }, 'id = ?', [sessionId]);
    } else {
      // MongoDB
      await db.update('user_sessions', { last_activity: new Date() }, { _id: sessionId });
    }
  } catch (error) {
    console.warn('Could not update session activity:', error.message);
  }
}

/**
 * Get active user sessions
 * v0.0.0046
 */
export async function getUserSessions(userId) {
  const dbType = db.getType();

  try {
    if (dbType === 'mysql') {
      const rows = await db.query(
        `SELECT * FROM user_sessions 
         WHERE user_id = ? AND last_activity > DATE_SUB(NOW(), INTERVAL 24 HOUR)
         ORDER BY last_activity DESC`,
        [userId]
      );
      return rows || [];
    } else {
      // MongoDB
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const result = await db.findAll('user_sessions', {
        user_id: userId,
        last_activity: { $gt: yesterday },
      });
      return result || [];
    }
  } catch (error) {
    console.warn('Could not get user sessions:', error.message);
    return [];
  }
}
