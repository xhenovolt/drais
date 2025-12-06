/**
 * Next.js Middleware for Route Protection
 * DRAIS v0.0.0042
 * 
 * Protects pages based on authentication status and user roles
 */

import { NextResponse } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about-xhenvolt',
  '/features',
  '/pricing',
  '/contact',
  '/blog',
  '/docs',
  '/careers',
  '/privacy-policy',
  '/demo',
  '/get-started',
];

// Auth routes (redirect if already logged in)
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

// Role-based route protection
const roleProtectedRoutes = {
  admin: [
    '/settings',
    '/roles',
    '/audit-logs',
    '/security',
    '/operations/dashboard',
  ],
  teacher: [
    '/teacher',
    '/ai-teacher',
  ],
  staff: [
    '/staff',
    '/attendance',
  ],
};

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
 * Verify JWT token from cookies
 */
function verifyToken(token) {
  if (!token) return null;

  try {
    // Simple base64 decode to get payload (for role checking)
    // In production, you'd verify signature on server
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8')
    );

    // Check if expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes (API routes have their own auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next();
  }

  // Get access token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const user = verifyToken(accessToken);
  const isAuthenticated = !!user;

  // Public routes - allow everyone
  if (matchesRoute(pathname, publicRoutes)) {
    return NextResponse.next();
  }

  // Auth routes - redirect to dashboard if already logged in
  if (matchesRoute(pathname, authRoutes)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based protection
  const userRole = user?.role;

  // Check admin routes
  if (matchesRoute(pathname, roleProtectedRoutes.admin)) {
    const allowedRoles = ['super_admin', 'admin', 'school_admin'];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/403', request.url));
    }
  }

  // Check teacher routes
  if (matchesRoute(pathname, roleProtectedRoutes.teacher)) {
    const allowedRoles = ['super_admin', 'admin', 'school_admin', 'teacher'];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/403', request.url));
    }
  }

  // Check staff routes
  if (matchesRoute(pathname, roleProtectedRoutes.staff)) {
    const allowedRoles = ['super_admin', 'admin', 'school_admin', 'teacher', 'staff'];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/403', request.url));
    }
  }

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
