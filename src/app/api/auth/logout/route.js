/**
 * Logout Endpoint (Jeton Compatible)
 * POST /api/auth/logout
 * 
 * Deletes session from database and clears jeton_session cookie
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSession } from '@/lib/session.js';
import { getSecureCookieOptions } from '@/lib/session.js';

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get('jeton_session')?.value;

    // Delete session from database if it exists
    if (sessionId) {
      await deleteSession(sessionId);
    }

    // Create response
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear jeton_session cookie
    response.cookies.set(
      'jeton_session',
      '',
      { ...getSecureCookieOptions(), maxAge: 0 }
    );

    return response;
  } catch (error) {
    console.error('[Logout] Error:', error);

    // Even if there's an error, clear the cookie
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    response.cookies.set(
      'jeton_session',
      '',
      { ...getSecureCookieOptions(), maxAge: 0 }
    );

    return response;
  }
}
