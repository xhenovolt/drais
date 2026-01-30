/**
 * Generate Admission Form PDF Endpoint
 * POST /api/students/:id/admission-form
 * 
 * DRAIS v0.0.0045
 * Generates and downloads professional admission form PDF
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/jwt-enhanced';
import { getStudentById } from '@/lib/services/student.service';
import { generateAdmissionFormPDF, getAdmissionForm } from '@/lib/services/pdf.service';

export async function POST(request, { params }) {
  try {
    // Verify authentication
    const user = await requireAuth(request);
    const userId = user.id;
    const schoolId = user.school_id || 1;

    const { id } = params;
    const studentId = parseInt(id);

    if (!studentId || isNaN(studentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    // Get student details
    const student = await getStudentById(studentId);

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    // Prepare student data for PDF
    const studentData = {
      studentId: student.id,
      firstName: student.first_name,
      lastName: student.last_name,
      givenName: student.given_name,
      dateOfBirth: student.date_of_birth,
      gender: student.gender,
      admissionNo: student.admission_no,
      admissionDate: student.admission_date,
      className: student.class_name,
      phone: student.phone,
      email: student.email,
      fatherName: student.father_name,
      fatherContact: student.father_contact,
      guardianName: student.primary_guardian_name,
      guardianContact: student.primary_guardian_contact,
      placeOfBirth: student.place_of_birth,
      placeOfResidence: student.place_of_residence,
      notes: student.notes,
      documents: student.documents || []
    };

    // Generate PDF
    const result = await generateAdmissionFormPDF(studentData, schoolId, userId);

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Generate admission form error:', error);
    
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
        error: error.message || 'Failed to generate admission form' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Retrieve existing admission form for student
 */
export async function GET(request, { params }) {
  try {
    // Verify authentication
    const user = await requireAuth(request);

    const { id } = params;
    const studentId = parseInt(id);

    if (!studentId || isNaN(studentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    // Get admission form
    const admissionForm = await getAdmissionForm(studentId);

    if (!admissionForm) {
      return NextResponse.json(
        { success: false, error: 'Admission form not found. Please generate one first.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: admissionForm 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get admission form error:', error);
    
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
        error: error.message || 'Failed to fetch admission form' 
      },
      { status: 500 }
    );
  }
}
