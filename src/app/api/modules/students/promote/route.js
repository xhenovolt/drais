/**
 * Promote Students Module API
 * GET /api/modules/students/promote - Get eligible students
 * POST /api/modules/students/promote - Promote individual or bulk
 * 
 * DRAIS v0.0.0300 - Production Implementation
 * Promotion updates class_id, not identity
 * Alumni/suspended students cannot be promoted
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres.js';

/**
 * GET /api/modules/students/promote
 * Get students eligible for promotion
 */
export async function GET(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const pool = await getPool();
    
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('class_id');
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    if (!classId) {
      return NextResponse.json(
        { error: 'class_id parameter is required' },
        { status: 400 }
      );
    }

    // Get eligible students (active, not alumni, not suspended)
    const query = `
      SELECT 
        s.id, s.admission_number, s.first_name, s.last_name,
        s.class_id, c.name as class_name,
        s.status, s.enrollment_date,
        COUNT(sd.id) as discipline_count
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN student_discipline sd ON s.id = sd.student_id
      WHERE s.school_id = $1 
        AND s.class_id = $2
        AND s.status = 'active'
        AND s.deleted_at IS NULL
      GROUP BY s.id, s.admission_number, s.first_name, s.last_name,
               s.class_id, c.name, s.status, s.enrollment_date
      ORDER BY s.admission_number ASC
    `;

    const result = await pool.query(query, [schoolId, classId]);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Promote GET]', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

/**
 * POST /api/modules/students/promote
 * Promote single or bulk students
 * 
 * Body: {
 *   promotion_type: 'bulk' | 'individual',
 *   from_class_id: number,
 *   to_class_id: number,
 *   student_ids?: [number], (for bulk)
 *   student_id?: number, (for individual)
 *   academic_year?: string,
 *   reason?: string
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

    const { 
      promotion_type, from_class_id, to_class_id, 
      student_ids, student_id, academic_year, reason 
    } = body;

    // Validation
    if (!promotion_type || !from_class_id || !to_class_id) {
      return NextResponse.json(
        { error: 'promotion_type, from_class_id, and to_class_id are required' },
        { status: 400 }
      );
    }

    if (!['bulk', 'individual'].includes(promotion_type)) {
      return NextResponse.json(
        { error: 'promotion_type must be bulk or individual' },
        { status: 400 }
      );
    }

    // Determine students to promote
    let studentsToPromote = [];
    if (promotion_type === 'individual') {
      if (!student_id) {
        return NextResponse.json(
          { error: 'student_id is required for individual promotion' },
          { status: 400 }
        );
      }
      studentsToPromote = [student_id];
    } else {
      if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
        return NextResponse.json(
          { error: 'student_ids array is required for bulk promotion' },
          { status: 400 }
        );
      }
      studentsToPromote = student_ids;
    }

    // Verify destination class exists
    const classCheck = await pool.query(
      'SELECT id FROM classes WHERE id = $1 AND school_id = $2',
      [to_class_id, schoolId]
    );

    if (classCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Destination class not found' },
        { status: 404 }
      );
    }

    try {
      await client.query('BEGIN');

      const promotedStudents = [];
      const errors = [];

      for (const studentId of studentsToPromote) {
        try {
          // Check student status
          const studentCheck = await client.query(
            `SELECT id, status, class_id, first_name, last_name 
            FROM students 
            WHERE id = $1 AND school_id = $2 AND deleted_at IS NULL`,
            [studentId, schoolId]
          );

          if (studentCheck.rows.length === 0) {
            errors.push({ student_id: studentId, error: 'Student not found' });
            continue;
          }

          const student = studentCheck.rows[0];

          // Check if student can be promoted
          if (!['active'].includes(student.status)) {
            errors.push({
              student_id: studentId,
              error: `Cannot promote ${student.status} student`
            });
            continue;
          }

          // Update student class
          await client.query(
            'UPDATE students SET class_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [to_class_id, studentId]
          );

          // Create promotion record
          await client.query(
            `INSERT INTO student_promotions (
              school_id, student_id, from_class_id, to_class_id,
              promotion_date, academic_year, promotion_reason, promoted_by,
              created_at
            ) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7, CURRENT_TIMESTAMP)`,
            [
              schoolId, studentId, student.class_id, to_class_id,
              academic_year || null, reason || null, authUser.userId
            ]
          );

          promotedStudents.push({
            student_id: studentId,
            name: `${student.first_name} ${student.last_name}`,
            status: 'promoted'
          });

          // Log audit
          await client.query(
            `INSERT INTO student_audit_log (
              school_id, user_id, entity_type, entity_id, action, changes, created_at
            ) VALUES ($1, $2, 'student', $3, 'promote', $4, CURRENT_TIMESTAMP)`,
            [
              schoolId, authUser.userId, studentId,
              JSON.stringify({
                from_class_id: student.class_id,
                to_class_id,
                academic_year
              })
            ]
          );

        } catch (err) {
          errors.push({
            student_id: studentId,
            error: err.message
          });
        }
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: `${promotedStudents.length} student(s) promoted successfully`,
        data: {
          promoted: promotedStudents,
          errors: errors.length > 0 ? errors : undefined,
          summary: {
            total: studentsToPromote.length,
            promoted: promotedStudents.length,
            failed: errors.length
          }
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
    console.error('[Promote POST]', error);
    return NextResponse.json({ error: 'Failed to promote students' }, { status: 500 });
  }
}
