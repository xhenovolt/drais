/**
 * Individual Student Endpoint
 * GET /api/modules/students/admissions/[id] - Get student details
 * PATCH /api/modules/students/admissions/[id] - Edit student details
 * DELETE /api/modules/students/admissions/[id] - Soft delete (mark as left)
 * 
 * DRAIS v0.0.0300 - Production Implementation
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres.js';

/**
 * GET /api/modules/students/admissions/[id]
 */
export async function GET(request, { params }) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const pool = await getPool();
    const { id } = params;
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT 
        s.id, s.school_id, s.admission_number, s.first_name, s.middle_name, s.last_name,
        s.gender, s.date_of_birth, s.class_id, s.stream_id, s.status, s.enrollment_date,
        s.guardian_name, s.guardian_phone, s.guardian_email, s.address,
        c.name as class_name,
        (SELECT COALESCE(SUM(
          CASE 
            WHEN transaction_type = 'credit' THEN amount
            WHEN transaction_type = 'debit' THEN -amount
          END
        ), 0) FROM student_transactions WHERE student_id = s.id AND school_id = $2) as pocket_money_balance,
        s.created_at, s.updated_at
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE s.id = $1 AND s.school_id = $2 AND s.deleted_at IS NULL`,
      [id, schoolId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Student GET]', error);
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
  }
}

/**
 * PATCH /api/modules/students/admissions/[id]
 * Edit student details
 */
export async function PATCH(request, { params }) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const body = await request.json();
    const pool = await getPool();
    const client = await pool.connect();

    const { id } = params;
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    // Verify student exists and belongs to school
    const checkResult = await pool.query(
      'SELECT * FROM students WHERE id = $1 AND school_id = $2 AND deleted_at IS NULL',
      [id, schoolId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const oldData = checkResult.rows[0];

    try {
      await client.query('BEGIN');

      // Update student
      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;

      const allowedFields = [
        'first_name', 'middle_name', 'last_name', 'gender',
        'date_of_birth', 'class_id', 'stream_id', 'status',
        'guardian_name', 'guardian_phone', 'guardian_email', 'address'
      ];

      for (const field of allowedFields) {
        if (field in body && body[field] !== undefined) {
          updateFields.push(`${field} = $${paramIndex}`);
          updateValues.push(body[field]);
          paramIndex++;
        }
      }

      if (updateFields.length === 0) {
        return NextResponse.json(
          { error: 'No fields to update' },
          { status: 400 }
        );
      }

      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      updateValues.push(id, schoolId);

      const updateQuery = `
        UPDATE students SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex} AND school_id = $${paramIndex + 1}
        RETURNING id, admission_number, first_name, last_name, status, updated_at
      `;

      const updateResult = await client.query(updateQuery, updateValues);

      // Log audit
      await client.query(
        `INSERT INTO student_audit_log (
          school_id, user_id, entity_type, entity_id, action, changes, created_at
        ) VALUES ($1, $2, 'student', $3, 'update', $4, CURRENT_TIMESTAMP)`,
        [
          schoolId,
          authUser.userId,
          id,
          JSON.stringify({
            before: oldData,
            after: body
          })
        ]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Student updated successfully',
        data: updateResult.rows[0]
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
    console.error('[Student PATCH]', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

/**
 * DELETE /api/modules/students/admissions/[id]
 * Soft delete - mark as left/expelled/graduated
 */
export async function DELETE(request, { params }) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const pool = await getPool();
    const client = await pool.connect();
    
    const { id } = params;
    const schoolId = authUser.schoolId;
    const { reason } = await request.json();

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    // Verify student exists
    const checkResult = await pool.query(
      'SELECT * FROM students WHERE id = $1 AND school_id = $2 AND deleted_at IS NULL',
      [id, schoolId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    try {
      await client.query('BEGIN');

      // Soft delete
      await client.query(
        `UPDATE students 
        SET deleted_at = CURRENT_TIMESTAMP, status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND school_id = $3`,
        [reason || 'left', id, schoolId]
      );

      // Log audit
      await client.query(
        `INSERT INTO student_audit_log (
          school_id, user_id, entity_type, entity_id, action, reason, created_at
        ) VALUES ($1, $2, 'student', $3, 'delete', $4, CURRENT_TIMESTAMP)`,
        [schoolId, authUser.userId, id, reason || 'Student record deleted']
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Student record deleted successfully'
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
    console.error('[Student DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
