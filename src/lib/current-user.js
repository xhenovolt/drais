/**
 * Current User Utilities (Jeton Compatible)
 * 
 * Server-side utilities for accessing the authenticated user in:
 * - Server components
 * - API routes
 * - Server actions
 */

import { cookies } from 'next/headers.js';
import { getSession } from './session.js';

const SESSION_COOKIE_NAME = 'jeton_session';

/**
 * Get the session ID from cookies
 * 
 * @returns {string|null} Session ID or null
 */
function getSessionId() {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
}

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 * 
 * @returns {Promise<Object|null>} User object or null
 */
export async function getCurrentUser() {
  const sessionId = getSessionId();
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
      role: session.user.role,
      status: session.user.status,
      createdAt: session.user.createdAt,
    };
  } catch (error) {
    console.error('[CurrentUser] Get current user error:', error);
    return null;
  }
}

/**
 * Get current user or throw an error
 * Use when authentication is required
 * 
 * @returns {Promise<Object>} User object
 * @throws {Error} If not authenticated
 */
export async function getCurrentUserOrThrow() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  return user;
}

/**
 * Check if user is authenticated
 * 
 * @returns {Promise<boolean>} True if authenticated
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Check if current user has a specific role
 * 
 * @param {string|string[]} requiredRoles - Single role or array of roles
 * @returns {Promise<boolean>} True if user has role
 */
export async function hasRole(requiredRoles) {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(user.role);
}

/**
 * Require authentication and return user
 * Use in server components that need auth
 * 
 * @returns {Promise<Object>} User object
 * @throws {Error} If not authenticated
 */
export async function requireAuth() {
  return getCurrentUserOrThrow();
}

/**
 * Require specific role and return user
 * Use in server components that need role-based access
 * 
 * @param {string|string[]} requiredRoles - Single role or array of roles
 * @returns {Promise<Object>} User object
 * @throws {Error} If not authenticated or doesn't have role
 */
export async function requireRole(requiredRoles) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  if (!roles.includes(user.role)) {
    throw new Error('Insufficient permissions');
  }

  return user;
}
