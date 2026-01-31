/**
 * Alumni Management API
 * Supports: Manual entry, Automatic detection, Search, Report
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres.js';

/**
 * GET /api/modules/students/alumni
 * List alumni with search and filter
 */
export async function GET(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const pool = await getPool();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || '';
    const completionYear = searchParams.get('year');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    let whereClause = 'ar.school_id = $1 AND ar.alumni_status = \'active\'';
    let params = [schoolId];
    let paramIndex = 2;

    if (search) {
      whereClause += ` AND (ar.full_name ILIKE $${paramIndex} OR ar.email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (completionYear) {
      whereClause += ` AND ar.completion_year = $${paramIndex}`;
      params.push(completionYear);
      paramIndex++;
    }

    // Count total
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM alumni_records ar WHERE ${whereClause}`,
      params.slice(0, paramIndex - (search ? 1 : 0) - (completionYear ? 1 : 0) + 1)
    );
    const total = parseInt(countResult.rows[0].total);

    // Get alumni
    const result = await pool.query(
      `SELECT ar.* FROM alumni_records ar
       WHERE ${whereClause}
       ORDER BY ar.completion_year DESC, ar.full_name ASC
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
    console.error('[Alumni GET]', error);
    return NextResponse.json({ error: 'Failed to fetch alumni' }, { status: 500 });
  }
}

/**
 * POST /api/modules/students/alumni
 * Create alumni record (manual or automatic from student)
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
      student_id,      // For automatic from student
      full_name,       // For manual entry
      email,
      phone,
      final_class,
      completion_year,
      graduation_date,
      contact_address,
      contact_city,
      contact_country,
      current_occupation,
      current_employer,
    } = body;

    if (!full_name && !student_id) {
      return NextResponse.json(
        { error: 'Either student_id or full_name is required' },
        { status: 400 }
      );
    }

    if (!completion_year) {
      return NextResponse.json(
        { error: 'Completion year is required' },
        { status: 400 }
      );
    }

    try {
      let studentRecord = null;

      // If student_id provided, get student info
      if (student_id) {
        const studentResult = await pool.query(
          `SELECT first_name, last_name, email, phone, class_id FROM students WHERE id = $1 AND school_id = $2`,
          [student_id, schoolId]
        );
        if (studentResult.rows.length === 0) {
          return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }
        studentRecord = studentResult.rows[0];
      }

      // Create alumni record
      const result = await pool.query(
        `INSERT INTO alumni_records (
          student_id, school_id, full_name, email, phone, final_class,
          completion_year, graduation_date, contact_address, contact_city,
          contact_country, current_occupation, current_employer, created_by, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP)
        RETURNING *`,
        [
          student_id || null,
          schoolId,
          full_name || (studentRecord ? `${studentRecord.first_name} ${studentRecord.last_name}` : null),
          email || studentRecord?.email || null,
          phone || studentRecord?.phone || null,
          final_class,
          completion_year,
          graduation_date,
          contact_address,
          contact_city,
          contact_country,
          current_occupation,
          current_employer,
          authUser.userId,
        ]
      );

      // If from student, mark student as alumni
      if (student_id) {
        await pool.query(
          `UPDATE students SET status = 'alumni' WHERE id = $1`,
          [student_id]
        );
      }

      // Audit
      await pool.query(
        `INSERT INTO student_audit_log (school_id, student_id, user_id, action, entity_type, entity_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [schoolId, student_id, authUser.userId, 'created_alumni', 'alumni', result.rows[0].id]
      );

      return NextResponse.json({
        success: true,
        message: 'Alumni record created successfully',
        data: result.rows[0],
      }, { status: 201 });

    } catch (error) {
      throw error;
    }

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Alumni POST]', error);
    return NextResponse.json({ error: 'Failed to create alumni record' }, { status: 500 });
  }
}
