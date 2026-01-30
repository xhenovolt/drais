/**
 * Get Current User Endpoint - Session-Based
 * GET /api/v2/auth/me
 * 
 * DRAIS v0.0.0050
 * Returns current logged-in user info from session
 */

import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/session';

export async function GET(request) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Not authenticated' 
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: session.userId,
          email: session.email,
          username: session.username,
          role: session.role,
          schoolId: session.schoolId,
          expiresAt: session.expiresAt,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get user error:', error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get user info' 
      },
      { status: 500 }
    );
  }
}
