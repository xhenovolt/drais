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
    const authUser = await requireApiAuthFromCookies();
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
    let whereClause = 'WHERE s.school_id = $1 AND s.deleted_at IS NULL';
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
        s.admission_number ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM students s ${whereClause}`,
      params.slice(0, paramIndex - (search ? 2 : 1))
    );
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results
    const query = `
      SELECT 
        s.id, s.admission_number, s.first_name, s.middle_name, s.last_name,
        s.gender, s.date_of_birth, s.class_id, s.status, s.enrollment_date,
        s.guardian_name, s.guardian_phone, s.guardian_email, s.address,
        c.name as class_name,
        s.created_at, s.updated_at
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      ${whereClause}
      ORDER BY s.admission_number DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const result = await pool.query(query, params);

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
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Admissions GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
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
    const authUser = await requireApiAuthFromCookies();
    const body = await request.json();
    const pool = await getPool();
    const client = await pool.connect();

    const schoolId = authUser.schoolId;
    if (!schoolId) {
      return NextResponse.json(
        { error: 'School not configured' },
        { status: 400 }
      );
    }

    // Validation
    const { admission_number, first_name, last_name, gender, date_of_birth, class_id } = body;
    const requiredFields = ['admission_number', 'first_name', 'last_name'];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if admission_number is unique in this school
    const existingCheck = await pool.query(
      'SELECT id FROM students WHERE school_id = $1 AND admission_number = $2 AND deleted_at IS NULL',
      [schoolId, admission_number]
    );

    if (existingCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Admission number already exists for this school' },
        { status: 409 }
      );
    }

    try {
      await client.query('BEGIN');

      // Insert student
      const studentResult = await client.query(
        `INSERT INTO students (
          school_id, admission_number, first_name, middle_name, last_name,
          gender, date_of_birth, class_id, status, enrollment_date,
          guardian_name, guardian_phone, guardian_email, address,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE, $10, $11, $12, $13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, admission_number, first_name, last_name, status, enrollment_date`,
        [
          schoolId,
          admission_number,
          first_name,
          body.middle_name || null,
          last_name,
          gender || null,
          date_of_birth || null,
          class_id || null,
          'active',
          body.guardian_name || null,
          body.guardian_phone || null,
          body.guardian_email || null,
          body.address || null
        ]
      );

      const student = studentResult.rows[0];
      const studentId = student.id;

      // Create admission record
      await client.query(
        `INSERT INTO student_admissions (
          school_id, student_id, admission_number, admission_date,
          admission_type, previous_school, remarks, admitted_by,
          created_at, updated_at
        ) VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          schoolId,
          studentId,
          admission_number,
          body.admission_type || 'regular',
          body.previous_school || null,
          body.remarks || null,
          authUser.userId
        ]
      );

      // Log audit
      await client.query(
        `INSERT INTO student_audit_log (
          school_id, user_id, entity_type, entity_id, action, changes, created_at
        ) VALUES ($1, $2, 'student', $3, 'create', $4, CURRENT_TIMESTAMP)`,
        [
          schoolId,
          authUser.userId,
          studentId,
          JSON.stringify({
            first_name,
            last_name,
            admission_number,
            status: 'active'
          })
        ]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Student admitted successfully',
        data: {
          id: studentId,
          ...student
        }
      }, { status: 201 });

    } catch (transactionError) {
      await client.query('ROLLBACK');
      throw transactionError;
    } finally {
      client.release();
    }

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Admissions POST]', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}
