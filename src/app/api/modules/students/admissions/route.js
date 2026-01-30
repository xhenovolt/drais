/**
 * Admissions Module API
 * GET /api/modules/students/admissions - List all students
 * POST /api/modules/students/admissions - Create new student admission
 * 
 * DRAIS v0.0.0300 - Production Implementation
 * 
 * Database Schema: students table contains all student data directly
 * - admission_no, first_name, last_name, dob, gender, email, phone, address, photo_url, status
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres.js';

/**
 * GET /api/modules/students/admissions
 * List all students with pagination and search
 * 
 * Query params:
 *   page: number (default 1)
 *   limit: number (default 50)
 *   search: string (searches first_name, last_name, admission_no)
 *   class_id: number (optional filter)
 */
export async function GET(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const pool = await getPool();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const classId = searchParams.get('class_id') || null;
    const offset = (page - 1) * limit;
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    let whereClause = 'WHERE s.school_id = $1';
    const params = [schoolId];
    let paramIndex = 2;

    // Search by name or admission number
    if (search) {
      whereClause += ` AND (s.first_name ILIKE $${paramIndex} OR s.last_name ILIKE $${paramIndex} OR s.admission_no ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Filter by class
    if (classId) {
      whereClause += ` AND s.class_id = $${paramIndex}`;
      params.push(classId);
      paramIndex++;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM students s ${whereClause}`;
    const countParams = params.slice(0, paramIndex);
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results - all fields from students table
    const query = `
      SELECT 
        s.id,
        s.admission_no,
        s.first_name,
        s.last_name,
        s.dob as date_of_birth,
        s.gender,
        s.email,
        s.phone,
        s.address,
        s.photo_url,
        s.class_id,
        s.section_id,
        s.roll_no,
        s.status,
        s.created_at as enrollment_date,
        s.updated_at
      FROM students s
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const queryParams = [...params, limit, offset];
    const result = await pool.query(query, queryParams);

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
    console.error('[Admissions GET]', error);
    return NextResponse.json({ error: 'Failed to fetch students', details: error.message }, { status: 500 });
  }
}

/**
 * POST /api/modules/students/admissions
 * Create new student admission
 * 
 * Body: {
 *   first_name: string (required),
 *   last_name: string (required),
 *   gender: string (male|female|other),
 *   date_of_birth: date,
 *   email: string,
 *   phone: string,
 *   address: string,
 *   photo_url: string,
 *   class_id: number (optional),
 *   section_id: number (optional),
 *   admission_no: string (auto-generated if not provided)
 * }
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
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      phone,
      address,
      photo_url,
      class_id,
      section_id,
      admission_no: providedAdmissionNo
    } = body;

    // Validate required fields
    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: 'first_name and last_name are required' },
        { status: 400 }
      );
    }

    // Generate admission_no if not provided
    let admission_no = providedAdmissionNo;
    if (!admission_no) {
      const year = new Date().getFullYear().toString().slice(-2);
      const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
      admission_no = `ADM-${year}-${randomNum}`;
    }

    // Check uniqueness of admission_no for this school
    const checkResult = await pool.query(
      'SELECT id FROM students WHERE school_id = $1 AND admission_no = $2',
      [schoolId, admission_no]
    );

    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Admission number already exists for this school' },
        { status: 409 }
      );
    }

    // Create student record
    const result = await pool.query(
      `INSERT INTO students (
        school_id, admission_no, first_name, last_name,
        gender, dob, email, phone, address, photo_url,
        class_id, section_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'active')
      RETURNING id, admission_no, first_name, last_name, gender, dob, email, phone, address, photo_url, class_id, section_id, status, created_at`,
      [
        schoolId,
        admission_no,
        first_name.trim(),
        last_name.trim(),
        gender || null,
        date_of_birth || null,
        email || null,
        phone || null,
        address || null,
        photo_url || null,
        class_id || null,
        section_id || null
      ]
    );

    const student = result.rows[0];

    // Return mapped response
    return NextResponse.json({
      success: true,
      data: {
        id: student.id,
        admission_no: student.admission_no,
        first_name: student.first_name,
        last_name: student.last_name,
        gender: student.gender,
        date_of_birth: student.dob,
        email: student.email,
        phone: student.phone,
        address: student.address,
        photo_url: student.photo_url,
        class_id: student.class_id,
        section_id: student.section_id,
        status: student.status,
        enrollment_date: student.created_at
      }
    }, { status: 201 });

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Admissions POST]', error);
    return NextResponse.json({ error: 'Failed to create student', details: error.message }, { status: 500 });
  }
}
