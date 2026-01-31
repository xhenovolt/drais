/**
 * Discipline Management System API
 * Full CRUD for cases with status tracking and history
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres.js';

/**
 * GET /api/modules/students/discipline
 * List discipline cases with filtering
 */
export async function GET(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const pool = await getPool();
    const { searchParams } = new URL(request.url);

    const studentId = searchParams.get('student_id');
    const status = searchParams.get('status') || 'open';
    const severity = searchParams.get('severity');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    let whereClause = 'dc.school_id = $1';
    let params = [schoolId];
    let paramIndex = 2;

    if (studentId) {
      whereClause += ` AND dc.student_id = $${paramIndex}`;
      params.push(studentId);
      paramIndex++;
    }

    if (status) {
      whereClause += ` AND dc.investigation_status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (severity) {
      whereClause += ` AND dc.severity = $${paramIndex}`;
      params.push(severity);
      paramIndex++;
    }

    // Count
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM discipline_cases dc WHERE ${whereClause}`,
      params.slice(0, paramIndex - 1)
    );
    const total = parseInt(countResult.rows[0].total);

    // Get cases
    const result = await pool.query(
      `SELECT dc.*, s.first_name, s.last_name, s.admission_no
       FROM discipline_cases dc
       LEFT JOIN students s ON dc.student_id = s.id
       WHERE ${whereClause}
       ORDER BY dc.incident_date DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Discipline GET]', error);
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}

/**
 * POST /api/modules/students/discipline
 * Create new discipline case
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
      student_id,
      incident_type,
      severity,
      incident_date,
      incident_location,
      incident_description,
    } = body;

    if (!student_id || !incident_type || !severity || !incident_date || !incident_description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify student exists
    const student = await pool.query(
      `SELECT id FROM students WHERE id = $1 AND school_id = $2`,
      [student_id, schoolId]
    );
    if (student.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Generate case number
    const timestamp = Date.now().toString().slice(-6);
    const caseNumber = `DISC-${schoolId}-${timestamp}`;

    // Create case
    const result = await pool.query(
      `INSERT INTO discipline_cases (
        student_id, school_id, case_number, incident_type, severity,
        incident_date, incident_location, incident_description, reported_by,
        investigation_status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        student_id, schoolId, caseNumber, incident_type, severity,
        incident_date, incident_location, incident_description, authUser.userId,
        'open'
      ]
    );

    const caseRecord = result.rows[0];

    // Create history record
    await pool.query(
      `INSERT INTO discipline_case_history (case_id, action_type, action_by, action_date, new_value, notes)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5)`,
      [caseRecord.id, 'created', authUser.userId, 'open', 'Case opened']
    );

    // Audit
    await pool.query(
      `INSERT INTO student_audit_log (school_id, student_id, user_id, action, entity_type, entity_id, changes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [schoolId, student_id, authUser.userId, 'created_case', 'discipline', caseRecord.id,
       JSON.stringify({ case_number: caseNumber, severity })]
    );

    return NextResponse.json({
      success: true,
      message: 'Discipline case created',
      data: caseRecord,
    }, { status: 201 });

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Discipline POST]', error);
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}

/**
 * PATCH /api/modules/students/discipline/[id]
 * Update discipline case (resolve, update outcome, etc.)
 */
export async function PATCH(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const body = await request.json();
    const pool = await getPool();
    const client = await pool.connect();
    const schoolId = authUser.schoolId;
    const { id } = body;

    if (!schoolId || !id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
      await client.query('BEGIN');

      // Get current case
      const current = await client.query(
        `SELECT * FROM discipline_cases WHERE id = $1 AND school_id = $2`,
        [id, schoolId]
      );

      if (current.rows.length === 0) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 });
      }

      const oldCase = current.rows[0];

      // Update allowed fields
      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;

      const allowedFields = ['investigation_status', 'outcome_status', 'outcome_description',
                           'disciplinary_action', 'action_duration_days', 'action_start_date', 'action_end_date'];

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

      // If resolving, set resolved_by and resolved_date
      if (body.investigation_status === 'resolved' || body.investigation_status === 'closed') {
        updateFields.push(`resolved_date = CURRENT_DATE`);
        updateFields.push(`resolved_by = $${paramIndex}`);
        updateValues.push(authUser.userId);
        paramIndex++;
      }

      updateValues.push(id);
      updateValues.push(schoolId);

      const result = await client.query(
        `UPDATE discipline_cases SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${paramIndex} AND school_id = $${paramIndex + 1}
         RETURNING *`,
        updateValues
      );

      const updatedCase = result.rows[0];

      // Create history record
      await client.query(
        `INSERT INTO discipline_case_history (case_id, action_type, action_by, action_date, previous_value, new_value, notes)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6)`,
        [id, 'updated', authUser.userId, oldCase.investigation_status, updatedCase.investigation_status,
         body.outcome_description || '']
      );

      // Audit
      await client.query(
        `INSERT INTO student_audit_log (school_id, student_id, user_id, action, entity_type, entity_id, old_values, new_values)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [schoolId, updatedCase.student_id, authUser.userId, 'updated_case', 'discipline', id,
         JSON.stringify(oldCase), JSON.stringify(updatedCase)]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Case updated successfully',
        data: updatedCase,
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Discipline PATCH]', error);
    return NextResponse.json({ error: 'Failed to update case' }, { status: 500 });
  }
}
