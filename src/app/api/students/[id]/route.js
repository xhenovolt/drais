/**
 * Individual Student Endpoint
 * GET /api/students/:id → Get student details
 * PUT /api/students/:id → Update student
 * DELETE /api/students/:id → Delete student (soft delete)
 * 
 * DRAIS v0.0.0045
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/jwt-enhanced';
import { getStudentById, updateStudent, deleteStudent } from '@/lib/services/student.service';

/**
 * GET - Fetch student details by ID
 */
export async function GET(request, { params }) {
  try {
    // Verify authentication
    const user = await requireAuth(request);
    
    const { id } = params;
    const studentId = parseInt(id);

    if (!studentId || isNaN(studentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    // Get student
    const student = await getStudentById(studentId);

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: student 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get student error:', error);
    
    if (error.message && (
      error.message.includes('Authentication required') || 
      error.message.includes('Invalid or expired token')
    )) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch student' 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update student information
 */
export async function PUT(request, { params }) {
  try {
    const user = await requireAuth(request);
    const userId = user.id;

    const { id } = params;
    const studentId = parseInt(id);

    if (!studentId || isNaN(studentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    const updateData = await request.json();

    // Update student
    const result = await updateStudent(studentId, updateData, userId);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Update student error:', error);
    
    if (error.message && (
      error.message.includes('Authentication required') || 
      error.message.includes('Invalid or expired token')
    )) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to update student' 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Soft delete student
 */
export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth(request);
    const userId = user.id;

    // Only admin can delete students
    const allowedRoles = ['super_admin', 'admin', 'school_admin'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Only admin can delete students' },
        { status: 403 }
      );
    }

    const { id } = params;
    const studentId = parseInt(id);

    if (!studentId || isNaN(studentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    // Delete student
    const result = await deleteStudent(studentId, userId);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Delete student error:', error);
    
    if (error.message && (
      error.message.includes('Authentication required') || 
      error.message.includes('Invalid or expired token')
    )) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to delete student' 
      },
      { status: 500 }
    );
  }
}
