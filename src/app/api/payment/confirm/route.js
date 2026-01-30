/**
 * Payment Confirmation API
 * POST /api/payment/confirm
 * 
 * DRAIS v0.0.0044
 * Confirms payment for paid plans (mock payment gateway integration)
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/jwt-enhanced';
import { confirmPayment } from '@/lib/services/payment.service';

export async function POST(request) {
  try {
    // Verify authentication
    const user = await requireAuth(request);
    const userId = user.id;
    
    const body = await request.json();
    const { subscriptionId, paymentMethod, transactionId } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, error: 'subscriptionId is required' },
        { status: 400 }
      );
    }

    // Confirm payment (mock for now, integrate with actual gateway later)
    const result = await confirmPayment(userId, subscriptionId, {
      paymentMethod: paymentMethod || 'mock',
      transactionId: transactionId || `MOCK_${Date.now()}`,
      paidAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Payment confirmed successfully. Dashboard access granted.',
        data: result,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Payment confirmation error:', error);
    
    // Handle authentication errors
    if (error.message && (error.message.includes('Authentication required') || error.message.includes('Invalid or expired token'))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}
