/**
 * HR/Staff Module API
 * DRAIS v0.0.0044
 * 
 * Staff management CRUD operations
 */

import { NextResponse } from 'next/server';
import { requireModuleAccess } from '@/lib/services/module.middleware';
import * as crud from '@/lib/services/crud.service';

/**
 * GET /api/modules/hr/staff
 * List all staff members
 */
async function getStaff(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const options = {
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      orderBy: searchParams.get('orderBy') || 'id',
      order: searchParams.get('order') || 'DESC',
      search: searchParams.get('search'),
      searchFields: ['first_name', 'last_name', 'email', 'employee_number'],
      where: {},
    };

    // Add filters
    if (searchParams.get('department')) {
      options.where.department = searchParams.get('department');
    }
    if (searchParams.get('status')) {
      options.where.status = searchParams.get('status');
    }

    const result = await crud.getAll('staff', options);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Get staff error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/modules/hr/staff
 * Create a new staff member
 */
async function createStaff(request) {
  try {
    const user = request.user;
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'employee_number'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const result = await crud.create('staff', body, user.id);

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Create staff error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create staff' },
      { status: 500 }
    );
  }
}

// Export with middleware
export const GET = requireModuleAccess('hr', 'read')(getStaff);
export const POST = requireModuleAccess('hr', 'create')(createStaff);
