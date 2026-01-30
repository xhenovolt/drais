/**
 * Students List/Create Endpoint
 * GET /api/students → List all students (school-scoped)
 * POST /api/students → Create student (alias to /admissions for compatibility)
 * 
 * DRAIS v0.0.0300 - CRITICAL FIX: Proper auth + school scoping
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getAllStudents, admitStudent, validateAdmissionData } from '@/lib/services/student.service';

/**
 * GET - List all students with pagination, filtering, search
 * STRICT SCHOOL SCOPING: Only returns students for user's school
 */
export async function GET(request) {
  try {
    // CRITICAL: Get authenticated user with school context
    let user;
    try {
      user = await requireApiAuthFromCookies();
    } catch (authError) {
      return NextResponse.json(
        { success: false, error: authError.message || 'Unauthorized' },
        { status: authError.status || 401 }
      );
    }
    
    const schoolId = user.schoolId;
    if (!schoolId) {
      return NextResponse.json(
        { success: false, error: 'School context not configured' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const classId = searchParams.get('classId') ? parseInt(searchParams.get('classId')) : null;
    const status = searchParams.get('status') || 'active';

    // Get students (school-scoped)
    const result = await getAllStudents({
      page,
      limit,
      search,
      classId,
      status,
      schoolId
    });

    // If no students, return empty array with proper structure
    if (!result.data || result.data.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: limit,
          total: 0,
          pages: 0
        }
      }, { status: 200 });
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Get students error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch students' 
      },
      { status: error.status || 500 }
    );
  }
}

/**
 * POST - Create/admit student (alias to /admissions endpoint)
 */
export async function POST(request) {
  try {
    // Get authenticated user with school context
    let user;
    try {
      user = await requireApiAuthFromCookies();
    } catch (authError) {
      return NextResponse.json(
        { success: false, error: authError.message || 'Unauthorized' },
        { status: authError.status || 401 }
      );
    }
    
    const schoolId = user.schoolId;
    if (!schoolId) {
      return NextResponse.json(
        { success: false, error: 'School context not configured' },
        { status: 403 }
      );
    }

    const admissionData = await request.json();
    admissionData.schoolId = schoolId;

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
    const result = await admitStudent(admissionData, user.userId);

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Create student error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create student' 
      },
      { status: error.status || 500 }
    );
  }
}
