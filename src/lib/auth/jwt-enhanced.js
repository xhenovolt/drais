/**
 * Enhanced JWT Authentication Utilities
 * DRAIS v0.0.0042
 * 
 * Supports:
 * - Access & Refresh tokens
 * - Token rotation
 * - HttpOnly secure cookies
 * - Role-based claims
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '7d';
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generate Access Token (short-lived)
 */
export function generateAccessToken(payload) {
  const { id, email, role, username, school_id } = payload;
  
  return jwt.sign(
    {
      id,
      email,
      username,
      role,
      school_id,
      type: 'access',
    },
    JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );
}

/**
 * Generate Refresh Token (long-lived)
 */
export function generateRefreshToken(payload) {
  const { id, email } = payload;
  
  return jwt.sign(
    {
      id,
      email,
      type: 'refresh',
    },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES }
  );
}

/**
 * Generate both Access and Refresh tokens
 */
export function generateTokens(user) {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    school_id: user.school_id,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

/**
 * Verify Access Token
 */
export function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

/**
 * Verify Refresh Token
 */
export function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

/**
 * Extract token from Authorization header or cookies
 */
export function extractToken(request) {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try cookies (for Next.js)
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(c => {
        const [key, ...v] = c.split('=');
        return [key, v.join('=')];
      })
    );
    return cookies.accessToken || null;
  }

  return null;
}

/**
 * Set secure HttpOnly cookies for tokens
 */
export function setAuthCookies(response, tokens) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  };

  // Access token cookie (15 minutes)
  response.cookies.set('accessToken', tokens.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60, // 15 minutes
  });

  // Refresh token cookie (7 days)
  response.cookies.set('refreshToken', tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return response;
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(response) {
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  return response;
}

/**
 * Middleware: Require Authentication
 * Extract and verify JWT from request
 */
export async function requireAuth(request) {
  const token = extractToken(request);
  
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const decoded = verifyAccessToken(token);
    return decoded; // User payload
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Middleware: Require specific role(s)
 */
export function requireRole(user, allowedRoles) {
  if (!user || !user.role) {
    throw new Error('User role not found');
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  if (!roles.includes(user.role)) {
    throw new Error(`Access denied. Required role: ${roles.join(' or ')}`);
  }

  return true;
}

/**
 * Create session data for response
 */
export function createSessionData(user, tokens) {
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      school_id: user.school_id,
      name: user.name || user.username,
    },
    tokens: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES,
    },
  };
}
