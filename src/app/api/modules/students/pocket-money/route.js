/**
 * Pocket Money Module API - PLACEHOLDER
 * GET /api/modules/students/pocket-money - Get all transactions
 * POST /api/modules/students/pocket-money - Create transaction
 * 
 * Note: This is a placeholder implementation. The student_transactions table
 * does not yet exist in the database. Full pocket money feature coming soon.
 * 
 * DRAIS v0.0.0300 - Production Implementation
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';

/**
 * GET /api/modules/students/pocket-money
 * Get all pocket money transactions (placeholder)
 */
export async function GET(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    
    if (!authUser || !authUser.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Pocket money feature coming soon - database table not yet implemented',
      data: [],
      pagination: {
        page: 1,
        limit: 50,
        total: 0,
        pages: 0
      }
    }, { status: 200 });

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Pocket Money GET]', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

/**
 * POST /api/modules/students/pocket-money
 * Create pocket money transaction (placeholder)
 */
export async function POST(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    
    if (!authUser || !authUser.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Pocket money feature coming soon - database table not yet implemented',
      data: null
    }, { status: 200 });

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Pocket Money POST]', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
