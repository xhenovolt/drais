/**
 * Admin Endpoint: Mark User Onboarding Complete
 * POST /api/admin/complete-onboarding
 * 
 * Marks a user's onboarding as completed
 */

import { NextResponse } from 'next/server';
import db from '@/lib/db/index.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    console.log(`🔄 Marking onboarding complete for user ${userId}...`);

    // Update user to mark onboarding as completed
    await db.update(
      'users',
      {
        onboarding_completed: true,
        onboarding_completed_at: new Date(),
      },
      { id: parseInt(userId) }
    );

    console.log(`✅ User ${userId} onboarding marked as complete`);

    return NextResponse.json(
      { success: true, message: 'Onboarding marked as complete' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Failed to complete onboarding:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
