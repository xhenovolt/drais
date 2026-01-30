/**
 * Admission Form PDF Generator
 * DRAIS v0.0.0045
 * 
 * Generates professional admission forms using @react-pdf/renderer
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import db from '../db/index.js';
import fs from 'fs/promises';
import path from 'path';

// Define PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 15,
  },
  schoolName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#1e40af',
  },
  schoolInfo: {
    fontSize: 10,
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f1f5f9',
    padding: 8,
    marginBottom: 10,
    color: '#1e40af',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
    color: '#475569',
  },
  value: {
    width: '60%',
    color: '#0f172a',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: 1,
    borderTopColor: '#cbd5e1',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 9,
    color: '#64748b',
  },
  admissionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#dbeafe',
    padding: 10,
    marginBottom: 15,
    color: '#1e40af',
  },
});

// Admission Form Document Component
const AdmissionFormDocument = ({ student, school, formNumber }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.schoolName}>{school.name || 'School Name'}</Text>
        <Text style={styles.schoolInfo}>
          {school.address || ''} {school.city ? `| ${school.city}` : ''}
        </Text>
        <Text style={styles.schoolInfo}>
          {school.phone ? `Tel: ${school.phone}` : ''} {school.email ? `| Email: ${school.email}` : ''}
        </Text>
        <Text style={styles.schoolInfo}>
          {school.website ? `Website: ${school.website}` : ''}
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Student Admission Form</Text>

      {/* Admission Number */}
      <Text style={styles.admissionNumber}>
        Admission No: {student.admissionNo || 'N/A'}
      </Text>

      {/* Student Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student Information</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>
            {`${student.firstName || ''} ${student.givenName ? student.givenName + ' ' : ''}${student.lastName || ''}`}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>
            {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{student.gender || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Admission Date:</Text>
          <Text style={styles.value}>
            {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : new Date().toLocaleDateString()}
          </Text>
        </View>

        {student.className && (
          <View style={styles.row}>
            <Text style={styles.label}>Class:</Text>
            <Text style={styles.value}>{student.className}</Text>
          </View>
        )}
      </View>

      {/* Contact Information */}
      {(student.phone || student.email) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          {student.phone && (
            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{student.phone}</Text>
            </View>
          )}

          {student.email && (
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{student.email}</Text>
            </View>
          )}
        </View>
      )}

      {/* Family Information */}
      {(student.fatherName || student.guardianName) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parent/Guardian Information</Text>
          
          {student.fatherName && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Father's Name:</Text>
                <Text style={styles.value}>{student.fatherName}</Text>
              </View>

              {student.fatherContact && (
                <View style={styles.row}>
                  <Text style={styles.label}>Father's Contact:</Text>
                  <Text style={styles.value}>{student.fatherContact}</Text>
                </View>
              )}
            </>
          )}

          {student.guardianName && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Guardian's Name:</Text>
                <Text style={styles.value}>{student.guardianName}</Text>
              </View>

              {student.guardianContact && (
                <View style={styles.row}>
                  <Text style={styles.label}>Guardian's Contact:</Text>
                  <Text style={styles.value}>{student.guardianContact}</Text>
                </View>
              )}
            </>
          )}
        </View>
      )}

      {/* Additional Information */}
      {(student.placeOfBirth || student.placeOfResidence) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          {student.placeOfBirth && (
            <View style={styles.row}>
              <Text style={styles.label}>Place of Birth:</Text>
              <Text style={styles.value}>{student.placeOfBirth}</Text>
            </View>
          )}

          {student.placeOfResidence && (
            <View style={styles.row}>
              <Text style={styles.label}>Place of Residence:</Text>
              <Text style={styles.value}>{student.placeOfResidence}</Text>
            </View>
          )}

          {student.notes && (
            <View style={styles.row}>
              <Text style={styles.label}>Notes:</Text>
              <Text style={styles.value}>{student.notes}</Text>
            </View>
          )}
        </View>
      )}

      {/* Documents */}
      {student.documents && student.documents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attached Documents</Text>
          {student.documents.map((doc, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.label}>• {doc.fileName || `Document ${index + 1}`}</Text>
              <Text style={styles.value}>{doc.documentType || 'Attachment'}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Form Number: {formNumber}</Text>
        <Text style={styles.footerText}>
          Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </Text>
      </View>
    </Page>
  </Document>
);

/**
 * Get school information from database
 */
async function getSchoolInfo(schoolId) {
  try {
    const query = `
      SELECT 
        id, name, address, city, phone, email, website,
        logo_url
      FROM schools 
      WHERE id = ? 
      LIMIT 1
    `;

    const results = await db.query(query, [schoolId]);
    
    if (!results || results.length === 0) {
      return {
        name: 'DRAIS School',
        address: '',
        city: '',
        phone: '',
        email: '',
        website: ''
      };
    }

    return results[0];
  } catch (error) {
    console.error('Error fetching school info:', error);
    return {
      name: 'DRAIS School',
      address: '',
      city: '',
      phone: '',
      email: '',
      website: ''
    };
  }
}

/**
 * Generate admission form PDF
 * @param {Object} studentData - Student information
 * @param {number} schoolId - School ID
 * @param {number} userId - User generating the form
 * @returns {Promise<Object>} PDF generation result
 */
export async function generateAdmissionFormPDF(studentData, schoolId, userId) {
  try {
    // Get school information
    const school = await getSchoolInfo(schoolId);

    // Generate form number
    const formNumber = `AF-${new Date().getFullYear()}-${String(studentData.studentId).padStart(6, '0')}`;

    // Generate PDF
    const admissionForm = <AdmissionFormDocument 
      student={studentData} 
      school={school} 
      formNumber={formNumber} 
    />;

    const pdfBlob = await pdf(admissionForm).toBlob();
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'admission-forms');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Save PDF to file system
    const fileName = `admission-form-${studentData.studentId}-${Date.now()}.pdf`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, pdfBuffer);

    // File URL (relative to public directory)
    const fileUrl = `/uploads/admission-forms/${fileName}`;

    // Save admission form record to database
    const insertQuery = `
      INSERT INTO admission_forms (
        student_id, school_id, form_number, file_url, 
        file_size, generated_by, generated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        form_number = VALUES(form_number),
        file_url = VALUES(file_url),
        file_size = VALUES(file_size),
        generated_by = VALUES(generated_by),
        generated_at = NOW()
    `;

    await db.query(insertQuery, [
      studentData.studentId,
      schoolId,
      formNumber,
      fileUrl,
      pdfBuffer.length,
      userId
    ]);

    return {
      success: true,
      message: 'Admission form generated successfully',
      data: {
        formNumber,
        fileUrl,
        fileName,
        fileSize: pdfBuffer.length
      }
    };

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate admission form: ${error.message}`);
  }
}

/**
 * Get admission form for a student
 */
export async function getAdmissionForm(studentId) {
  try {
    const query = `
      SELECT * FROM admission_forms 
      WHERE student_id = ? 
      ORDER BY generated_at DESC 
      LIMIT 1
    `;

    const results = await db.query(query, [studentId]);
    
    if (!results || results.length === 0) {
      return null;
    }

    return results[0];
  } catch (error) {
    console.error('Get admission form error:', error);
    throw new Error(`Failed to fetch admission form: ${error.message}`);
  }
}
