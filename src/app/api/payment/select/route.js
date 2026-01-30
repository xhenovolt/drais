/**
 * Payment Plan Selection Endpoint
 * POST /api/payment/select
 * 
 * Session-based authentication (no JWT)
 * Marks payment_plan step as completed and triggers onboarding completion check
 * 
 * DRAIS v0.0.0051
 */

import { NextResponse } from 'next/server';
import { requireSessionAuth } from '@/lib/auth/session-only';
import { selectPaymentPlan, getPaymentPlanByCode, getPaymentPlanById } from '@/lib/services/payment.service';
import { updateOnboardingStep } from '@/lib/services/onboarding.service';
import { activateTrial } from '@/lib/services/trial.service';
import db from '@/lib/db/index.js';

export async function POST(request) {
  try {
    // Verify authentication (session-based, no JWT)
    const user = await requireSessionAuth(request);
    const userId = user.id;
    const body = await request.json();
    const { planId, planCode, billingCycle = 'trial' } = body;

    if (!planId && !planCode) {
      return NextResponse.json(
        { success: false, error: 'planId or planCode is required' },
        { status: 400 }
      );
    }

    // Get plan by code if provided
    let finalPlanId = planId;
    let plan = null;
    
    if (planCode && !planId) {
      plan = await getPaymentPlanByCode(planCode);
      if (!plan) {
        return NextResponse.json(
          { success: false, error: 'Invalid plan code' },
          { status: 404 }
        );
      }
      finalPlanId = plan.id;
    } else {
      plan = await getPaymentPlanById(finalPlanId);
    }

    // Check if this is a trial plan
    const isTrialPlan = plan?.plan_code === 'trial' || billingCycle === 'trial';

    let result;

    if (isTrialPlan) {
      // Activate 14-day trial using trial service with transactional safety
      result = await db.transaction(async (client) => {
        return await activateTrial(userId);
      });
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }
    } else {
      // Select paid plan with transactional safety
      // Wraps both trial creation (if first) and plan assignment in single transaction
      result = await db.transaction(async (client) => {
        return await selectPaymentPlan(userId, finalPlanId, billingCycle);
      });
    }

    // Update onboarding step (payment_plan)
    try {
      await updateOnboardingStep(userId, 'payment_plan', {
        plan_id: finalPlanId,
        billing_cycle: billingCycle,
        selected_at: new Date(),
        is_trial: isTrialPlan,
      }, 'completed');
    } catch (error) {
      // Onboarding step might not exist yet, ignore
      console.warn('Could not update onboarding step:', error.message);
    }

    // NOTE: Do NOT mark onboarding complete here
    // Onboarding completion is marked after the final review_confirm step is submitted
    // See /api/onboarding/step endpoint for review_confirm handling

    return NextResponse.json(
      {
        success: true,
        message: isTrialPlan ? `14-day free trial activated successfully for ${plan?.plan_name}` : `Plan ${plan?.plan_name} selected successfully`,
        data: {
          subscriptionId: result.subscriptionId || result.trial?.id,
          plan: result.plan || plan,
          planName: plan?.plan_name,
          planCode: plan?.plan_code,
          billingCycle: billingCycle,
          price: isTrialPlan ? 0 : (billingCycle === 'annual' ? plan?.price_annual : plan?.price_termly),
          endDate: result.endDate || result.trial?.endDate,
          isTrial: isTrialPlan,
          trialDays: plan?.trial_period_days || 14,
          daysRemaining: result.trial?.daysRemaining || (plan?.trial_period_days || 14),
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Payment selection error:', error);
    
    // Handle authentication errors
    if (error.message && (error.message.includes('Authentication required') || error.message.includes('Invalid or expired token'))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (error.message.includes('already has an active payment plan')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 } // Conflict
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to select payment plan' },
      { status: 500 }
    );
  }
}
