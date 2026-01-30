/**
 * Onboarding Step Submission Endpoint
 * POST /api/onboarding/step
 * 
 * Session-based authentication (no JWT)
 * 
 * DRAIS v0.0.0051
 */

import { NextResponse } from 'next/server';
import { requireSessionAuth } from '@/lib/auth/session-only';
import { 
  updateOnboardingStep, 
  updateUserProfile, 
  createSchool,
  getCurrentStep,
  markOnboardingComplete 
} from '@/lib/services/onboarding.service';

export async function POST(request) {
  try {
    // Verify authentication (session-based, no JWT)
    const user = await requireSessionAuth(request);
    const userId = user.id;
    const body = await request.json();
    const { stepName, stepData } = body;

    if (!stepName || !stepData) {
      return NextResponse.json(
        { success: false, error: 'stepName and stepData are required' },
        { status: 400 }
      );
    }

    // Validate step name
    const validSteps = ['school_setup', 'admin_profile', 'payment_plan', 'review_confirm'];
    if (!validSteps.includes(stepName)) {
      return NextResponse.json(
        { success: false, error: 'Invalid step name' },
        { status: 400 }
      );
    }

    // Process step data based on step type
    let result;
    
    switch (stepName) {
      case 'school_setup':
        // Validate school data
        if (!stepData.school_name) {
          return NextResponse.json(
            { success: false, error: 'School name is required' },
            { status: 400 }
          );
        }
        
        // Create school
        const schoolResult = await createSchool(userId, stepData);
        result = schoolResult;
        break;

      case 'admin_profile':
        // Validate profile data
        if (!stepData.full_name) {
          return NextResponse.json(
            { success: false, error: 'Full name is required' },
            { status: 400 }
          );
        }
        
        // Update user profile
        await updateUserProfile(userId, stepData);
        result = { success: true, message: 'Profile updated' };
        break;

      case 'payment_plan':
        // Payment plan is handled separately via /api/payment/select
        // This just marks the step as completed
        result = { success: true, message: 'Payment plan step completed' };
        break;

      case 'review_confirm':
        // Final review and confirmation
        result = { success: true, message: 'Onboarding confirmed' };
        break;
    }

    // Update onboarding step
    await updateOnboardingStep(userId, stepName, stepData, 'completed');

    // If this is the final step (review_confirm), mark onboarding as complete
    if (stepName === 'review_confirm') {
      try {
        await markOnboardingComplete(userId);
        console.log(`✅ Onboarding fully completed for user ${userId} via final review_confirm step`);
      } catch (error) {
        console.warn('Could not mark onboarding complete after review_confirm:', error.message);
        // Don't fail the request, user can retry
      }
    }

    // Get next step
    const nextStep = await getCurrentStep(userId);

    return NextResponse.json(
      {
        success: true,
        message: `Step ${stepName} completed successfully`,
        data: {
          result,
          nextStep,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Onboarding step error:', error);
    
    // Handle authentication errors
    if (error.message && (error.message.includes('Authentication required') || error.message.includes('Invalid or expired token'))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process onboarding step' },
      { status: 500 }
    );
  }
}
