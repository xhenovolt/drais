/**
 * Trial Activation API
 * POST /api/trial/activate
 * DRAIS v0.0.0043
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/jwt-enhanced';
import { activateTrial } from '@/lib/services/trial.service';

async function handler(req) {
  try {
    const user = req.user;
    
    // Activate 30-day trial for user
    const result = await activateTrial(user.id);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '30-day free trial activated successfully',
      trial: result.trial,
    });
  } catch (error) {
    console.error('Error activating trial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to activate trial' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(handler);
