/**
 * Registration Endpoint (Jeton Compatible)
 * POST /api/auth/register
 * 
 * Creates new user and automatically logs them in
 * Sets jeton_session HTTP-only cookie
 */

import { NextResponse } from 'next/server';
import { createUser, updateLastLogin } from '@/lib/auth.js';
import { createSession, getSecureCookieOptions } from '@/lib/session.js';

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

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Create user with hashed password
    const user = await createUser(email, password);

    // Auto-login: Create session
    const sessionId = await createSession(user.id);

    // Update last login (non-blocking)
    updateLastLogin(user.id).catch(err => 
      console.error('[Register] Update last login error:', err)
    );

    // Create response with user data (frontend needs this)
    const response = NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
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
      { status: 201 }
    );

    // Set jeton_session HTTP-only cookie
    response.cookies.set(
      'jeton_session',
      sessionId,
      getSecureCookieOptions()
    );

    return response;
  } catch (error) {
    console.error('[Register] Error:', error);

    // Check for specific errors
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
