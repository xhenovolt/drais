/**
 * Authentication Middleware
 * 
 * Validates session on every request
 * Protects routes requiring authentication
 * Handles session expiry and cleanup
 */

import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth/session.service';

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/login',
  '/register',
  '/forgot-password',
  '/',
];

/**
 * Middleware function to run on every request
 */
export async function authMiddleware(request) {
  const { pathname } = request.nextUrl;

  // Skip auth check for public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get session ID from cookie
  const sessionId = request.cookies.get('sessionId')?.value;

  if (!sessionId) {
    // No session - redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Validate session
  const session = await validateSession(sessionId);

  if (!session) {
    // Invalid or expired session - redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    
    // Clear the invalid session cookie
    response.cookies.set('sessionId', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;
  }

  // Session is valid - attach user info to request headers for downstream routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', session.userId.toString());
  requestHeaders.set('x-user-role', session.role);
  requestHeaders.set('x-school-id', session.schoolId?.toString() || '');
  requestHeaders.set('x-user-name', session.username);

  // Continue to next middleware/route
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Check if a request is authenticated
 */
export async function isAuthenticated(request) {
  const sessionId = request.cookies.get('sessionId')?.value;
  if (!sessionId) return null;

  const session = await validateSession(sessionId);
  return session;
}

/**
 * Check if user has required role
 */
export function hasRole(session, requiredRole) {
  if (!session) return false;

  // Superadmin has access to everything
  if (session.role === 'superadmin') {
    return true;
  }

  return session.role === requiredRole;
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(session, requiredRoles) {
  if (!session) return false;

  // Superadmin has access to everything
  if (session.role === 'superadmin') {
    return true;
  }

  return requiredRoles.includes(session.role);
}

export default authMiddleware;
