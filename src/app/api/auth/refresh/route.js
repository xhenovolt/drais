/**
 * Token Refresh Endpoint
 * POST /api/auth/refresh
 * 
 * DRAIS v0.0.0042
 */

import { NextResponse } from 'next/server';
import { findUserById } from '@/lib/services/user.service';
import { verifyRefreshToken, generateTokens, setAuthCookies, createSessionData } from '@/lib/auth/jwt-enhanced';

export async function POST(request) {
  try {
    // Extract refresh token from cookies
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json(
        { success: false, error: 'No refresh token provided' },
        { status: 401 }
      );
    }

    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(c => {
        const [key, ...v] = c.split('=');
        return [key, v.join('=')];
      })
    );

    const refreshToken = cookies.refreshToken;
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'No refresh token provided' },
        { status: 401 }
      );
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await findUserById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password
    delete user.password;

    // Generate new tokens (token rotation)
    const newTokens = generateTokens(user);

    // Create session data
    const sessionData = createSessionData(user, newTokens);

    // Create response
    let response = NextResponse.json(
      {
        success: true,
        message: 'Token refreshed successfully',
        data: sessionData,
      },
      { status: 200 }
    );

    // Set new HttpOnly cookies
    response = setAuthCookies(response, newTokens);

    return response;

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Token refresh failed' },
      { status: 500 }
    );
  }
}
