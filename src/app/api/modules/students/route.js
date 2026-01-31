/**
 * Students Module API
 * DRAIS v0.0.0044
 * 
 * CRUD operations for student management
 * Demonstrates the modular API pattern
 * 
 * GET    /api/modules/students - List students
 * POST   /api/modules/students - Create student
 * PATCH  /api/modules/students - Update specific student (requires id in body)
 * DELETE /api/modules/students - Delete specific student (requires id in body)
 */

import { NextResponse } from 'next/server';
import { requireModuleAccess } from '@/lib/services/module.middleware';
import * as crud from '@/lib/services/crud.service';

/**
 * GET /api/modules/students
 * List all students with filtering and pagination
 */
async function getStudents(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const options = {
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      orderBy: searchParams.get('orderBy') || 'id',
      order: searchParams.get('order') || 'DESC',
      search: searchParams.get('search'),
      searchFields: ['first_name', 'last_name', 'admission_number', 'email'],
      where: {},
    };

    // Add filters
    if (searchParams.get('class_id')) {
      options.where.class_id = searchParams.get('class_id');
    }
    if (searchParams.get('status')) {
      options.where.status = searchParams.get('status');
    }

    const result = await crud.getAll('student', options);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Get students error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/modules/students
 * Create a new student
 */
async function createStudent(request) {
  try {
    const user = request.user;
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'admission_number'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const result = await crud.create('student', body, user.id);

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create student' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/modules/students
 * Update specific student by ID (passed in body)
 * 
 * Request body: { id: number, ...updateFields }
 */
async function updateStudent(request) {
  try {
    const user = request.user;
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required in request body' },
        { status: 400 }
      );
    }

    const result = await crud.update('student', id, body, user.id);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update student' },
      { status: error.message === 'Record not found' ? 404 : 500 }
    );
  }
}

/**
 * DELETE /api/modules/students
 * Soft delete student by ID (passed in body)
 * 
 * Request body: { id: number }
 */
async function deleteStudent(request) {
  try {
    const user = request.user;
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required in request body' },
        { status: 400 }
      );
    }

    const result = await crud.softDelete('student', id, user.id);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete student' },
      { status: error.message === 'Record not found' ? 404 : 500 }
    );
  }
}

// Export with middleware
export const GET = requireModuleAccess('students', 'read')(getStudents);
export const POST = requireModuleAccess('students', 'create')(createStudent);
export const PATCH = requireModuleAccess('students', 'update')(updateStudent);
export const DELETE = requireModuleAccess('students', 'delete')(deleteStudent);
