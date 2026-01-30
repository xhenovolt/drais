/**
 * User Subscription Status Endpoint
 * GET /api/payment/status
 * 
 * Session-based authentication (no JWT)
 * 
 * DRAIS v0.0.0051
 */

import { NextResponse } from 'next/server';
import { requireSessionAuth } from '@/lib/auth/session-only';
import { getUserPaymentPlan, hasActiveSubscription } from '@/lib/services/payment.service';

export async function GET(request) {
  try {
    // Verify authentication (session-based, no JWT)
    const user = await requireSessionAuth(request);
    const userId = user.id;

    // Get user's payment plan
    const paymentPlan = await getUserPaymentPlan(userId);
    const hasActive = await hasActiveSubscription(userId);

    return NextResponse.json(
      {
        success: true,
        data: {
          hasActiveSubscription: hasActive,
          currentPlan: paymentPlan,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Payment status error:', error);
    
    // Handle authentication errors
    if (error.message && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch payment status' },
      { status: 500 }
    );
  }
}
