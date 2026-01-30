/**
 * Onboarding Status Endpoint
 * GET /api/onboarding/status
 * 
 * Returns authoritative onboarding completion state
 * Uses server-side single source of truth: users.onboarding_completed
 * 
 * DRAIS v0.0.0051
 */

import { NextResponse } from 'next/server';
import { requireSessionAuth } from '@/lib/auth/session-only';
import { getOnboardingStatus } from '@/lib/services/onboarding.service';

export async function GET(request) {
  try {
    // Verify authentication (session-based, no JWT)
    const user = await requireSessionAuth(request);
    const userId = user.id;

    // Get all onboarding steps
    const steps = await getOnboardingStatus(userId);

    // Determine missing steps (steps not yet completed)
    const missingSteps = steps
      .filter(s => s.status !== 'completed')
      .map(s => s.step_name);

    // Get current step (first incomplete step)
    const currentStep = steps.find(s => s.status !== 'completed');

    // Authoritative completion flag from database
    const isCompleted = user.onboarding_completed === true;

    return NextResponse.json(
      {
        success: true,
        data: {
          completed: isCompleted,
          missingSteps,
          currentStep: currentStep ? currentStep.step_name : null,
          steps,
          totalSteps: steps.length,
          completedSteps: steps.filter(s => s.status === 'completed').length,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Onboarding status error:', error);
    
    // Handle authentication errors
    if (error.message && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get onboarding status' },
      { status: 500 }
    );
  }
}
