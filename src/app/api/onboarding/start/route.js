/**
 * Onboarding Start Endpoint
 * POST /api/onboarding/start
 * 
 * DRAIS v0.0.0042
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/jwt-enhanced';
import { initializeOnboarding } from '@/lib/services/onboarding.service';

export async function POST(request) {
  try {
    // Verify authentication
    const user = await requireAuth(request);
    const userId = user.id;

    // Initialize onboarding
    const result = await initializeOnboarding(userId);

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        data: result.steps,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Onboarding start error:', error);
    
    // Handle authentication errors
    if (error.message && (error.message.includes('Authentication required') || error.message.includes('Invalid or expired token'))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to start onboarding' },
      { status: 500 }
    );
  }
}
