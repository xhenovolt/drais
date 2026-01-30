/**
 * Student Detail API
 * GET/PUT/DELETE /api/modules/students/[id]
 * 
 * DRAIS v0.0.0044
 */

import { NextResponse } from 'next/server';
import { requireModuleAccess } from '@/lib/services/module.middleware';
import * as crud from '@/lib/services/crud.service';

/**
 * GET /api/modules/students/[id]
 * Get student by ID
 */
async function getStudent(request, { params }) {
  try {
    const { id } = params;
    const result = await crud.getById('student', id);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Get student error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch student' },
      { status: error.message === 'Record not found' ? 404 : 500 }
    );
  }
}

/**
 * PUT /api/modules/students/[id]
 * Update student by ID
 */
async function updateStudent(request, { params }) {
  try {
    const user = request.user;
    const { id } = params;
    const body = await request.json();

    const result = await crud.update('student', id, body, user.id);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update student' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/modules/students/[id]
 * Soft delete student by ID
 */
async function deleteStudent(request, { params }) {
  try {
    const user = request.user;
    const { id } = params;

    const result = await crud.softDelete('student', id, user.id);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete student' },
      { status: 500 }
    );
  }
}

// Export with middleware
export const GET = requireModuleAccess('students', 'read')(getStudent);
export const PUT = requireModuleAccess('students', 'update')(updateStudent);
export const DELETE = requireModuleAccess('students', 'delete')(deleteStudent);
