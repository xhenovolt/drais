/**
 * API Authentication Utilities (Jeton Compatible)
 * 
 * Provides authentication and authorization for API routes
 * Throws errors that should be caught and converted to HTTP responses
 */

import { cookies } from 'next/headers.js';
import { getSession } from './session.js';

const SESSION_COOKIE_NAME = 'jeton_session';

/**
 * Get session ID from cookies
 * 
 * @param {NextRequest} request - Next.js request object
 * @returns {string|null} Session ID or null
 */
function getSessionIdFromRequest(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = cookieHeader.split(';').map(c => c.trim());
    
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === SESSION_COOKIE_NAME) {
        return decodeURIComponent(value);
      }
    }
  } catch (error) {
    console.error('[ApiAuth] Parse cookie error:', error);
  }
  
  return null;
}

/**
 * Get session ID from Next.js cookies()
 * For use in Route Handlers
 * 
 * @returns {Promise<string|null>} Session ID or null
 */
async function getSessionIdFromCookies() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
  } catch (error) {
    console.error('[ApiAuth] Get cookie error:', error);
    return null;
  }
}

/**
 * Get authenticated user in API route (returns null if not auth)
 * 
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<Object|null>} User object or null
 */
export async function getApiAuthUser(request) {
  const sessionId = getSessionIdFromRequest(request);
  if (!sessionId) {
    return null;
  }

  try {
    const session = await getSession(sessionId);
    if (!session) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role || 'client',
      username: session.user.username,
      school_id: session.user.school_id,
    };
  } catch (error) {
    console.error('[ApiAuth] Get auth user error:', error);
    return null;
  }
}

/**
 * Require authentication in API route
 * Throws 401 error if not authenticated
 * 
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<Object>} User object
 * @throws {Error} With status: 401
 */
export async function requireApiAuth(request) {
  const user = await getApiAuthUser(request);
  if (!user) {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }
  return user;
}

/**
 * Require specific role in API route
 * Throws 401 if not authenticated, 403 if insufficient role
 * 
 * @param {NextRequest} request - Next.js request object
 * @param {string|string[]} requiredRoles - Single role or array of roles
 * @returns {Promise<Object>} User object
 * @throws {Error} With status: 401 or 403
 */
export async function requireApiRole(request, requiredRoles) {
  const user = await getApiAuthUser(request);
  if (!user) {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  if (!roles.includes(user.role)) {
    const error = new Error('Forbidden');
    error.status = 403;
    throw error;
  }

  return user;
}

/**
 * For use in Route Handlers: Get auth user from cookies()
 * 
 * @returns {Promise<Object|null>} User object or null
 */
export async function getApiAuthUserFromCookies() {
  const sessionId = await getSessionIdFromCookies();
  if (!sessionId) {
    return null;
  }

  try {
    const session = await getSession(sessionId);
    if (!session) {
      return null;
    }

    // CRITICAL: Verify school_id is present
    if (!session.schoolId) {
      console.error('[ApiAuth] Session missing school_id');
      return null;
    }

    return {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      schoolId: session.schoolId,
    };
  } catch (error) {
    console.error('[ApiAuth] Get auth user from cookies error:', error);
    return null;
  }
}

/**
 * For use in Route Handlers: Require auth from cookies()
 * Throws 401 if not authenticated, 403 if user has no school
 * 
 * @returns {Promise<Object>} User object with { userId, email, role, schoolId }
 * @throws {Error} With status: 401 or 403
 */
export async function requireApiAuthFromCookies() {
  const user = await getApiAuthUserFromCookies();
  if (!user) {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }
  
  // CRITICAL: Verify user has school context
  if (!user.schoolId) {
    const error = new Error('School context not configured. Please complete school setup.');
    error.status = 403;
    throw error;
  }
  
  return user;
}

/**
 * For use in Route Handlers: Require role from cookies()
 * Throws 401 if not authenticated, 403 if insufficient role
 * 
 * @param {string|string[]} requiredRoles - Single role or array of roles
 * @returns {Promise<Object>} User object
 * @throws {Error} With status: 401 or 403
 */
export async function requireApiRoleFromCookies(requiredRoles) {
  const user = await getApiAuthUserFromCookies();
  if (!user) {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  if (!roles.includes(user.role)) {
    const error = new Error('Forbidden');
    error.status = 403;
    throw error;
  }

  return user;
}
