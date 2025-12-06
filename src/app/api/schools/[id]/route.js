/**
 * Get School by ID Endpoint
 * GET /api/schools/[id]
 */

import db from '@/lib/db';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api/responses';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return errorResponse('School ID is required', 400);
    }

    // Find school
    const school = await db.findOne(
      'school',
      'id = ? AND deleted_at IS NULL',
      [id]
    );

    if (!school) {
      return notFoundResponse('School not found');
    }

    // Parse JSON fields
    if (school.settings && typeof school.settings === 'string') {
      try {
        school.settings = JSON.parse(school.settings);
      } catch (e) {
        school.settings = {};
      }
    }

    // Get stats
    const stats = {
      total_students: await db.count('student', 'school_id = ? AND deleted_at IS NULL', [id]),
      total_teachers: await db.count('teacher', 'school_id = ? AND deleted_at IS NULL', [id]),
      total_staff: await db.count('staff', 'school_id = ? AND deleted_at IS NULL', [id]),
      total_classes: await db.count('class', 'school_id = ? AND deleted_at IS NULL', [id]),
    };

    return successResponse(
      {
        school,
        stats,
      },
      'School retrieved successfully'
    );
  } catch (error) {
    console.error('Get school error:', error);
    return errorResponse('Failed to retrieve school', 500, { message: error.message });
  }
}
