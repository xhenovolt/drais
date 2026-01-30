/**
 * User Login Endpoint - Session-Based
 * POST /api/v2/auth/login
 * 
 * DRAIS v0.0.0050
 * Session-based authentication (replaces JWT)
 * 
 * Supports:
 * - Online onboarding
 * - Offline onboarding
 * - Multi-database (MySQL, PostgreSQL, MongoDB)
 */

import { NextResponse } from 'next/server';
import { verifyUserCredentials, updateLastLogin } from '@/lib/services/user.service';
import { createSession, setSessionCookie } from '@/lib/auth/session';
import { shouldSkipOnboarding } from '@/lib/services/onboarding.middleware';
import { hasActiveAccess } from '@/lib/services/trial.service';
import db from '@/lib/db/index.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    // Validation
    if ((!email && !username) || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email/username and password are required' 
        },
        { status: 400 }
      );
    }

    // Verify credentials
    const user = await verifyUserCredentials(email || username, password);

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid credentials' 
        },
        { status: 401 }
      );
    }

    // Remove password from user object
    delete user.password;
    delete user.password_hash;

    // Update last login
    try {
      await updateLastLogin(user.id);
    } catch (error) {
      console.warn('Failed to update last login:', error.message);
    }

    // Check onboarding status
    let onboardingComplete = false;
    let access = { hasAccess: true }; // Default to true for offline

    try {
      onboardingComplete = await shouldSkipOnboarding(user.id);
      access = await hasActiveAccess(user.id);
    } catch (error) {
      console.warn('Offline mode: Could not check onboarding/access status:', error.message);
      // In offline mode, assume user has completed onboarding and has access
      onboardingComplete = true;
      access.hasAccess = true;
    }

    // Determine redirect URL based on onboarding and access status
    let redirectTo = '/dashboard';
    
    if (!onboardingComplete) {
      redirectTo = '/onboarding/step1';
    } else if (!access.hasAccess) {
      redirectTo = '/payment/select';
    }

    // Create server-side session
    const { sessionId, csrfToken, expiresAt, sessionData } = await createSession(user);

    // Get client IP address
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';

    // Get user agent
    const userAgent = request.headers.get('user-agent') || '';

    // Store IP and user agent in session data
    sessionData.ipAddress = ipAddress;
    sessionData.userAgent = userAgent;

    // Try to update session with IP/UA (database operation, may fail offline)
    try {
      await db.update(
        'sessions',
        {
          ip_address: ipAddress,
          user_agent: userAgent,
        },
        'session_id = ?',
        [sessionId]
      );
    } catch (error) {
      console.warn('Could not update session with IP/UA (offline mode):', error.message);
    }

    // Create response with session cookies
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          schoolId: user.school_id,
          onboardingComplete,
          hasActiveAccess: access.hasAccess,
          redirectTo,
          sessionExpiresAt: expiresAt,
        },
      },
      { status: 200 }
    );

    // Set secure HttpOnly cookies
    return setSessionCookie(response, sessionId, csrfToken);

  } catch (error) {
    console.error('Login error:', error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Login failed. Please try again.' 
      },
      { status: 500 }
    );
  }
}
