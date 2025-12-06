/**
 * Role-Based Access Control Middleware
 * DRAIS v0.0.0042
 * 
 * Easy-to-use middleware for protecting API routes
 */

import { NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth/jwt-enhanced';

/**
 * Protect route with authentication
 * Usage: const user = await withAuth(request);
 */
export async function withAuth(request) {
  try {
    const user = await requireAuth(request);
    return user;
  } catch (error) {
    throw new Error('Authentication required');
  }
}

/**
 * Protect route with role-based access
 * Usage: const user = await withRole(request, ['admin', 'teacher']);
 */
export async function withRole(request, allowedRoles) {
  try {
    const user = await requireAuth(request);
    requireRole(user, allowedRoles);
    return user;
  } catch (error) {
    if (error.message.includes('Access denied')) {
      throw new Error('Insufficient permissions');
    }
    throw new Error('Authentication required');
  }
}

/**
 * Higher-order function to wrap API routes with auth
 * 
 * Example usage:
 * 
 * export const GET = authMiddleware(async (request, user) => {
 *   // user is automatically injected
 *   return NextResponse.json({ user });
 * });
 */
export function authMiddleware(handler, options = {}) {
  return async (request, context) => {
    try {
      const user = await requireAuth(request);

      // Check role if specified
      if (options.roles) {
        requireRole(user, options.roles);
      }

      // Inject user into request (for handler access)
      request.user = user;

      // Call the actual handler
      return await handler(request, context, user);
    } catch (error) {
      if (error.message.includes('Access denied') || error.message.includes('Insufficient permissions')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 403 } // Forbidden
        );
      }

      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 } // Unauthorized
      );
    }
  };
}

/**
 * Role-specific middleware generators
 */

// Admin only
export function adminOnly(handler) {
  return authMiddleware(handler, { roles: ['super_admin', 'admin', 'school_admin'] });
}

// Teacher and above
export function teacherOnly(handler) {
  return authMiddleware(handler, { roles: ['super_admin', 'admin', 'school_admin', 'teacher'] });
}

// Staff and above
export function staffOnly(handler) {
  return authMiddleware(handler, { roles: ['super_admin', 'admin', 'school_admin', 'teacher', 'staff'] });
}

// Any authenticated user
export function authenticated(handler) {
  return authMiddleware(handler);
}

/**
 * Example Usage:
 * 
 * // Protect with any authentication
 * export const GET = authenticated(async (request, context, user) => {
 *   return NextResponse.json({ message: `Hello ${user.username}` });
 * });
 * 
 * // Admin only
 * export const DELETE = adminOnly(async (request, context, user) => {
 *   // Only admins can access this
 *   return NextResponse.json({ message: 'Deleted' });
 * });
 * 
 * // Teacher and above
 * export const POST = teacherOnly(async (request, context, user) => {
 *   // Teachers, admins, and school_admins can access
 *   return NextResponse.json({ message: 'Created' });
 * });
 * 
 * // Custom roles
 * export const PUT = authMiddleware(
 *   async (request, context, user) => {
 *     return NextResponse.json({ message: 'Updated' });
 *   },
 *   { roles: ['admin', 'teacher'] }
 * );
 */
