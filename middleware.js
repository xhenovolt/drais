/**
 * Next.js Middleware for Route Protection (Jeton Compatible)
 * DRAIS v0.0.0299 - Session-based authentication
 * 
 * IMPORTANT: Middleware only checks for jeton_session cookie existence.
 * Full validation happens in API routes and server components.
 * NO DATABASE QUERIES IN MIDDLEWARE.
 */

import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'jeton_session';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about-xhenvolt',
  '/about',
  '/features',
  '/pricing',
  '/contact',
  '/blog',
  '/docs',
  '/careers',
  '/privacy-policy',
  '/demo',
  '/get-started',
  '/403',
  '/404',
  '/500',
  '/503',
  '/error',
  '/not-found',
];

// Routes accessible to authenticated users (locked or not)
const authenticatedRoutes = [
  '/restricted',
  '/school-setup',
];

// Auth routes (redirect if already logged in)
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

// Protected routes that require jeton_session cookie
const protectedRoutes = [
  '/dashboard',
  '/app',
  '/students',
  '/teachers',
  '/staff',
  '/classes',
  '/subjects',
  '/attendance',
  '/fees',
  '/reports',
  '/analytics',
  '/messaging',
  '/library',
  '/kitchen',
  '/timetable',
  '/settings',
  '/roles',
  '/audit-logs',
  '/security',
  '/operations',
  '/teacher',
  '/ai-teacher',
  '/onboarding',
];

/**
 * Check if route matches pattern
 */
function matchesRoute(pathname, routes) {
  return routes.some(route => {
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1));
    }
    return pathname === route || pathname.startsWith(route + '/');
  });
}

/**
 * Check if jeton_session cookie exists
 * This is the ONLY check middleware performs - no database validation
 */
function hasSessionCookie(request) {
  const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return !!sessionId;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes (API routes handle their own auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if user has jeton_session cookie
  const hasSession = hasSessionCookie(request);

  // Public routes - allow everyone
  if (matchesRoute(pathname, publicRoutes)) {
    return NextResponse.next();
  }

  // Auth routes - redirect to dashboard if already logged in
  if (matchesRoute(pathname, authRoutes)) {
    if (hasSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Authenticated routes (restricted access, school setup) - require jeton_session cookie
  if (matchesRoute(pathname, authenticatedRoutes)) {
    if (!hasSession) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Allow access - locked state is validated client-side
    return NextResponse.next();
  }

  // Protected routes - require jeton_session cookie
  if (matchesRoute(pathname, protectedRoutes)) {
    if (!hasSession) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Allow access - full validation happens in API/server components
    return NextResponse.next();
  }

  // Default: allow access
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
