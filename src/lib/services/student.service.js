/**
 * Student Service
 * DRAIS v0.0.0045
 * 
 * Handles student admission, CRUD operations, and related data management
 */

import db from '../db/index.js';

/**
 * Generate unique admission number
 * Format: ADM-YYYY-XXXXX
 */
async function generateAdmissionNumber(schoolId) {
  const year = new Date().getFullYear();
  const prefix = `ADM-${year}-`;
  
  // Get the last admission number for this year
  const query = `
    SELECT admission_no 
    FROM student 
    WHERE school_id = ? 
      AND admission_no LIKE ? 
    ORDER BY admission_no DESC 
    LIMIT 1
  `;
  
  const results = await db.query(query, [schoolId, `${prefix}%`]);
  
  let nextNumber = 1;
  if (results && results.length > 0) {
    const lastNumber = results[0].admission_no;
    const lastSequence = parseInt(lastNumber.split('-')[2]);
    nextNumber = lastSequence + 1;
  }
  
  return `${prefix}${String(nextNumber).padStart(5, '0')}`;
}

/**
 * Create a person record (base entity for student)
 * @returns {Promise<number>} person_id
 */
async function createPersonRecord(personData, userId) {
  const {
    firstName,
    lastName,
    givenName,
    dateOfBirth,
    gender,
    phone,
    email
  } = personData;

  const query = `
    INSERT INTO person (
      first_name, last_name, given_name, date_of_birth, gender,
      phone, email, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const result = await db.query(query, [
    firstName,
    lastName,
    givenName || null,
    dateOfBirth,
    gender,
    phone || null,
    email || null,
    userId
  ]);

  return result.insertId;
}

/**
 * Admit a new student (multi-step wizard final submission)
 * @param {Object} admissionData - Complete admission data from wizard
 * @param {number} userId - User performing the admission
 * @returns {Promise<Object>} Admission result with student details
 */
export async function admitStudent(admissionData, userId) {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      // Step 1: Basic Info
      basicInfo,
      // Step 2: Parent/Guardian Info
      familyInfo,
      // Step 3: Contacts & Address
      contactInfo,
      // Step 4: Additional Details
      additionalInfo,
      // Step 5: Documents
      documents,
      // School context
      schoolId,
      classId
    } = admissionData;

    // 1. Create person record
    const personId = await createPersonRecordInTransaction(connection, {
      ...basicInfo,
      phone: contactInfo?.studentPhone,
      email: contactInfo?.studentEmail
    }, userId);

    // 2. Generate admission number
    const admissionNo = await generateAdmissionNumber(schoolId);

    // 3. Create student record
    const studentQuery = `
      INSERT INTO student (
        school_id, person_id, class_id, admission_no,
        admission_date, status, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const studentResult = await connection.query(studentQuery, [
      schoolId,
      personId,
      classId || null,
      admissionNo,
      new Date(),
      'active',
      additionalInfo?.notes || null
    ]);

    const studentId = studentResult.insertId;

    // 4. Create student profile
    if (additionalInfo?.placeOfBirth || additionalInfo?.placeOfResidence) {
      const profileQuery = `
        INSERT INTO student_profiles (
          student_id, place_of_birth, place_of_residence, created_at
        ) VALUES (?, ?, ?, NOW())
      `;

      await connection.query(profileQuery, [
        studentId,
        additionalInfo?.placeOfBirth || null,
        additionalInfo?.placeOfResidence || null
      ]);
    }

    // 5. Create family status record
    if (familyInfo) {
      const familyQuery = `
        INSERT INTO student_family_status (
          student_id, orphan_status_id, 
          father_name, father_living_status_id, father_occupation, father_contact,
          primary_guardian_name, primary_guardian_contact, primary_guardian_occupation,
          notes, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      await connection.query(familyQuery, [
        studentId,
        familyInfo.orphanStatus || null,
        familyInfo.fatherName || null,
        familyInfo.fatherDeceased ? 2 : 1, // 1=living, 2=deceased
        familyInfo.fatherOccupation || null,
        familyInfo.fatherContact || null,
        familyInfo.guardianName || null,
        familyInfo.guardianContact || null,
        familyInfo.guardianOccupation || null,
        familyInfo.familyNotes || null
      ]);
    }

    // 6. Create next of kin records
    if (familyInfo?.nextOfKin && familyInfo.nextOfKin.length > 0) {
      for (let i = 0; i < familyInfo.nextOfKin.length; i++) {
        const nok = familyInfo.nextOfKin[i];
        const nokQuery = `
          INSERT INTO student_next_of_kin (
            student_id, sequence, name, address, occupation, contact
          ) VALUES (?, ?, ?, ?, ?, ?)
        `;

        await connection.query(nokQuery, [
          studentId,
          i + 1,
          nok.name,
          nok.address || null,
          nok.occupation || null,
          nok.contact || null
        ]);
      }
    }

    // 7. Create contact records
    if (contactInfo?.contacts && contactInfo.contacts.length > 0) {
      for (const contact of contactInfo.contacts) {
        const contactQuery = `
          INSERT INTO student_contacts (
            student_id, contact_type, contact_value, is_primary, created_at
          ) VALUES (?, ?, ?, ?, NOW())
        `;

        await connection.query(contactQuery, [
          studentId,
          contact.type || 'other',
          contact.value,
          contact.isPrimary ? 1 : 0
        ]);
      }
    }

    // 8. Save document references
    const documentIds = [];
    if (documents && documents.length > 0) {
      for (const doc of documents) {
        const docQuery = `
          INSERT INTO documents (
            school_id, owner_type, owner_id, document_type_id,
            file_name, file_url, mime_type, file_size,
            uploaded_by, uploaded_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const docResult = await connection.query(docQuery, [
          schoolId,
          'student',
          studentId,
          doc.documentTypeId || 1, // Default type
          doc.fileName,
          doc.fileUrl,
          doc.mimeType,
          doc.fileSize,
          userId
        ]);

        documentIds.push(docResult.insertId);
      }
    }

    await connection.commit();

    // Return complete student data
    return {
      success: true,
      message: 'Student admitted successfully',
      data: {
        studentId,
        personId,
        admissionNo,
        admissionDate: new Date(),
        documentIds,
        student: {
          ...basicInfo,
          admissionNo,
          studentId,
          classId,
          status: 'active'
        }
      }
    };

  } catch (error) {
    await connection.rollback();
    console.error('Student admission error:', error);
    throw new Error(`Failed to admit student: ${error.message}`);
  } finally {
    connection.release();
  }
}

/**
 * Helper function to create person in transaction
 */
async function createPersonRecordInTransaction(connection, personData, userId) {
  const {
    firstName,
    lastName,
    givenName,
    dateOfBirth,
    gender,
    phone,
    email
  } = personData;

  const query = `
    INSERT INTO person (
      first_name, last_name, given_name, date_of_birth, gender,
      phone, email, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const result = await connection.query(query, [
    firstName,
    lastName,
    givenName || null,
    dateOfBirth,
    gender,
    phone || null,
    email || null,
    userId
  ]);

  return result.insertId;
}

/**
 * Get student details by ID (with all related data)
 */
export async function getStudentById(studentId) {
  try {
    // Main student query with person and class info
    const studentQuery = `
      SELECT 
        s.*,
        p.first_name, p.last_name, p.given_name, p.date_of_birth, p.gender,
        p.phone, p.email,
        c.name as class_name,
        sp.place_of_birth, sp.place_of_residence,
        sf.orphan_status_id, sf.father_name, sf.father_contact,
        sf.primary_guardian_name, sf.primary_guardian_contact
      FROM student s
      LEFT JOIN person p ON s.person_id = p.id
      LEFT JOIN class c ON s.class_id = c.id
      LEFT JOIN student_profiles sp ON s.id = sp.student_id
      LEFT JOIN student_family_status sf ON s.id = sf.student_id
      WHERE s.id = ? AND s.deleted_at IS NULL
    `;

    const students = await db.query(studentQuery, [studentId]);
    
    if (!students || students.length === 0) {
      return null;
    }

    const student = students[0];

    // Get next of kin
    const nokQuery = `
      SELECT * FROM student_next_of_kin 
      WHERE student_id = ? 
      ORDER BY sequence
    `;
    const nextOfKin = await db.query(nokQuery, [studentId]);

    // Get contacts
    const contactsQuery = `
      SELECT * FROM student_contacts 
      WHERE student_id = ? 
      ORDER BY is_primary DESC, id
    `;
    const contacts = await db.query(contactsQuery, [studentId]);

    // Get documents
    const docsQuery = `
      SELECT * FROM documents 
      WHERE owner_type = 'student' 
        AND owner_id = ? 
        AND deleted_at IS NULL
      ORDER BY uploaded_at DESC
    `;
    const documents = await db.query(docsQuery, [studentId]);

    return {
      ...student,
      nextOfKin: nextOfKin || [],
      contacts: contacts || [],
      documents: documents || []
    };

  } catch (error) {
    console.error('Get student error:', error);
    throw new Error(`Failed to fetch student: ${error.message}`);
  }
}

/**
 * Get all students with pagination, filtering, and search
 */
export async function getAllStudents(options = {}) {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      classId,
      status = 'active',
      schoolId
    } = options;

    const offset = (page - 1) * limit;
    const conditions = ['s.deleted_at IS NULL'];
    const params = [];

    // Filter by school
    if (schoolId) {
      conditions.push('s.school_id = ?');
      params.push(schoolId);
    }

    // Filter by class
    if (classId) {
      conditions.push('s.class_id = ?');
      params.push(classId);
    }

    // Filter by status
    if (status) {
      conditions.push('s.status = ?');
      params.push(status);
    }

    // Search by name or admission number
    if (search) {
      conditions.push(`(
        CONCAT(p.first_name, ' ', p.last_name) LIKE ? OR
        s.admission_no LIKE ?
      )`);
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM student s
      LEFT JOIN person p ON s.person_id = p.id
      ${whereClause}
    `;
    
    const countResults = await db.query(countQuery, params);
    const total = countResults[0]?.total || 0;

    // Get students
    const query = `
      SELECT 
        s.id, s.admission_no, s.admission_date, s.status, s.school_id,
        s.class_id,
        p.first_name, p.last_name, p.given_name, p.date_of_birth, p.gender,
        p.phone, p.email,
        c.name as class_name
      FROM student s
      LEFT JOIN person p ON s.person_id = p.id
      LEFT JOIN class c ON s.class_id = c.id
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const students = await db.query(query, params);

    return {
      success: true,
      data: students || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

  } catch (error) {
    console.error('Get all students error:', error);
    throw new Error(`Failed to fetch students: ${error.message}`);
  }
}

/**
 * Update student information
 */
export async function updateStudent(studentId, updateData, userId) {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      basicInfo,
      familyInfo,
      contactInfo,
      additionalInfo,
      classId,
      status
    } = updateData;

    // 1. Update person record if basicInfo provided
    if (basicInfo) {
      const student = await getStudentById(studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      const personQuery = `
        UPDATE person 
        SET first_name = ?, last_name = ?, given_name = ?,
            date_of_birth = ?, gender = ?, phone = ?, email = ?
        WHERE id = ?
      `;

      await connection.query(personQuery, [
        basicInfo.firstName || student.first_name,
        basicInfo.lastName || student.last_name,
        basicInfo.givenName || student.given_name,
        basicInfo.dateOfBirth || student.date_of_birth,
        basicInfo.gender || student.gender,
        contactInfo?.studentPhone || student.phone,
        contactInfo?.studentEmail || student.email,
        student.person_id
      ]);
    }

    // 2. Update student record
    const studentUpdateFields = [];
    const studentUpdateParams = [];

    if (classId !== undefined) {
      studentUpdateFields.push('class_id = ?');
      studentUpdateParams.push(classId);
    }

    if (status) {
      studentUpdateFields.push('status = ?');
      studentUpdateParams.push(status);
    }

    if (additionalInfo?.notes !== undefined) {
      studentUpdateFields.push('notes = ?');
      studentUpdateParams.push(additionalInfo.notes);
    }

    if (studentUpdateFields.length > 0) {
      studentUpdateFields.push('updated_at = NOW()');
      studentUpdateParams.push(studentId);

      const studentQuery = `
        UPDATE student 
        SET ${studentUpdateFields.join(', ')}
        WHERE id = ?
      `;

      await connection.query(studentQuery, studentUpdateParams);
    }

    // 3. Update family status
    if (familyInfo) {
      const familyQuery = `
        UPDATE student_family_status 
        SET father_name = ?, father_contact = ?,
            primary_guardian_name = ?, primary_guardian_contact = ?,
            orphan_status_id = ?, updated_at = NOW()
        WHERE student_id = ?
      `;

      await connection.query(familyQuery, [
        familyInfo.fatherName || null,
        familyInfo.fatherContact || null,
        familyInfo.guardianName || null,
        familyInfo.guardianContact || null,
        familyInfo.orphanStatus || null,
        studentId
      ]);
    }

    await connection.commit();

    return {
      success: true,
      message: 'Student updated successfully',
      data: { studentId }
    };

  } catch (error) {
    await connection.rollback();
    console.error('Update student error:', error);
    throw new Error(`Failed to update student: ${error.message}`);
  } finally {
    connection.release();
  }
}

/**
 * Soft delete student
 */
export async function deleteStudent(studentId, userId) {
  try {
    const query = `
      UPDATE student 
      SET status = 'inactive', 
          deleted_at = NOW(),
          updated_at = NOW()
      WHERE id = ?
    `;

    await db.query(query, [studentId]);

    return {
      success: true,
      message: 'Student deleted successfully'
    };

  } catch (error) {
    console.error('Delete student error:', error);
    throw new Error(`Failed to delete student: ${error.message}`);
  }
}

/**
 * Validate admission data
 */
export function validateAdmissionData(data) {
  const errors = [];

  // Validate basic info (mandatory)
  if (!data.basicInfo?.firstName) {
    errors.push('First name is required');
  }
  if (!data.basicInfo?.lastName) {
    errors.push('Last name is required');
  }
  if (!data.basicInfo?.dateOfBirth) {
    errors.push('Date of birth is required');
  }
  if (!data.basicInfo?.gender) {
    errors.push('Gender is required');
  }

  // Validate school context
  if (!data.schoolId) {
    errors.push('School ID is required');
  }

  // Validate documents if provided
  if (data.documents && data.documents.length > 0) {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    for (const doc of data.documents) {
      if (!allowedMimeTypes.includes(doc.mimeType)) {
        errors.push(`Invalid file type: ${doc.fileName}. Only PDF, JPG, PNG allowed`);
      }

      // Max file size: 5MB
      if (doc.fileSize > 5 * 1024 * 1024) {
        errors.push(`File too large: ${doc.fileName}. Max 5MB`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
