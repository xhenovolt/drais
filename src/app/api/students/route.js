/**
 * Students List/Create Endpoint
 * GET /api/students → List all students
 * POST /api/students → Create student (alias to /admit for compatibility)
 * 
 * DRAIS v0.0.0045
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/jwt-enhanced';
import { getAllStudents, admitStudent, validateAdmissionData } from '@/lib/services/student.service';

/**
 * GET - List all students with pagination, filtering, search
 */
export async function GET(request) {
  try {
    // Verify authentication
    const user = await requireAuth(request);
    const schoolId = user.school_id || 1;

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const classId = searchParams.get('classId') ? parseInt(searchParams.get('classId')) : null;
    const status = searchParams.get('status') || 'active';

    // Get students
    const result = await getAllStudents({
      page,
      limit,
      search,
      classId,
      status,
      schoolId
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Get students error:', error);
    
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
        error: error.message || 'Failed to fetch students' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Create/admit student (alias to /admit endpoint)
 */
export async function POST(request) {
  try {
    const user = await requireAuth(request);
    const userId = user.id;

    const admissionData = await request.json();
    admissionData.schoolId = user.school_id || 1;

    // Validate
    const validation = validateAdmissionData(admissionData);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          errors: validation.errors 
        },
        { status: 400 }
      );
    }

    // Admit student
    const result = await admitStudent(admissionData, userId);

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Create student error:', error);
    
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
        error: error.message || 'Failed to create student' 
      },
      { status: 500 }
    );
  }
}
