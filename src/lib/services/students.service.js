/**
 * Student Service Library
 * DRAIS v0.0.0300 - Production Implementation
 * 
 * Centralized business logic for student operations
 * Used by API routes to maintain consistency
 */

import { getPool } from '../db/postgres.js';

/**
 * Get student with all related data
 */
export async function getStudentWithRelations(studentId, schoolId) {
  const pool = await getPool();

  const result = await pool.query(
    `SELECT 
      s.id, s.school_id, s.admission_number, s.first_name, s.middle_name, s.last_name,
      s.gender, s.date_of_birth, s.class_id, s.stream_id, s.status, s.enrollment_date,
      s.guardian_name, s.guardian_phone, s.guardian_email, s.address,
      c.name as class_name,
      (SELECT COUNT(*) FROM student_discipline WHERE student_id = s.id AND school_id = $1) as discipline_count,
      (SELECT COUNT(*) FROM student_suspensions WHERE student_id = s.id AND school_id = $1 AND status = 'active') as active_suspensions,
      (SELECT COALESCE(SUM(
        CASE WHEN transaction_type = 'credit' THEN amount
             WHEN transaction_type = 'debit' THEN -amount END
      ), 0) FROM student_transactions WHERE student_id = s.id AND school_id = $1) as pocket_money_balance
    FROM students s
    LEFT JOIN classes c ON s.class_id = c.id
    WHERE s.id = $2 AND s.school_id = $1 AND s.deleted_at IS NULL`,
    [schoolId, studentId]
  );

  return result.rows[0] || null;
}

/**
 * Check if student can be promoted
 */
export async function canStudentBePromoted(studentId, schoolId) {
  const pool = await getPool();

  const result = await pool.query(
    'SELECT status FROM students WHERE id = $1 AND school_id = $2 AND deleted_at IS NULL',
    [studentId, schoolId]
  );

  if (result.rows.length === 0) {
    return { can: false, reason: 'Student not found' };
  }

  const student = result.rows[0];

  if (student.status !== 'active') {
    return { can: false, reason: `Cannot promote ${student.status} student` };
  }

  return { can: true };
}

/**
 * Get student balance
 */
export async function getStudentBalance(studentId, schoolId) {
  const pool = await getPool();

  const result = await pool.query(
    `SELECT COALESCE(SUM(
      CASE WHEN transaction_type = 'credit' THEN amount
           WHEN transaction_type = 'debit' THEN -amount END
    ), 0) as balance
    FROM student_transactions
    WHERE student_id = $1 AND school_id = $2`,
    [studentId, schoolId]
  );

  return parseFloat(result.rows[0].balance);
}

/**
 * Record student transaction
 */
export async function recordTransaction(studentId, schoolId, type, amount, description, performedBy) {
  const pool = await getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const balanceResult = await client.query(
      `SELECT COALESCE(SUM(
        CASE WHEN transaction_type = 'credit' THEN amount
             WHEN transaction_type = 'debit' THEN -amount END
      ), 0) as balance
      FROM student_transactions
      WHERE student_id = $1 AND school_id = $2`,
      [studentId, schoolId]
    );

    const balanceBefore = parseFloat(balanceResult.rows[0].balance);
    const amountValue = parseFloat(amount);
    const balanceAfter = type === 'credit'
      ? balanceBefore + amountValue
      : balanceBefore - amountValue;

    const result = await client.query(
      `INSERT INTO student_transactions (
        school_id, student_id, transaction_type, amount,
        balance_before, balance_after, description, performed_by,
        transaction_date, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, transaction_type, amount, balance_after`,
      [schoolId, studentId, type, amountValue, balanceBefore, balanceAfter, description, performedBy]
    );

    await client.query('COMMIT');
    return result.rows[0];

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Check for duplicate admission number
 */
export async function checkAdmissionDuplicate(admissionNumber, schoolId, excludeStudentId = null) {
  const pool = await getPool();

  let query = 'SELECT id FROM students WHERE school_id = $1 AND admission_number = $2 AND deleted_at IS NULL';
  const params = [schoolId, admissionNumber];

  if (excludeStudentId) {
    query += ` AND id != $3`;
    params.push(excludeStudentId);
  }

  const result = await pool.query(query, params);
  return result.rows.length > 0;
}

/**
 * Get student audit trail
 */
export async function getStudentAuditTrail(studentId, schoolId, limit = 50) {
  const pool = await getPool();

  const result = await pool.query(
    `SELECT 
      id, user_id, entity_type, action, changes, reason, created_at
    FROM student_audit_log
    WHERE school_id = $1 AND entity_id = $2
    ORDER BY created_at DESC
    LIMIT $3`,
    [schoolId, studentId, limit]
  );

  return result.rows;
}

/**
 * Soft delete student (mark as left)
 */
export async function deleteStudent(studentId, schoolId, reason, performedBy) {
  const pool = await getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const updateResult = await client.query(
      `UPDATE students
      SET deleted_at = CURRENT_TIMESTAMP, status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND school_id = $3
      RETURNING id, first_name, last_name`,
      [reason || 'left', studentId, schoolId]
    );

    if (updateResult.rows.length === 0) {
      throw new Error('Student not found');
    }

    await client.query(
      `INSERT INTO student_audit_log (
        school_id, user_id, entity_type, entity_id, action, reason, created_at
      ) VALUES ($1, $2, 'student', $3, 'delete', $4, CURRENT_TIMESTAMP)`,
      [schoolId, performedBy, studentId, reason]
    );

    await client.query('COMMIT');
    return updateResult.rows[0];

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get class statistics
 */
export async function getClassStatistics(classId, schoolId) {
  const pool = await getPool();

  const result = await pool.query(
    `SELECT 
      COUNT(*) as total_students,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_students,
      COUNT(CASE WHEN status = 'alumni' THEN 1 END) as alumni_students,
      COUNT(CASE WHEN status = 'expelled' THEN 1 END) as expelled_students,
      COUNT(CASE WHEN status = 'graduated' THEN 1 END) as graduated_students,
      (SELECT COUNT(*) FROM student_suspensions 
       WHERE school_id = $1 AND student_id IN (
         SELECT id FROM students WHERE class_id = $2 AND school_id = $1
       ) AND status = 'active') as suspended_count
    FROM students
    WHERE class_id = $2 AND school_id = $1 AND deleted_at IS NULL`,
    [schoolId, classId]
  );

  return result.rows[0] || {
    total_students: 0,
    active_students: 0,
    alumni_students: 0,
    expelled_students: 0,
    graduated_students: 0,
    suspended_count: 0
  };
}

/**
 * Export students to CSV format
 */
export async function exportStudentsCSV(schoolId, filters = {}) {
  const pool = await getPool();

  let whereClause = 'WHERE s.school_id = $1 AND s.deleted_at IS NULL';
  const params = [schoolId];
  let paramIndex = 2;

  if (filters.class_id) {
    whereClause += ` AND s.class_id = $${paramIndex}`;
    params.push(filters.class_id);
    paramIndex++;
  }

  if (filters.status) {
    whereClause += ` AND s.status = $${paramIndex}`;
    params.push(filters.status);
    paramIndex++;
  }

  const result = await pool.query(
    `SELECT 
      s.admission_number, s.first_name, s.middle_name, s.last_name,
      s.gender, s.date_of_birth, c.name as class, s.status,
      s.enrollment_date, s.guardian_name, s.guardian_phone, s.guardian_email,
      s.address, s.created_at
    FROM students s
    LEFT JOIN classes c ON s.class_id = c.id
    ${whereClause}
    ORDER BY s.admission_number ASC`,
    params
  );

  return result.rows;
}

export default {
  getStudentWithRelations,
  canStudentBePromoted,
  getStudentBalance,
  recordTransaction,
  checkAdmissionDuplicate,
  getStudentAuditTrail,
  deleteStudent,
  getClassStatistics,
  exportStudentsCSV
};
