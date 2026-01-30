/**
 * Discipline Module API
 * GET /api/modules/students/discipline - List incidents
 * POST /api/modules/students/discipline - Record incident
 * 
 * DRAIS v0.0.0300 - Production Implementation
 * Discipline records are auditable
 * Discipline does NOT auto-suspend
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres.js';

/**
 * GET /api/modules/students/discipline
 */
export async function GET(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const pool = await getPool();
    
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    let whereClause = 'WHERE sd.school_id = $1';
    const params = [schoolId];
    let paramIndex = 2;

    if (studentId) {
      whereClause += ` AND sd.student_id = $${paramIndex}`;
      params.push(studentId);
      paramIndex++;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM student_discipline sd ${whereClause}`,
      params.slice(0, paramIndex - (studentId ? 2 : 1))
    );
    const total = parseInt(countResult.rows[0].total);

    const query = `
      SELECT 
        sd.id, sd.student_id, sd.incident_type, sd.description,
        sd.incident_date, sd.action_taken, sd.severity, sd.is_resolved,
        s.first_name, s.last_name, s.admission_number,
        sd.created_at
      FROM student_discipline sd
      LEFT JOIN students s ON sd.student_id = s.id
      ${whereClause}
      ORDER BY sd.incident_date DESC
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
    console.error('[Discipline GET]', error);
    return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
  }
}

/**
 * POST /api/modules/students/discipline
 * Record a disciplinary incident
 * 
 * Body: {
 *   student_id: number,
 *   incident_type: string,
 *   description: string,
 *   incident_date: date,
 *   action_taken: string,
 *   severity: 'minor' | 'moderate' | 'severe'
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

    const { student_id, incident_type, description, incident_date, action_taken, severity } = body;

    if (!student_id || !incident_type || !description || !incident_date) {
      return NextResponse.json(
        { error: 'student_id, incident_type, description, and incident_date are required' },
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
        `INSERT INTO student_discipline (
          school_id, student_id, incident_type, description,
          incident_date, action_taken, severity, responsible_staff_id,
          is_resolved, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, incident_type, severity, created_at`,
        [
          schoolId, student_id, incident_type, description,
          incident_date, action_taken || null, severity || 'minor',
          authUser.userId
        ]
      );

      // Log audit
      await client.query(
        `INSERT INTO student_audit_log (
          school_id, user_id, entity_type, entity_id, action, changes, created_at
        ) VALUES ($1, $2, 'discipline', $3, 'create', $4, CURRENT_TIMESTAMP)`,
        [
          schoolId, authUser.userId, student_id,
          JSON.stringify({
            incident_type,
            severity,
            incident_date
          })
        ]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Disciplinary incident recorded',
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
    console.error('[Discipline POST]', error);
    return NextResponse.json({ error: 'Failed to record incident' }, { status: 500 });
  }
}
