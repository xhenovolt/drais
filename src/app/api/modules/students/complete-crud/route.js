/**
 * Complete Students Management API
 * Supports: List, Get, Create, Update, Delete, Search, Filter, Paginate
 * All operations school-scoped
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres.js';

/**
 * GET /api/modules/students
 * List all students with filtering and pagination
 */
export async function GET(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const pool = await getPool();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const search = searchParams.get('search') || '';
    const classId = searchParams.get('class_id');
    const status = searchParams.get('status') || 'active';

    const schoolId = authUser.schoolId;
    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    // Build WHERE clause
    let whereConditions = ['s.school_id = $1', `s.status = '${status}'`];
    let params = [schoolId];
    let paramIndex = 2;

    if (search) {
      whereConditions.push(`(s.first_name ILIKE $${paramIndex} OR s.last_name ILIKE $${paramIndex} OR s.admission_no ILIKE $${paramIndex} OR s.email ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (classId) {
      whereConditions.push(`s.class_id = $${paramIndex}`);
      params.push(classId);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Count total
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM students s WHERE ${whereClause}`,
      params.slice(0, paramIndex - (search ? 1 : 0) - (classId ? 1 : 0) + 1)
    );
    const total = parseInt(countResult.rows[0].total);

    // Get students with photo info
    const studentsResult = await pool.query(
      `SELECT 
        s.id, s.school_id, s.admission_no, s.first_name, s.last_name,
        s.dob, s.gender, s.email, s.phone, s.address, s.photo_url,
        s.status, s.class_id, s.section_id, s.roll_no,
        s.created_at, s.updated_at,
        (SELECT file_url FROM student_photos sp WHERE sp.student_id = s.id AND sp.is_current = true LIMIT 1) as current_photo
      FROM students s
      WHERE ${whereClause}
      ORDER BY s.admission_no ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: studentsResult.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Students GET]', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

/**
 * GET /api/modules/students/[id]
 * Get single student with full details
 */
export async function getStudent(studentId, schoolId) {
  const pool = await getPool();
  
  const result = await pool.query(
    `SELECT 
      s.*, 
      sp.file_url as current_photo,
      COUNT(DISTINCT pm.id) as transaction_count
    FROM students s
    LEFT JOIN student_photos sp ON sp.student_id = s.id AND sp.is_current = true
    LEFT JOIN pocket_money_transactions pm ON pm.student_id = s.id
    WHERE s.id = $1 AND s.school_id = $2
    GROUP BY s.id, sp.id
    LIMIT 1`,
    [studentId, schoolId]
  );

  return result.rows[0] || null;
}

/**
 * POST /api/modules/students
 * Create new student (admission)
 */
export async function POST(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const body = await request.json();
    const pool = await getPool();
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    const {
      first_name, last_name, dob, gender, email, phone, address,
      class_id, section_id, admission_no
    } = body;

    // Validation
    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    if (!dob || !gender) {
      return NextResponse.json(
        { error: 'Date of birth and gender are required' },
        { status: 400 }
      );
    }

    // Generate admission number if not provided
    let admissionNumber = admission_no;
    if (!admissionNumber) {
      const timestamp = Date.now().toString().slice(-6);
      admissionNumber = `ADM-${schoolId}-${timestamp}`;
    }

    // Check uniqueness
    const existing = await pool.query(
      'SELECT id FROM students WHERE admission_no = $1 AND school_id = $2',
      [admissionNumber, schoolId]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Admission number already exists' },
        { status: 409 }
      );
    }

    // Create student
    const result = await pool.query(
      `INSERT INTO students (
        school_id, first_name, last_name, dob, gender, email, phone, address,
        class_id, section_id, admission_no, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [schoolId, first_name, last_name, dob, gender, email, phone, address,
       class_id, section_id, admissionNumber, 'active']
    );

    const student = result.rows[0];

    // Create wallet for pocket money
    await pool.query(
      `INSERT INTO pocket_money_wallets (student_id, school_id, current_balance, is_active)
       VALUES ($1, $2, 0.00, true)`,
      [student.id, schoolId]
    );

    // Log audit
    await pool.query(
      `INSERT INTO student_audit_log (school_id, student_id, user_id, action, entity_type, entity_id, changes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [schoolId, student.id, authUser.userId, 'created', 'student', student.id,
       JSON.stringify({ admission_no: admissionNumber })]
    );

    return NextResponse.json({
      success: true,
      message: 'Student created successfully',
      data: student,
    }, { status: 201 });

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Students POST]', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}

/**
 * PATCH /api/modules/students/[id]
 * Update student information
 */
export async function PATCH(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const body = await request.json();
    const pool = await getPool();
    const schoolId = authUser.schoolId;
    const studentId = body.id;

    if (!schoolId || !studentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get current student
    const current = await pool.query(
      'SELECT * FROM students WHERE id = $1 AND school_id = $2',
      [studentId, schoolId]
    );

    if (current.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const oldStudent = current.rows[0];

    // Update allowed fields
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    const allowedFields = ['first_name', 'last_name', 'email', 'phone', 'address', 'class_id', 'section_id', 'gender', 'dob'];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        updateValues.push(body[field]);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateValues.push(studentId);
    updateValues.push(schoolId);

    const result = await pool.query(
      `UPDATE students SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex} AND school_id = $${paramIndex + 1}
       RETURNING *`,
      updateValues
    );

    const updatedStudent = result.rows[0];

    // Log audit
    await pool.query(
      `INSERT INTO student_audit_log (school_id, student_id, user_id, action, entity_type, entity_id, old_values, new_values)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [schoolId, studentId, authUser.userId, 'updated', 'student', studentId,
       JSON.stringify(oldStudent), JSON.stringify(updatedStudent)]
    );

    return NextResponse.json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent,
    });

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Students PATCH]', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

/**
 * DELETE /api/modules/students/[id]
 * Soft delete a student
 */
export async function DELETE(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const body = await request.json();
    const pool = await getPool();
    const schoolId = authUser.schoolId;
    const studentId = body.id;

    if (!schoolId || !studentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Soft delete: set status to 'deleted'
    const result = await pool.query(
      `UPDATE students SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND school_id = $2
       RETURNING *`,
      [studentId, schoolId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Log audit
    await pool.query(
      `INSERT INTO student_audit_log (school_id, student_id, user_id, action, entity_type, entity_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [schoolId, studentId, authUser.userId, 'deleted', 'student', studentId]
    );

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully',
    });

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Students DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
