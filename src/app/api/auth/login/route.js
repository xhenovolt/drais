/**
 * User Login Endpoint
 * POST /api/auth/login
 * 
 * DRAIS v0.0.0042 - Enhanced with Access/Refresh tokens
 */

import { NextResponse } from 'next/server';
import { verifyUserCredentials, updateLastLogin, storeRefreshToken } from '@/lib/services/user.service';
import { generateTokens, setAuthCookies, createSessionData } from '@/lib/auth/jwt-enhanced';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    // Validation
    if ((!email && !username) || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    // Verify credentials
    const user = await verifyUserCredentials(email || username, password);

    // Remove password from user object
    delete user.password;

    // Update last login
    await updateLastLogin(user.id);

    // Generate tokens
    const tokens = generateTokens(user);

    // Store refresh token (with 7 day expiry)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await storeRefreshToken(user.id, tokens.refreshToken, expiresAt);

    // Create session data
    const sessionData = createSessionData(user, tokens);

    // Create response with cookies
    let response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: sessionData,
      },
      { status: 200 }
    );

    // Set HttpOnly cookies
    response = setAuthCookies(response, tokens);

    return response;

  } catch (error) {
    console.error('Login error:', error);

    // Handle specific errors
    if (error.message === 'Invalid credentials') {
      return NextResponse.json(
        { success: false, error: 'Invalid email/username or password' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
