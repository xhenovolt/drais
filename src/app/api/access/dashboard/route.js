/**
 * Dashboard Access Check Endpoint
 * GET /api/access/dashboard
 * 
 * DRAIS v0.0.0042
 * Checks if user can access dashboard (onboarding + payment complete)
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/jwt-enhanced';
import { canAccessDashboard } from '@/lib/services/onboarding.middleware';

export async function GET(request) {
  try {
    // Verify authentication
    const user = await requireAuth(request);
    const userId = user.id;

    // Check dashboard access
    const access = await canAccessDashboard(userId);

    return NextResponse.json(
      {
        success: true,
        allowed: access.allowed,
        reason: access.reason,
        redirectTo: access.redirectTo,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Dashboard access check error:', error);
    
    // Handle authentication errors
    if (error.message && (error.message.includes('Authentication required') || error.message.includes('Invalid or expired token'))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', allowed: false },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to check dashboard access',
        allowed: false,
      },
      { status: 500 }
    );
  }
}
