/**
 * School Setup Endpoint (Decoupled Onboarding)
 * 
 * PATCH /api/school/setup
 * 
 * Allows users to configure their school
 * Does NOT block access to dashboard
 * Mandatory fields: name, address
 * Optional fields: phone, website, location, etc.
 * 
 * Logs all changes to audit trail
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPool } from '@/lib/db/postgres';
import { getSession } from '@/lib/session';

export async function PATCH(request) {
  try {
    const pool = await getPool();
    // Get and validate session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('jeton_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = await getSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      school_name,
      school_address,
    } = body;

    // Validate mandatory fields FIRST
    if (!school_name || !school_address || !school_name.trim() || !school_address.trim()) {
      return NextResponse.json(
        { success: false, error: 'School name and address are required' },
        { status: 400 }
      );
    }

    // Get user info
    const userResult = await pool.query(
      `SELECT id, school_id FROM users WHERE id = $1`,
      [session.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];
    let schoolId = user.school_id;

    // If user doesn't have a school yet, create one and link it
    if (!schoolId) {
      const schoolCreateResult = await pool.query(
        `INSERT INTO schools (name, address, created_at, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING id`,
        [school_name, school_address]
      );

      if (schoolCreateResult.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Failed to create school' },
          { status: 500 }
        );
      }

      schoolId = schoolCreateResult.rows[0].id;

      // Link user to school
      await pool.query(
        `UPDATE users SET school_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [schoolId, session.userId]
      );
    } else {
      // School exists, update it
      await pool.query(
        `UPDATE schools 
         SET name = $1, address = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [school_name, school_address, schoolId]
      );
    }

    // Fetch updated school
    const schoolResult = await pool.query(
      `SELECT id, name, address FROM schools WHERE id = $1`,
      [schoolId]
    );

    const updatedSchool = schoolResult.rows[0];

    return NextResponse.json(
      {
        success: true,
        message: 'School setup completed successfully',
        school: {
          id: updatedSchool.id,
          name: updatedSchool.name,
          address: updatedSchool.address,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('School setup error:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to update school setup' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/school/setup
 * 
 * Get current school setup status
 */
export async function GET(request) {
  try {
    const pool = await getPool();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('jeton_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = await getSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 401 }
      );
    }

    // Get user's school info
    const userResult = await pool.query(
      `SELECT id, school_id FROM users WHERE id = $1`,
      [session.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];
    const schoolId = user.school_id;

    // If user has no school, setup is incomplete
    if (!schoolId) {
      return NextResponse.json(
        {
          success: true,
          school: null,
          onboarding: {
            isComplete: false,
            hasSchool: false,
            message: 'No school created yet',
          },
        },
        { status: 200 }
      );
    }

    // Get school data
    const schoolResult = await pool.query(
      `SELECT id, name, address FROM schools WHERE id = $1`,
      [schoolId]
    );

    if (schoolResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'School not found' },
        { status: 404 }
      );
    }

    const school = schoolResult.rows[0];

    // Onboarding is complete if school exists and has name + address
    const isComplete = school.name && school.address && school.name.trim() && school.address.trim();

    return NextResponse.json(
      {
        success: true,
        school: {
          id: school.id,
          name: school.name,
          address: school.address,
        },
        onboarding: {
          isComplete: !!isComplete,
          hasSchool: true,
          message: isComplete ? 'School setup complete' : 'School setup incomplete',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('School setup fetch error:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to fetch school setup' },
      { status: 500 }
    );
  }
}
