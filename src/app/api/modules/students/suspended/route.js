/**
 * Suspended Students Module API
 * GET /api/modules/students/suspended - List suspended students
 * POST /api/modules/students/suspended - Suspend student
 * PATCH /api/modules/students/suspended/[id] - Reactivate student
 * 
 * DRAIS v0.0.0300 - Production Implementation
 * Suspended students:
 * - Appear in suspended list
 * - Cannot be promoted
 * - Still counted historically
 * - Auto-reactivate after end_date
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres.js';

/**
 * GET /api/modules/students/suspended
 */
export async function GET(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const pool = await getPool();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM student_suspensions WHERE school_id = $1 AND status = \'active\'',
      [schoolId]
    );
    const total = parseInt(countResult.rows[0].total);

    const query = `
      SELECT 
        ss.id, ss.student_id, ss.reason, ss.start_date, ss.end_date,
        ss.status, ss.notes,
        s.first_name, s.last_name, s.admission_number,
        c.name as class_name
      FROM student_suspensions ss
      LEFT JOIN students s ON ss.student_id = s.id
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE ss.school_id = $1 AND ss.status = 'active'
      ORDER BY ss.start_date DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [schoolId, limit, offset]);

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
    console.error('[Suspended GET]', error);
    return NextResponse.json({ error: 'Failed to fetch suspensions' }, { status: 500 });
  }
}

/**
 * POST /api/modules/students/suspended
 * Suspend a student
 * 
 * Body: {
 *   student_id: number,
 *   reason: string,
 *   start_date: date,
 *   end_date?: date,
 *   notes?: string
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

    const { student_id, reason, start_date, end_date, notes } = body;

    if (!student_id || !reason || !start_date) {
      return NextResponse.json(
        { error: 'student_id, reason, and start_date are required' },
        { status: 400 }
      );
    }

    // Verify student exists
    const studentCheck = await pool.query(
      'SELECT id FROM students WHERE id = $1 AND school_id = $2 AND deleted_at IS NULL',
      [student_id, schoolId]
    );

    if (studentCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO student_suspensions (
          school_id, student_id, reason, start_date, end_date,
          status, notes, suspended_by, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, 'active', $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, student_id, reason, start_date, end_date, status`,
        [schoolId, student_id, reason, start_date, end_date || null, notes || null, authUser.userId]
      );

      // Log audit
      await client.query(
        `INSERT INTO student_audit_log (
          school_id, user_id, entity_type, entity_id, action, changes, created_at
        ) VALUES ($1, $2, 'suspension', $3, 'create', $4, CURRENT_TIMESTAMP)`,
        [
          schoolId, authUser.userId, student_id,
          JSON.stringify({
            reason,
            start_date,
            end_date: end_date || null,
            notes
          })
        ]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Student suspended successfully',
        data: result.rows[0]
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
    console.error('[Suspended POST]', error);
    return NextResponse.json({ error: 'Failed to suspend student' }, { status: 500 });
  }
}

/**
 * PATCH /api/modules/students/suspended/[id]
 * Reactivate student (end suspension)
 */
export async function PATCH(request, { params }) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const pool = await getPool();
    const client = await pool.connect();
    const { id } = params;
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    const suspensionCheck = await pool.query(
      'SELECT student_id FROM student_suspensions WHERE id = $1 AND school_id = $2 AND status = \'active\'',
      [id, schoolId]
    );

    if (suspensionCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Suspension record not found' }, { status: 404 });
    }

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE student_suspensions
        SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND school_id = $2
        RETURNING id, student_id, status`,
        [id, schoolId]
      );

      // Log audit
      await client.query(
        `INSERT INTO student_audit_log (
          school_id, user_id, entity_type, entity_id, action, created_at
        ) VALUES ($1, $2, 'suspension', $3, 'reactivate', CURRENT_TIMESTAMP)`,
        [schoolId, authUser.userId, suspensionCheck.rows[0].student_id]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Student reactivated successfully',
        data: result.rows[0]
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
    console.error('[Suspended PATCH]', error);
    return NextResponse.json({ error: 'Failed to reactivate student' }, { status: 500 });
  }
}
