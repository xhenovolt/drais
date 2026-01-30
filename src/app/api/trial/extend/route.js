/**
 * Trial Extension API
 * POST /api/trial/extend
 * DRAIS v0.0.0043
 * Admin only - extends trial period
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/jwt-enhanced';
import { extendTrial } from '@/lib/services/trial.service';

async function handler(req) {
  try {
    const user = req.user;
    
    // Check if admin
    const allowedRoles = ['super_admin', 'admin', 'school_admin'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId, additionalDays = 7 } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Extend trial
    const result = await extendTrial(userId, additionalDays);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      newDaysRemaining: result.newDaysRemaining,
      newEndDate: result.newEndDate,
    });
  } catch (error) {
    console.error('Error extending trial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to extend trial' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(handler);
