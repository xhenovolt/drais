/**
 * Admin Endpoint: Create Test User
 * POST /api/admin/create-test-user
 * 
 * Creates test@website.tld with completed onboarding for testing
 */

import { NextResponse } from 'next/server';
import db from '@/lib/db/index.js';
import { hashPassword } from '@/lib/auth/jwt-enhanced.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email = 'test@website.tld', password = 'TestPassword123', name = 'Test User' } = body;

    console.log(`🔄 Creating test user: ${email}`);

    // Check if user already exists
    const existingUser = await db.findOne('users', { email });
    if (existingUser) {
      console.log(`✅ User already exists with ID: ${existingUser.id}`);
      return NextResponse.json(
        {
          success: true,
          message: 'User already exists',
          user: {
            id: existingUser.id,
            email: existingUser.email,
            onboarding_completed: existingUser.onboarding_completed,
          },
        },
        { status: 200 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user with onboarding_completed = TRUE
    const result = await db.insert('users', {
      email,
      username: email.split('@')[0],
      password_hash: passwordHash,
      role: 'student',
      onboarding_completed: true,
      onboarding_completed_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    const userId = result.id || result.insertId;

    console.log(`✅ Test user created with ID: ${userId}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Test user created successfully',
        user: {
          id: userId,
          email,
          password: `Password: ${password} (remember: never log this)`,
          onboarding_completed: true,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Failed to create test user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
