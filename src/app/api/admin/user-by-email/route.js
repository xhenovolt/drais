/**
 * Temporary Admin Endpoint to Get User by Email
 * GET /api/admin/user-by-email?email=test@website.tld
 */

import { NextResponse } from 'next/server';
import db from '@/lib/db/index.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter required' },
        { status: 400 }
      );
    }

    const user = await db.findOne('users', { email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          onboarding_completed: user.onboarding_completed,
          onboarding_completed_at: user.onboarding_completed_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
