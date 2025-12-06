/**
 * Database-Agnostic User Service
 * DRAIS v0.0.0042
 * 
 * Supports both MySQL and MongoDB through unified interface
 * Switch database by changing DB_TYPE in .env
 */

import db from '../db/index.js';
import { hashPassword, comparePassword } from '../auth/jwt-enhanced.js';

/**
 * Find user by email
 */
export async function findUserByEmail(email) {
  const dbType = db.getType();

  if (dbType === 'mysql') {
    const rows = await db.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  } else {
    // MongoDB
    return await db.findOne('users', { email });
  }
}

/**
 * Find user by username
 */
export async function findUserByUsername(username) {
  const dbType = db.getType();

  if (dbType === 'mysql') {
    const rows = await db.query(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username]
    );
    return rows[0] || null;
  } else {
    // MongoDB
    return await db.findOne('users', { username });
  }
}

/**
 * Find user by ID
 */
export async function findUserById(id) {
  const dbType = db.getType();

  if (dbType === 'mysql') {
    const rows = await db.query(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  } else {
    // MongoDB
    return await db.findOne('users', { _id: id });
  }
}

/**
 * Create new user
 */
export async function createUser(userData) {
  const { username, email, password, role = 'client', school_id = null, name } = userData;

  // Check if email already exists
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    throw new Error('Email already registered');
  }

  // Check if username already exists
  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    throw new Error('Username already taken');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  const dbType = db.getType();

  if (dbType === 'mysql') {
    const result = await db.insert('users', {
      username,
      email,
      password_hash: hashedPassword,
      school_id: school_id || 1, // Default to school_id 1 if not provided
      role_id: null, // Will be set based on role mapping if needed
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Return created user
    return await findUserById(result.insertId);
  } else {
    // MongoDB
    const result = await db.insert('users', {
      username,
      email,
      password: hashedPassword,
      role,
      school_id,
      name: name || username,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return await findUserById(result.insertedId);
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
