/**
 * Registration Endpoint (Serverless-Safe)
 * POST /api/auth/register
 * 
 * Creates new user and automatically logs them in
 * Sets jeton_session HTTP-only cookie
 * 
 * Optimized for serverless with:
 * - Timeout handling
 * - Parallel operations
 * - Proper error responses
 */

import { NextResponse } from 'next/server';
import { createUser, updateLastLogin } from '@/lib/auth.js';
import { createSession, getSecureCookieOptions } from '@/lib/session.js';

// 30 second timeout for the entire request
const REQUEST_TIMEOUT = 30000;

export async function POST(request) {
  const requestStart = Date.now();
  
  try {
    // Parse body with timeout
    const body = await Promise.race([
      request.json(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout: body parsing')), REQUEST_TIMEOUT)
      )
    ]);

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

    if (email.length > 255) {
      return NextResponse.json(
        { error: 'Email is too long' },
        { status: 400 }
      );
    }

    // Check timeout
    if (Date.now() - requestStart > REQUEST_TIMEOUT * 0.8) {
      return NextResponse.json(
        { error: 'Request processing timeout' },
        { status: 504 }
      );
    }

    // Create user with hashed password
    const user = await Promise.race([
      createUser(email, password),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('User creation timeout')), REQUEST_TIMEOUT * 0.5)
      )
    ]);

    // Check timeout
    if (Date.now() - requestStart > REQUEST_TIMEOUT * 0.8) {
      return NextResponse.json(
        { error: 'Request processing timeout' },
        { status: 504 }
      );
    }

    // Auto-login: Create session
    const sessionId = await Promise.race([
      createSession(user.id),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Session creation timeout')), REQUEST_TIMEOUT * 0.5)
      )
    ]);

    // Update last login (non-blocking, fire and forget)
    updateLastLogin(user.id).catch(err => 
      console.error('[Register] Update last login error:', err)
    );

    // Create response with user data
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
        redirectTo: '/onboarding/step1',
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

    // Handle specific errors
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    if (error.message.includes('timeout')) {
      return NextResponse.json(
        { error: 'Request timeout - please try again' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed - please try again' },
      { status: 500 }
    );
  }
}
