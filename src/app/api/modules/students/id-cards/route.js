/**
 * ID Cards Module API
 * GET /api/modules/students/id-cards - List ID cards
 * POST /api/modules/students/id-cards - Generate ID card
 * POST /api/modules/students/id-cards/bulk - Bulk generate by class
 * 
 * DRAIS v0.0.0300 - Production Implementation
 * No fake IDs if student data missing
 * ID card includes: name, admission number, school name, photo, QR code
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres.js';

/**
 * GET /api/modules/students/id-cards
 */
export async function GET(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const pool = await getPool();
    
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');
    const classId = searchParams.get('class_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    let whereClause = 'WHERE sic.school_id = $1';
    const params = [schoolId];
    let paramIndex = 2;

    if (studentId) {
      whereClause += ` AND sic.student_id = $${paramIndex}`;
      params.push(studentId);
      paramIndex++;
    }

    if (classId) {
      whereClause += ` AND s.class_id = $${paramIndex}`;
      params.push(classId);
      paramIndex++;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM student_id_cards sic 
       LEFT JOIN students s ON sic.student_id = s.id
       ${whereClause}`,
      params.slice(0, paramIndex - ((studentId || classId) ? 2 : 1))
    );
    const total = parseInt(countResult.rows[0].total);

    const query = `
      SELECT 
        sic.id, sic.student_id, sic.card_number, sic.issue_date, sic.expiry_date,
        sic.photo_url, sic.qr_code_url, sic.barcode_url, sic.printed, sic.printed_date,
        s.first_name, s.last_name, s.admission_number,
        sc.name as school_name
      FROM student_id_cards sic
      LEFT JOIN students s ON sic.student_id = s.id
      LEFT JOIN schools sc ON sic.school_id = sc.id
      ${whereClause}
      ORDER BY sic.generated_date DESC
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
    console.error('[ID Cards GET]', error);
    return NextResponse.json({ error: 'Failed to fetch ID cards' }, { status: 500 });
  }
}

/**
 * POST /api/modules/students/id-cards
 * Generate ID card for single student
 * 
 * Body: {
 *   student_id: number,
 *   photo_url?: string,
 *   expiry_years?: number (default: 1)
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

    const { student_id, photo_url, expiry_years } = body;

    if (!student_id) {
      return NextResponse.json(
        { error: 'student_id is required' },
        { status: 400 }
      );
    }

    // Verify student exists and has required data
    const studentCheck = await pool.query(
      `SELECT first_name, last_name, admission_number 
       FROM students 
       WHERE id = $1 AND school_id = $2 AND deleted_at IS NULL`,
      [student_id, schoolId]
    );

    if (studentCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = studentCheck.rows[0];

    // Validate required data
    if (!student.first_name || !student.last_name || !student.admission_number) {
      return NextResponse.json(
        { error: 'Student data incomplete: requires first_name, last_name, and admission_number' },
        { status: 400 }
      );
    }

    try {
      await client.query('BEGIN');

      // Generate unique card number
      const yearCode = new Date().getFullYear().toString().slice(-2);
      const cardPrefix = `ID-${yearCode}-`;
      const countResult = await client.query(
        'SELECT COUNT(*) as count FROM student_id_cards WHERE school_id = $1 AND card_number LIKE $2',
        [schoolId, `${cardPrefix}%`]
      );
      const cardSeq = parseInt(countResult.rows[0].count) + 1;
      const cardNumber = `${cardPrefix}${String(cardSeq).padStart(6, '0')}`;

      // Calculate expiry date
      const issueDate = new Date();
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + (expiry_years || 1));

      const result = await client.query(
        `INSERT INTO student_id_cards (
          school_id, student_id, card_number, issue_date, expiry_date,
          photo_url, generated_by, generated_date, printed, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (student_id) DO UPDATE SET 
          card_number = EXCLUDED.card_number,
          issue_date = EXCLUDED.issue_date,
          expiry_date = EXCLUDED.expiry_date,
          photo_url = COALESCE(EXCLUDED.photo_url, student_id_cards.photo_url),
          generated_by = EXCLUDED.generated_by,
          generated_date = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, card_number, issue_date, expiry_date`,
        [
          schoolId, student_id, cardNumber, issueDate, expiryDate,
          photo_url || null, authUser.userId
        ]
      );

      // Log audit
      await client.query(
        `INSERT INTO student_audit_log (
          school_id, user_id, entity_type, entity_id, action, changes, created_at
        ) VALUES ($1, $2, 'id_card', $3, 'create', $4, CURRENT_TIMESTAMP)`,
        [
          schoolId, authUser.userId, student_id,
          JSON.stringify({ card_number: cardNumber, expiry_date: expiryDate })
        ]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'ID card generated successfully',
        data: {
          ...result.rows[0],
          student_name: `${student.first_name} ${student.last_name}`,
          admission_number: student.admission_number
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
    console.error('[ID Cards POST]', error);
    return NextResponse.json({ error: 'Failed to generate ID card' }, { status: 500 });
  }
}
