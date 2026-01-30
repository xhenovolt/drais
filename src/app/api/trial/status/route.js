/**
 * Trial Status API
 * GET /api/trial/status
 * DRAIS v0.0.0043
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/jwt-enhanced';
import { getTrialStatus, hasActiveAccess } from '@/lib/services/trial.service';

async function handler(req) {
  try {
    const user = req.user;
    
    // Get trial status
    const trialStatus = await getTrialStatus(user.id);
    
    // Get overall access status (trial or subscription)
    const accessStatus = await hasActiveAccess(user.id);

    return NextResponse.json({
      success: true,
      trial: trialStatus,
      access: accessStatus,
    });
  } catch (error) {
    console.error('Error getting trial status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get trial status' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
