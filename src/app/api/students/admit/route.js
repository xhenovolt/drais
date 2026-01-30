/**
 * Student Admission Endpoint
 * POST /api/students/admit
 * 
 * DRAIS v0.0.0045
 * Handles multi-step student admission process
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/jwt-enhanced';
import { admitStudent, validateAdmissionData } from '@/lib/services/student.service';

export async function POST(request) {
  try {
    // Verify authentication
    const user = await requireAuth(request);
    const userId = user.id;

    const admissionData = await request.json();

    // Add school context from user
    admissionData.schoolId = user.school_id || 1;

    // Validate admission data
    const validation = validateAdmissionData(admissionData);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          errors: validation.errors 
        },
        { status: 400 }
      );
    }

    // Admit student
    const result = await admitStudent(admissionData, userId);

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Student admission error:', error);
    
    // Handle authentication errors
    if (error.message && (
      error.message.includes('Authentication required') || 
      error.message.includes('Invalid or expired token')
    )) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to admit student' 
      },
      { status: 500 }
    );
  }
}
