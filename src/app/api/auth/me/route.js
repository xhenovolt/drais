/**
 * Get Current User Endpoint (Jeton Compatible)
 * GET /api/auth/me
 * 
 * Returns authenticated user information including school setup status
 * Returns 401 if not authenticated
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres';

export async function GET(request) {
  try {
    // This will throw with status 401 if not authenticated
    const authUser = await requireApiAuthFromCookies();
    
    const pool = await getPool();

    // Get user data with school information
    const result = await pool.query(
      `SELECT 
         u.id, u.email, u.role, u.status, u.created_at, u.school_id,
         s.id as school_id_db, s.name as school_name, s.address as school_address
       FROM users u
       LEFT JOIN schools s ON u.school_id = s.id
       WHERE u.id = $1
       LIMIT 1`,
      [authUser.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    // Determine onboarding completion status
    const isOnboardingComplete = user.school_id !== null && 
                                 user.school_name && 
                                 user.school_address &&
                                 user.school_name.trim() !== '' &&
                                 user.school_address.trim() !== '';

    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.created_at,
      schoolId: user.school_id,
      school_name: user.school_name,
      school_address: user.school_address,
      isOnboardingComplete: isOnboardingComplete,
    });
  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('[Auth ME] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
