/**
 * User Logout Endpoint - Session-Based
 * POST /api/v2/auth/logout
 * 
 * DRAIS v0.0.0050
 * Destroys session and clears cookies
 */

import { NextResponse } from 'next/server';
import { destroySession, clearSessionCookies, getSessionFromRequest } from '@/lib/auth/session';

export async function POST(request) {
  try {
    // Get session from request
    const session = await getSessionFromRequest(request);

    if (session) {
      // Destroy session on server
      await destroySession(session.sessionId);
    }

    // Create response and clear cookies
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );

    return clearSessionCookies(response);

  } catch (error) {
    console.error('Logout error:', error.message);
    
    // Even if error, still try to clear cookies
    const response = NextResponse.json(
      { 
        success: false, 
        error: 'Logout failed' 
      },
      { status: 500 }
    );

    return clearSessionCookies(response);
  }
}
