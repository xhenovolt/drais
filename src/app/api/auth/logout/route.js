/**
 * Logout Endpoint
 * POST /api/auth/logout
 * 
 * DRAIS v0.0.0042
 */

import { NextResponse } from 'next/server';
import { invalidateRefreshToken } from '@/lib/services/user.service';
import { clearAuthCookies } from '@/lib/auth/jwt-enhanced';

export async function POST(request) {
  try {
    // Extract refresh token from cookies
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split('; ').map(c => {
          const [key, ...v] = c.split('=');
          return [key, v.join('=')];
        })
      );

      const refreshToken = cookies.refreshToken;
      if (refreshToken) {
        // Invalidate refresh token in database
        await invalidateRefreshToken(refreshToken);
      }
    }

    // Create response
    let response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );

    // Clear cookies
    response = clearAuthCookies(response);

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear cookies even if database operation fails
    let response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );

    response = clearAuthCookies(response);
    return response;
  }
}
