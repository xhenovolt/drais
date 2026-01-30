/**
 * PostgreSQL-specific Authentication Service
 * For Next.js server-side use only
 * Directly handles PostgreSQL authentication
 */

import 'server-only';
import pkg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pkg;

let pgPool = null;

/**
 * Initialize PostgreSQL pool for server-side use
 */
function getOrCreatePool() {
  if (pgPool) {
    return pgPool;
  }

  // Use DATABASE_URL from environment
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  pgPool = new Pool({
    connectionString: databaseUrl,
    // The connection string includes SSL settings
  });

  // Handle pool errors
  pgPool.on('error', (error) => {
    console.error('Unexpected error on idle client in pool:', error);
  });

  return pgPool;
}

/**
 * Find user by username
 */
export async function findUserByUsername(username) {
  const pool = getOrCreatePool();
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 LIMIT 1',
      [username]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by username:', error.message);
    throw new Error('Database error while finding user');
  }
}

/**
 * Find user by email
 */
export async function findUserByEmail(email) {
  const pool = getOrCreatePool();
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by email:', error.message);
    throw new Error('Database error while finding user');
  }
}

/**
 * Find user by ID
 */
export async function findUserById(id) {
  const pool = getOrCreatePool();
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 LIMIT 1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by id:', error.message);
    throw new Error('Database error while finding user');
  }
}

/**
 * Verify user credentials (email/username + password)
 */
export async function verifyUserCredentials(emailOrUsername, password) {
  try {
    // Try email first, then username
    let user = await findUserByEmail(emailOrUsername);
    if (!user) {
      user = await findUserByUsername(emailOrUsername);
    }

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Remove password hash before returning
    delete user.password_hash;
    return user;
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      throw error;
    }
    console.error('Error verifying credentials:', error.message);
    throw new Error('Authentication failed');
  }
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(userId) {
  const pool = getOrCreatePool();
  try {
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
  } catch (error) {
    console.error('Error updating last login:', error.message);
    // Don't throw - this is non-critical
  }
}

/**
 * Store refresh token (if using token-based auth)
 * This is a placeholder for your token storage implementation
 */
export async function storeRefreshToken(userId, refreshToken, expiresAt) {
  // Implement based on your token storage strategy
  // Could be in a tokens table or Redis
  console.log(`Refresh token stored for user ${userId}`);
}

/**
 * Close database pool gracefully
 */
export async function closePool() {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
  }
}

// Close pool on process exit
process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});
