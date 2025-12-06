/**
 * Users Endpoints
 * GET /api/users - List users
 * POST /api/users - Create user
 * 
 * Supports pagination, filtering by school, role, and search
 */

import db from '@/lib/db';
import { requireAuth, hashPassword } from '@/lib/auth/jwt';
import { createUserSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api/responses';
import { nanoid } from 'nanoid';

export async function GET(request) {
  try {
    // Require authentication
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { user } = authResult;
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Filters
    const schoolId = searchParams.get('school_id') || user.schoolId;
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const isActive = searchParams.get('is_active');

    // Build where clause
    let where = 'deleted_at IS NULL';
    const params = [];

    // School admins can only see their school users
    if (user.role === 'school_admin' && schoolId) {
      where += ' AND school_id = ?';
      params.push(schoolId);
    } else if (schoolId) {
      where += ' AND school_id = ?';
      params.push(schoolId);
    }

    if (role) {
      where += ' AND role = ?';
      params.push(role);
    }

    if (isActive !== null && isActive !== undefined) {
      where += ' AND is_active = ?';
      params.push(isActive === 'true' ? 1 : 0);
    }

    if (search) {
      where += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Get total count
    const total = await db.count('user', where, params);

    // Get users
    const users = await db.findMany('user', {
      where,
      params,
      orderBy: 'created_at DESC',
      limit,
      offset,
    });

    // Remove sensitive data
    users.forEach(user => {
      delete user.password_hash;
      delete user.two_factor_secret;
    });

    return successResponse(
      {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: offset + users.length < total,
        },
      },
      'Users retrieved successfully'
    );
  } catch (error) {
    console.error('List users error:', error);
    return errorResponse('Failed to retrieve users', 500, { message: error.message });
  }
}

export async function POST(request) {
  try {
    // Require authentication
    const authResult = await requireAuth(request, ['super_admin', 'school_admin']);
    if (!authResult.success) {
      return authResult.response;
    }

    const { user: currentUser } = authResult;
    const body = await request.json();

    // Validate input
    const validation = createUserSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    const data = validation.data;

    // School admins can only create users for their school
    if (currentUser.role === 'school_admin' && data.school_id !== currentUser.schoolId) {
      return errorResponse('You can only create users for your school', 403);
    }

    // Check if email already exists
    const existingUser = await db.findOne(
      'user',
      'email = ? AND deleted_at IS NULL',
      [data.email]
    );

    if (existingUser) {
      return errorResponse('Email already registered', 409);
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);
    const userId = nanoid(16);

    // Prepare user data
    const userData = {
      id: userId,
      school_id: data.school_id,
      email: data.email,
      password_hash: passwordHash,
      first_name: data.first_name,
      last_name: data.last_name,
      other_names: data.other_names || null,
      phone: data.phone || null,
      role: data.role,
      is_active: data.is_active !== undefined ? data.is_active : true,
      email_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: currentUser.userId,
    };

    // Insert user
    await db.insert('user', userData);

    // Fetch created user (without password)
    const createdUser = await db.findOne('user', 'id = ?', [userId]);
    delete createdUser.password_hash;
    delete createdUser.two_factor_secret;

    return successResponse(
      {
        user: createdUser,
      },
      'User created successfully',
      201
    );
  } catch (error) {
    console.error('Create user error:', error);
    return errorResponse('Failed to create user', 500, { message: error.message });
  }
}
