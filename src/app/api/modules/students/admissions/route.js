/**
 * Admissions API
 * GET /api/modules/students/admissions - List all admitted students
 * POST /api/modules/students/admissions - Create new admission
 * GET /api/modules/students/admissions/[id] - Get single student
 * PATCH /api/modules/students/admissions/[id] - Edit student details
 * DELETE /api/modules/students/admissions/[id] - Soft delete student (mark as left)
 * 
 * DRAIS v0.0.0300 - Production Implementation
 * All data is school-scoped. Every operation requires school_id.
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres.js';

/**
 * GET /api/modules/students/admissions
 * List all students with pagination, filtering, search
 */
export async function GET(request) {
  try {
    let authUser;
    try {
      authUser = await requireApiAuthFromCookies();
    } catch (authError) {
      return NextResponse.json(
        { error: authError.message || 'Unauthorized' },
        { status: authError.status || 401 }
      );
    }

    const pool = await getPool();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'active';
    const classId = searchParams.get('class_id');

    const offset = (page - 1) * limit;
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        { error: 'School not configured' },
        { status: 400 }
      );
    }

    // Build WHERE clause
    let whereClause = 'WHERE s.school_id = $1';
    const params = [schoolId];
    let paramIndex = 2;

    if (status) {
      whereClause += ` AND s.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (classId) {
      whereClause += ` AND s.class_id = $${paramIndex}`;
      params.push(classId);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (
        s.first_name ILIKE $${paramIndex} OR 
        s.last_name ILIKE $${paramIndex} OR 
        s.admission_no ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count (use same params for WHERE clause only)
    const countParams = params.slice(0, paramIndex - 1);
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM students s ${whereClause}`,
      countParams
    );
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results - map DB columns to API schema
    const query = `
      SELECT 
        s.id, 
        s.admission_no as admission_number, 
        s.first_name, 
        s.last_name,
        s.gender, 
        s.dob as date_of_birth, 
        s.class_id, 
        s.status, 
        s.created_at as enrollment_date,
        s.address,
        c.name as class_name,
        s.created_at, 
        s.updated_at
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      ${whereClause}
      ORDER BY s.admission_no DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    // Create final params array for main query
    const queryParams = params.concat([limit, offset]);

    const result = await pool.query(query, queryParams);

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('[Admissions GET] Error:', error.message || error);
    if (error.message && error.message.includes('no such table')) {
      return NextResponse.json(
        { error: 'Database tables not initialized. Run migration: node scripts/students-module-schema.js' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/modules/students/admissions
 * Create new student admission
 */
export async function POST(request) {
  try {
    let authUser;
    try {
      authUser = await requireApiAuthFromCookies();
    } catch (authError) {
      return NextResponse.json(
        { error: authError.message || 'Unauthorized' },
        { status: authError.status || 401 }
      );
    }

    const body = await request.json();
    const pool = await getPool();

    const schoolId = authUser.schoolId;
    if (!schoolId) {
      return NextResponse.json(
        { error: 'School not configured' },
        { status: 400 }
      );
    }

    // Validation - required fields from database schema
    const { first_name, last_name, gender, dob, class_id } = body;
    
    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: 'first_name and last_name are required' },
        { status: 400 }
      );
    }

    // Generate admission_no if not provided
    let admission_no = body.admission_no;
    if (!admission_no) {
      // Generate simple format: ADM-YY-XXXXX
      const year = new Date().getFullYear().toString().slice(2);
      const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
      admission_no = `ADM-${year}-${random}`;
    }

    // Check if admission_no is unique in this school
    const existingCheck = await pool.query(
      'SELECT id FROM students WHERE school_id = $1 AND admission_no = $2',
      [schoolId, admission_no]
    );

    if (existingCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Admission number already exists for this school' },
        { status: 409 }
      );
    }

    // Insert student record
    const result = await pool.query(
      `INSERT INTO students (
        school_id, admission_no, first_name, last_name,
        gender, dob, class_id, status, address,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, admission_no, first_name, last_name, gender, dob, class_id, status, created_at`,
      [
        schoolId,
        admission_no,
        first_name.trim(),
        last_name.trim(),
        gender || null,
        dob || null,
        class_id || null,
        'active',
        body.address ? body.address.trim() : null
      ]
    );

    const student = result.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Student admitted successfully',
      data: {
        id: student.id,
        admission_number: student.admission_no,
        first_name: student.first_name,
        last_name: student.last_name,
        gender: student.gender,
        date_of_birth: student.dob,
        class_id: student.class_id,
        status: student.status,
        enrollment_date: student.created_at
      }
    }, { status: 201 });

  } catch (error) {
    console.error('[Admissions POST] Error:', error.message || error);
    return NextResponse.json(
      { error: error.message || 'Failed to admit student' },
      { status: 500 }
    );
  }
}
