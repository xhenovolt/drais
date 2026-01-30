/**
 * Alumni Module API
 * GET /api/modules/students/alumni - List alumni
 * POST /api/modules/students/alumni - Mark student as alumni
 * 
 * DRAIS v0.0.0300 - Production Implementation
 * Alumni are existing students moved to alumni status
 * Alumni cannot login or be promoted
 * Alumni are read-only except for viewing
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres.js';

/**
 * GET /api/modules/students/alumni
 * List all alumni
 */
export async function GET(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const pool = await getPool();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    let whereClause = 'WHERE s.school_id = $1 AND s.status IN (\'alumni\', \'graduated\', \'expelled\')';
    const params = [schoolId];
    let paramIndex = 2;

    if (search) {
      whereClause += ` AND (s.first_name ILIKE $${paramIndex} OR s.last_name ILIKE $${paramIndex} OR s.admission_number ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM students s ${whereClause}`,
      params.slice(0, paramIndex - (search ? 2 : 1))
    );
    const total = parseInt(countResult.rows[0].total);

    const query = `
      SELECT 
        s.id, s.admission_number, s.first_name, s.middle_name, s.last_name,
        s.status, s.enrollment_date,
        c.name as class_name
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      ${whereClause}
      ORDER BY s.updated_at DESC
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
    console.error('[Alumni GET]', error);
    return NextResponse.json({ error: 'Failed to fetch alumni' }, { status: 500 });
  }
}

/**
 * POST /api/modules/students/alumni
 * Move student to alumni status
 * 
 * Body: {
 *   student_id: number,
 *   exit_status: 'alumni' | 'graduated' | 'expelled',
 *   graduation_date?: date,
 *   exit_reason?: string
 * }
 */
export async function POST(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const body = await request.json();
    const pool = await getPool();
    const client = await pool.connect();
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    const { student_id, exit_status, graduation_date, exit_reason } = body;

    if (!student_id || !exit_status) {
      return NextResponse.json(
        { error: 'student_id and exit_status are required' },
        { status: 400 }
      );
    }

    if (!['alumni', 'graduated', 'expelled'].includes(exit_status)) {
      return NextResponse.json(
        { error: 'exit_status must be alumni, graduated, or expelled' },
        { status: 400 }
      );
    }

    // Verify student exists
    const studentCheck = await pool.query(
      'SELECT * FROM students WHERE id = $1 AND school_id = $2 AND deleted_at IS NULL',
      [student_id, schoolId]
    );

    if (studentCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const oldStudent = studentCheck.rows[0];

    try {
      await client.query('BEGIN');

      // Update student status
      await client.query(
        `UPDATE students 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND school_id = $3`,
        [exit_status, student_id, schoolId]
      );

      // Log audit
      await client.query(
        `INSERT INTO student_audit_log (
          school_id, user_id, entity_type, entity_id, action, changes, reason, created_at
        ) VALUES ($1, $2, 'student', $3, 'exit', $4, $5, CURRENT_TIMESTAMP)`,
        [
          schoolId, authUser.userId, student_id,
          JSON.stringify({
            old_status: oldStudent.status,
            new_status: exit_status,
            graduation_date: graduation_date || null
          }),
          exit_reason || null
        ]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: `Student moved to ${exit_status} status`,
        data: {
          student_id,
          new_status: exit_status,
          graduation_date: graduation_date || null
        }
      });

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
    console.error('[Alumni POST]', error);
    return NextResponse.json({ error: 'Failed to update student status' }, { status: 500 });
  }
}
