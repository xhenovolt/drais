/**
 * Create School Endpoint
 * POST /api/schools/create
 */

import db from '@/lib/db';
import { hashPassword, generateToken, requireAuth } from '@/lib/auth/jwt';
import { createSchoolSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api/responses';
import { nanoid } from 'nanoid';

export async function POST(request) {
  try {
    // Optional: Require super admin authentication
    // const authResult = await requireAuth(request, ['super_admin']);
    // if (!authResult.success) {
    //   return authResult.response;
    // }

    const body = await request.json();
    
    // Validate input
    const validation = createSchoolSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    const data = validation.data;

    // Check if school code already exists
    const existingSchool = await db.findOne(
      'school',
      'school_code = ? AND deleted_at IS NULL',
      [data.school_code]
    );

    if (existingSchool) {
      return errorResponse('School code already exists', 409);
    }

    // Check if owner email already exists
    const existingUser = await db.findOne(
      'user',
      'email = ? AND deleted_at IS NULL',
      [data.owner_email]
    );

    if (existingUser) {
      return errorResponse('Owner email already registered', 409);
    }

    // Use transaction to create school and owner
    const result = await db.transaction(async (connection) => {
      // Generate school ID
      const schoolId = nanoid(16);

      // Create school
      const schoolData = {
        id: schoolId,
        school_code: data.school_code,
        name: data.school_name,
        address: data.school_address || null,
        city: data.school_city || null,
        state: data.school_state || null,
        country: data.school_country || 'Uganda',
        postal_code: data.school_postal_code || null,
        phone: data.school_phone || null,
        email: data.school_email || null,
        website: data.school_website || null,
        logo_url: data.school_logo_url || null,
        subscription_type: data.subscription_type || 'trial',
        subscription_start_date: data.subscription_start_date || new Date(),
        subscription_end_date: data.subscription_end_date || null,
        is_active: true,
        settings: JSON.stringify(data.settings || {}),
        created_at: new Date(),
        updated_at: new Date(),
      };

      const schoolInsertId = await db.insert('school', schoolData);

      // Create owner user
      const passwordHash = await hashPassword(data.owner_password);
      const userId = nanoid(16);

      const userData = {
        id: userId,
        school_id: schoolId,
        email: data.owner_email,
        password_hash: passwordHash,
        first_name: data.owner_first_name,
        last_name: data.owner_last_name,
        other_names: data.owner_other_names || null,
        phone: data.owner_phone || null,
        role: 'school_admin',
        is_active: true,
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const userInsertId = await db.insert('user', userData);

      // Fetch created school
      const createdSchool = await db.findOne('school', 'id = ?', [schoolId]);

      // Fetch created user (without password)
      const createdUser = await db.findOne(
        'user',
        'id = ?',
        [userId]
      );
      delete createdUser.password_hash;

      return { school: createdSchool, owner: createdUser };
    });

    // Generate JWT for owner
    const token = generateToken({
      userId: result.owner.id,
      email: result.owner.email,
      role: result.owner.role,
      schoolId: result.school.id,
    });

    return successResponse(
      {
        school: result.school,
        owner: result.owner,
        token,
      },
      'School created successfully',
      201
    );
  } catch (error) {
    console.error('Create school error:', error);
    return errorResponse('Failed to create school', 500, { message: error.message });
  }
}
