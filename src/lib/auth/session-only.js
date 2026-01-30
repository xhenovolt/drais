/**
 * Session-Based Authentication Helper
 * No JWT - Sessions & Cookies Only
 * 
 * DRAIS v0.0.0051
 */

import db from '../db/index.js';

/**
 * Get user from session cookie
 * Expects a cookie like: sessionUserId=<user_id>
 */
export async function getUserFromSessionCookie(request) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [key, ...v] = c.split('=');
      return [key, decodeURIComponent(v.join('='))];
    })
  );

  const sessionUserId = cookies.sessionUserId;
  if (!sessionUserId) {
    return null;
  }

  // Verify user exists in database
  try {
    const user = await db.findOne('users', { id: parseInt(sessionUserId) });
    return user;
  } catch (error) {
    console.error('Failed to get user from session:', error.message);
    return null;
  }
}

/**
 * Require session authentication (session-only, no JWT)
 */
export async function requireSessionAuth(request) {
  const user = await getUserFromSessionCookie(request);
  
  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

/**
 * Set session cookie
 */
export function setSessionCookie(response, userId) {
  response.cookies.set({
    name: 'sessionUserId',
    value: String(userId),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
  return response;
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(response) {
  response.cookies.set({
    name: 'sessionUserId',
    value: '',
    maxAge: 0,
  });
  return response;
}
