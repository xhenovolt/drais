/**
 * Fees Module API
 * DRAIS v0.0.0044
 * 
 * Fee management CRUD operations
 */

import { NextResponse } from 'next/server';
import { requireModuleAccess } from '@/lib/services/module.middleware';
import * as crud from '@/lib/services/crud.service';

/**
 * GET /api/modules/fees
 * List all fee structures
 */
async function getFees(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const options = {
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      orderBy: searchParams.get('orderBy') || 'id',
      order: searchParams.get('order') || 'DESC',
      search: searchParams.get('search'),
      searchFields: ['fee_name', 'description'],
      where: {},
    };

    // Add filters
    if (searchParams.get('class_id')) {
      options.where.class_id = searchParams.get('class_id');
    }
    if (searchParams.get('term_id')) {
      options.where.term_id = searchParams.get('term_id');
    }

    const result = await crud.getAll('fees', options);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Get fees error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch fees' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/modules/fees
 * Create a new fee structure
 */
async function createFee(request) {
  try {
    const user = request.user;
    const body = await request.json();

    // Validate required fields
    if (!body.fee_name || !body.amount) {
      return NextResponse.json(
        { success: false, error: 'fee_name and amount are required' },
        { status: 400 }
      );
    }

    const result = await crud.create('fees', body, user.id);

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Create fee error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create fee' },
      { status: 500 }
    );
  }
}

// Export with middleware
export const GET = requireModuleAccess('fees', 'read')(getFees);
export const POST = requireModuleAccess('fees', 'create')(createFee);
