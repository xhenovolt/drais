/**
 * Login Endpoint (Jeton Compatible)
 * POST /api/auth/login
 * 
 * Authenticates user and creates session
 * Sets jeton_session HTTP-only cookie
 * Returns ONLY message, no user data
 */

import { NextResponse } from 'next/server';
import { verifyCredentials } from '@/lib/auth.js';
import { createSession, getSecureCookieOptions } from '@/lib/session.js';
import { updateLastLogin } from '@/lib/auth.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email and password must be strings' },
        { status: 400 }
      );
    }

    // Verify credentials (finds user and compares password)
    const user = await verifyCredentials(email, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session in database
    const sessionId = await createSession(user.id);

    // Update last login (non-blocking)
    updateLastLogin(user.id).catch(err => 
      console.error('[Login] Update last login error:', err)
    );

    // Create response with user data (frontend needs this)
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
          },
        },
        redirectTo: '/dashboard',
      },
      { status: 200 }
    );

    // Set jeton_session HTTP-only cookie
    response.cookies.set(
      'jeton_session',
      sessionId,
      getSecureCookieOptions()
    );

    return response;
  } catch (error) {
    console.error('[Login] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

