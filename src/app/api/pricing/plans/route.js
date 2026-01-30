/**
 * Pricing Plans API
 * GET /api/pricing/plans
 * 
 * DRAIS v0.0.0044
 * Returns all active payment plans for pricing page
 */

import { NextResponse } from 'next/server';
import { getPaymentPlans } from '@/lib/services/payment.service';

export async function GET(request) {
  try {
    const plans = await getPaymentPlans();

    return NextResponse.json(
      {
        success: true,
        data: plans,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching payment plans:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment plans' },
      { status: 500 }
    );
  }
}
