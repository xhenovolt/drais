/**
 * Onboarding Complete API
 * POST /api/onboarding/complete
 * 
 * DRAIS v0.0.0044
 * Marks onboarding as complete after all steps are done
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/jwt-enhanced';
import { markOnboardingComplete, isOnboardingCompleted } from '@/lib/services/onboarding.service';
import { hasActiveAccess } from '@/lib/services/trial.service';

export async function POST(request) {
  try {
    // Verify authentication
    const user = await requireAuth(request);
    const userId = user.id;

    // Check if all steps are completed
    const isComplete = await isOnboardingCompleted(userId);
    
    if (!isComplete) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please complete all onboarding steps first',
          requiresCompletion: true,
        },
        { status: 400 }
      );
    }

    // Check if user has selected a plan (trial or paid)
    const access = await hasActiveAccess(userId);
    
    if (!access.hasAccess) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please select a payment plan to continue',
          redirectTo: '/payment/select',
        },
        { status: 400 }
      );
    }

    // Mark onboarding as complete
    await markOnboardingComplete(userId);

    return NextResponse.json(
      {
        success: true,
        message: 'Onboarding completed successfully! Welcome to DRAIS.',
        data: {
          onboardingComplete: true,
          accessType: access.type,
          daysRemaining: access.daysRemaining,
          redirectTo: '/dashboard',
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Onboarding completion error:', error);
    
    // Handle authentication errors
    if (error.message && (error.message.includes('Authentication required') || error.message.includes('Invalid or expired token'))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
