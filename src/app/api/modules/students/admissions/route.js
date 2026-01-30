/**
 * Admissions Module API
 * GET /api/modules/students/admissions - List all students
 * POST /api/modules/students/admissions - Create new student admission
 * 
 * DRAIS v0.0.0300 - Production Implementation
 * 
 * Database Schema:
 *   students table: Contains student academic placement (links to people via person_id)
 *   people table: Contains personal/demographic data
 *   enrollments table: Tracks enrollment in specific academic year/term
 * 
 * Transaction: Creates person → student → enrollment records
 * Response: Maps DB fields to consistent API contract
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
 *   search: string (searches first_name, last_name, admission_number)
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
      whereClause += ` AND (p.first_name ILIKE $${paramIndex} OR p.last_name ILIKE $${paramIndex} OR s.admission_number ILIKE $${paramIndex})`;
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
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM students s 
      LEFT JOIN people p ON s.person_id = p.id 
      ${whereClause}
    `;
    const countParams = params.slice(0, paramIndex);
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results with field mapping
    // Note: Joins people table to get personal details, classes table for class name
    const query = `
      SELECT 
        s.id,
        s.admission_number,
        p.first_name,
        p.last_name,
        p.date_of_birth,
        p.gender,
        p.email,
        p.phone,
        p.address,
        p.profile_image_url as photo_url,
        s.class_id,
        c.class_name as class_name,
        s.section_id,
        s.stream_id,
        CASE WHEN s.is_active = true AND s.date_of_discharge IS NULL 
          THEN 'active' ELSE 'inactive' END as status,
        s.created_at as enrollment_date,
        s.updated_at
      FROM students s
      LEFT JOIN people p ON s.person_id = p.id
      LEFT JOIN classes c ON s.class_id = c.id
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
 * Create new student (person + student + enrollment)
 * 
 * Body: {
 *   first_name: string (required),
 *   last_name: string (required),
 *   gender: string (male|female|other),
 *   date_of_birth: date,
 *   email: string,
 *   phone: string,
 *   address: string,
 *   profile_image_url: string,
 *   class_id: number (optional),
 *   section_id: number (optional),
 *   stream_id: number (optional),
 *   admission_number: string (auto-generated if not provided)
 * }
 * 
 * Transaction:
 *   1. Insert person record (demographics)
 *   2. Insert student record (academic placement, links to person)
 *   3. Insert enrollment record (if class_id provided)
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
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      phone,
      address,
      profile_image_url,
      class_id,
      section_id,
      stream_id,
      admission_number: providedAdmissionNumber
    } = body;

    // Validate required fields
    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: 'first_name and last_name are required' },
        { status: 400 }
      );
    }

    try {
      await client.query('BEGIN');

      // 1. Create person record with demographics
      const personResult = await client.query(
        `INSERT INTO people (
          school_id, first_name, last_name, gender, date_of_birth, 
          email, phone, address, profile_image_url, is_active,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id`,
        [
          schoolId,
          first_name,
          last_name,
          gender || null,
          date_of_birth || null,
          email || null,
          phone || null,
          address || null,
          profile_image_url || null
        ]
      );

      const personId = personResult.rows[0].id;

      // 2. Generate admission number if not provided
      let admissionNumber = providedAdmissionNumber;
      if (!admissionNumber) {
        const year = new Date().getFullYear().toString().slice(-2);
        const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        admissionNumber = `ADM-${year}-${randomNum}`;
      }

      // 3. Create student record (academic placement)
      const studentResult = await client.query(
        `INSERT INTO students (
          school_id, person_id, admission_number, class_id, section_id, stream_id,
          is_active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, admission_number, created_at`,
        [schoolId, personId, admissionNumber, class_id || null, section_id || null, stream_id || null]
      );

      const student = studentResult.rows[0];

      // 4. Create enrollment record if class_id provided
      if (class_id) {
        await client.query(
          `INSERT INTO enrollments (
            school_id, student_id, class_id, section_id,
            enrollment_status, enrollment_date,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, 'active', CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [schoolId, student.id, class_id, section_id || null]
        );
      }

      await client.query('COMMIT');

      // Return mapped response
      return NextResponse.json({
        success: true,
        data: {
          id: student.id,
          admission_number: student.admission_number,
          first_name,
          last_name,
          gender: gender || null,
          date_of_birth: date_of_birth || null,
          email: email || null,
          phone: phone || null,
          address: address || null,
          photo_url: profile_image_url || null,
          class_id: class_id || null,
          section_id: section_id || null,
          stream_id: stream_id || null,
          status: 'active',
          enrollment_date: student.created_at
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
    console.error('[Admissions POST]', error);
    return NextResponse.json({ error: 'Failed to create student', details: error.message }, { status: 500 });
  }
}
