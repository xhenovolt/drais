/**
 * Payment Plans List Endpoint
 * GET /api/payment/plans
 * 
 * DRAIS v0.0.0042
 */

import { NextResponse } from 'next/server';
import { getPaymentPlans } from '@/lib/services/payment.service';

export async function GET(request) {
  try {
    const plans = await getPaymentPlans();

    // Normalize plans with consistent schema
    const normalizedPlans = plans.map(plan => ({
      id: plan.id,
      plan_name: plan.plan_name || 'Unnamed Plan',
      plan_code: plan.plan_code,
      description: plan.description,
      // Convert to actual numbers and provide both naming conventions
      price_monthly: Number(plan.price_monthly) || Number(plan.price_termly) || 0,
      price_yearly: Number(plan.price_yearly) || Number(plan.price_annual) || 0,
      price_termly: Number(plan.price_termly) || 0,
      price_annual: Number(plan.price_annual) || 0,
      trial_period_days: parseInt(plan.trial_period_days, 10) || 0,
      is_trial: Boolean(plan.is_trial),
      is_active: Boolean(plan.is_active),
      sort_order: plan.sort_order || 0,
      features: typeof plan.features === 'string' ? JSON.parse(plan.features) : (plan.features || []),
      created_at: plan.created_at,
      updated_at: plan.updated_at,
    }));

    return NextResponse.json(
      {
        success: true,
        data: normalizedPlans,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Payment plans error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch payment plans' },
      { status: 500 }
    );
  }
}
