/**
 * User Registration Endpoint
 * POST /api/auth/register
 * 
 * DRAIS v0.0.0042 - Enhanced with Access/Refresh tokens
 */

import { NextResponse } from 'next/server';
import { createUser } from '@/lib/services/user.service';
import { generateTokens, setAuthCookies, createSessionData } from '@/lib/auth/jwt-enhanced';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password, name, role = 'client', school_id } = body;

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength (min 8 chars, 1 uppercase, 1 number)
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { success: false, error: 'Password must contain at least 1 uppercase letter and 1 number' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['super_admin', 'school_admin', 'admin', 'teacher', 'staff', 'student', 'parent', 'client'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser({
      username,
      email,
      password,
      name: name || username,
      role,
      school_id,
    });

    // Remove password from response
    delete user.password;

    // Generate tokens
    const tokens = generateTokens(user);

    // Create session data
    const sessionData = createSessionData(user, tokens);

    // Create response with cookies
    let response = NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        data: sessionData,
      },
      { status: 201 }
    );

    // Set HttpOnly cookies
    response = setAuthCookies(response, tokens);

    return response;

  } catch (error) {
    console.error('Registration error:', error);

    // Handle specific errors
    if (error.message.includes('already registered') || error.message.includes('already taken')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 } // Conflict
      );
    }

    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
