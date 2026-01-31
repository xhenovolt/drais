/**
 * Student Promotion/Demotion System API
 * Supports: Bulk promotion, Individual promotion, Demotion, Selection-based
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres.js';

/**
 * GET /api/modules/students/promotions
 * Get promotion history
 */
export async function GET(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const pool = await getPool();
    const { searchParams } = new URL(request.url);

    const studentId = searchParams.get('student_id');
    const academicYear = searchParams.get('academic_year');
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    let whereClause = 'ph.school_id = $1';
    let params = [schoolId];
    let paramIndex = 2;

    if (studentId) {
      whereClause += ` AND ph.student_id = $${paramIndex}`;
      params.push(studentId);
      paramIndex++;
    }

    if (academicYear) {
      whereClause += ` AND ph.academic_year = $${paramIndex}`;
      params.push(academicYear);
      paramIndex++;
    }

    const result = await pool.query(
      `SELECT 
        ph.*, s.first_name, s.last_name, s.admission_no,
        fc.class_name as from_class_name, ts.class_name as to_class_name
      FROM promotions_history ph
      LEFT JOIN students s ON ph.student_id = s.id
      LEFT JOIN classes fc ON ph.from_class_id = fc.id
      LEFT JOIN classes ts ON ph.to_class_id = ts.id
      WHERE ${whereClause}
      ORDER BY ph.promotion_date DESC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Promotions GET]', error);
    return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 });
  }
}

/**
 * POST /api/modules/students/promotions
 * Create promotion(s): bulk, individual, or selection-based
 * Atomic transaction - all or nothing
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

    const {
      promotion_type, // 'bulk', 'individual', 'selection'
      student_ids,    // For individual/selection
      from_class_id,  // For bulk
      to_class_id,    // Target class
      academic_year,
      reason,
    } = body;

    if (!promotion_type || !to_class_id) {
      return NextResponse.json(
        { error: 'promotion_type and to_class_id are required' },
        { status: 400 }
      );
    }

    let targetStudents = [];

    try {
      await client.query('BEGIN');

      // Determine which students to promote
      if (promotion_type === 'bulk' && from_class_id) {
        // Get all active students from the source class
        const result = await client.query(
          `SELECT id FROM students WHERE class_id = $1 AND school_id = $2 AND status = 'active'`,
          [from_class_id, schoolId]
        );
        targetStudents = result.rows.map(r => r.id);

      } else if (promotion_type === 'individual' && student_ids && student_ids.length > 0) {
        targetStudents = student_ids;

      } else if (promotion_type === 'selection' && student_ids && student_ids.length > 0) {
        targetStudents = student_ids;

      } else {
        throw new Error('Invalid promotion parameters');
      }

      if (targetStudents.length === 0) {
        return NextResponse.json(
          { error: 'No students found to promote' },
          { status: 400 }
        );
      }

      const promotedStudents = [];

      // Promote each student
      for (const studentId of targetStudents) {
        // Get current class info
        const current = await client.query(
          `SELECT class_id, section_id FROM students WHERE id = $1 AND school_id = $2`,
          [studentId, schoolId]
        );

        if (current.rows.length === 0) continue;

        const fromClassId = current.rows[0].class_id;
        const fromSectionId = current.rows[0].section_id;

        // Determine demotion vs promotion
        let pType = 'promotion';
        if (from_class_id && from_class_id > to_class_id) {
          pType = 'demotion';
        }

        // Record promotion history
        const promResult = await client.query(
          `INSERT INTO promotions_history (
            student_id, school_id, from_class_id, from_section_id, to_class_id,
            promotion_type, academic_year, reason, approved_by, approval_date, promotion_date
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          RETURNING *`,
          [studentId, schoolId, fromClassId, fromSectionId, to_class_id, pType, academic_year || '2026', reason, authUser.userId]
        );

        // Update student class (actual promotion)
        await client.query(
          `UPDATE students SET class_id = $1, section_id = NULL, roll_no = NULL, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2 AND school_id = $3`,
          [to_class_id, studentId, schoolId]
        );

        // Audit log
        await client.query(
          `INSERT INTO student_audit_log (school_id, student_id, user_id, action, entity_type, entity_id, changes)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [schoolId, studentId, authUser.userId, 'promoted', 'promotion', promResult.rows[0].id,
           JSON.stringify({
             from_class_id: fromClassId,
             to_class_id: to_class_id,
             type: pType,
           })]
        );

        promotedStudents.push(promResult.rows[0]);
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: `${promotedStudents.length} student(s) promoted successfully`,
        data: promotedStudents,
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
    console.error('[Promotions POST]', error);
    return NextResponse.json({ error: 'Failed to process promotions' }, { status: 500 });
  }
}
