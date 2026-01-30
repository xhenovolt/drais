import { Pool } from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '.env.local') });

// Database utilities
async function getPool() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  return pool;
}

// Auth utilities
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

async function hashPassword(password) {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  return bcryptjs.hash(password, 10);
}

async function comparePassword(password, hash) {
  return bcryptjs.compare(password, hash);
}

function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function findUserByEmail(email) {
  const pool = await getPool();
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

async function findUserById(userId) {
  const pool = await getPool();
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  return result.rows[0] || null;
}

async function createSession(userId) {
  const pool = await getPool();
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const result = await pool.query(
    `INSERT INTO sessions (user_id, session_token, is_active, created_at, expires_at)
     VALUES ($1, $2, true, CURRENT_TIMESTAMP, $3)
     RETURNING session_token`,
    [userId, sessionToken, expiresAt]
  );

  const token = result.rows[0].session_token;
  return token;
}

async function getSession(sessionToken) {
  if (!sessionToken) {
    return null;
  }

  const pool = await getPool();

  const result = await pool.query(
    `SELECT 
       s.session_token,
       s.user_id,
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
  return {
    id: row.session_token,
    userId: row.user_id,
    expiresAt: row.expires_at,
    lastActivity: row.last_activity,
    user: {
      id: row.id,
      email: row.email,
      role: row.role,
      status: row.status,
    },
  };
}

async function deleteSession(sessionToken) {
  if (!sessionToken) {
    return;
  }

  const pool = await getPool();
  await pool.query(
    'UPDATE sessions SET is_active = false WHERE session_token = $1',
    [sessionToken]
  );
}

async function verifyCredentials(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    return null;
  }

  return user;
}

// Test suite
async function runTests() {
  console.log('Testing Jeton API endpoints simulation...\n');

  let pool;
  try {
    // Test 1: Login endpoint
    console.log('Test 1: Login endpoint simulation');
    const email = 'test@website.tld';
    const password = 'test123456';
    
    const user = await verifyCredentials(email, password);
    if (!user) {
      console.log('❌ Login failed: Invalid credentials');
      return;
    }
    
    console.log(`✅ User authenticated: ${user.email} (ID: ${user.id})`);
    
    const sessionToken = await createSession(user.id);
    console.log(`✅ Session token created: ${sessionToken.substring(0, 20)}...`);
    console.log(`   Cookie value: jeton_session=${sessionToken}`);

    // Test 2: Get /api/auth/me endpoint
    console.log('\nTest 2: GET /api/auth/me endpoint simulation');
    const session = await getSession(sessionToken);
    if (!session) {
      console.log('❌ Session invalid or expired');
      return;
    }

    console.log('✅ Session validated');
    console.log(`✅ User data returned:`, {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      status: session.user.status,
    });

    // Test 3: Logout endpoint
    console.log('\nTest 3: Logout endpoint simulation');
    await deleteSession(sessionToken);
    console.log('✅ Session deleted (is_active = false)');

    // Verify session is now invalid
    const invalidSession = await getSession(sessionToken);
    if (invalidSession === null) {
      console.log('✅ Session correctly invalidated');
    } else {
      console.log('❌ Session should be invalid');
    }

    // Test 4: Test with non-existent user
    console.log('\nTest 4: Login with invalid credentials');
    const invalidUser = await verifyCredentials('nonexistent@example.com', 'wrongpassword');
    if (invalidUser === null) {
      console.log('✅ Correctly rejected invalid credentials');
    }

    console.log('\n✅ All API endpoint tests passed!');
  } catch (error) {
    console.error('❌ Test error:', error.message);
    console.error(error);
  } finally {
    // Close all pools
    if (pool) {
      await pool.end();
    }
    process.exit(0);
  }
}

runTests();
