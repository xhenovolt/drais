/**
 * Bursary Service - DRAIS v0.0.0046
 * 
 * Manages bursaries, exemptions, and sponsorships
 */

import db from '../db/index.js';

/**
 * Apply/Create a bursary for a student
 */
export async function applyBursary(bursaryData, userId, schoolId) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      studentId,
      bursaryType, // 'percentage', 'fixed_amount', 'full_sponsorship'
      value, // percentage (0-100) or fixed amount
      reason,
      term,
      year,
      sponsorName,
      sponsorContact,
      validUntil,
      autoApprove = false
    } = bursaryData;

    // Create bursary record
    const insertQuery = `
      INSERT INTO bursaries (
        school_id, student_id, bursary_type, value,
        reason, term, year, sponsor_name, sponsor_contact,
        valid_until, status, applied_by, applied_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const status = autoApprove ? 'approved' : 'pending';

    const result = await connection.query(insertQuery, [
      schoolId,
      studentId,
      bursaryType,
      value,
      reason,
      term || null,
      year || new Date().getFullYear(),
      sponsorName || null,
      sponsorContact || null,
      validUntil || null,
      status,
      userId
    ]);

    const bursaryId = result.insertId;

    // If auto-approved, apply adjustment immediately
    if (autoApprove) {
      await applyBursaryAdjustment(connection, bursaryId, studentId, schoolId, term, year, bursaryType, value);
    }

    await connection.commit();

    return {
      success: true,
      message: autoApprove ? 'Bursary applied successfully' : 'Bursary application submitted for approval',
      data: {
        bursaryId,
        status
      }
    };
  } catch (error) {
    await connection.rollback();
    console.error('Apply bursary error:', error);
    throw new Error(`Failed to apply bursary: ${error.message}`);
  } finally {
    connection.release();
  }
}

/**
 * Approve a bursary application
 */
export async function approveBursary(bursaryId, userId, schoolId) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Get bursary details
    const bursaryQuery = `
      SELECT * FROM bursaries 
      WHERE id = ? AND school_id = ? AND status = 'pending'
    `;
    const bursaries = await connection.query(bursaryQuery, [bursaryId, schoolId]);

    if (!bursaries || bursaries.length === 0) {
      throw new Error('Bursary not found or already processed');
    }

    const bursary = bursaries[0];

    // Update status
    const updateQuery = `
      UPDATE bursaries
      SET status = 'approved', approved_by = ?, approved_at = NOW()
      WHERE id = ?
    `;
    await connection.query(updateQuery, [userId, bursaryId]);

    // Apply adjustment
    await applyBursaryAdjustment(
      connection,
      bursaryId,
      bursary.student_id,
      schoolId,
      bursary.term,
      bursary.year,
      bursary.bursary_type,
      bursary.value
    );

    await connection.commit();

    return {
      success: true,
      message: 'Bursary approved and applied successfully'
    };
  } catch (error) {
    await connection.rollback();
    console.error('Approve bursary error:', error);
    throw new Error(`Failed to approve bursary: ${error.message}`);
  } finally {
    connection.release();
  }
}

/**
 * Reject a bursary application
 */
export async function rejectBursary(bursaryId, userId, schoolId, rejectionReason) {
  try {
    const query = `
      UPDATE bursaries
      SET status = 'rejected', 
          rejected_by = ?, 
          rejected_at = NOW(),
          rejection_reason = ?
      WHERE id = ? AND school_id = ? AND status = 'pending'
    `;

    await db.query(query, [userId, rejectionReason, bursaryId, schoolId]);

    return {
      success: true,
      message: 'Bursary application rejected'
    };
  } catch (error) {
    console.error('Reject bursary error:', error);
    throw new Error(`Failed to reject bursary: ${error.message}`);
  }
}

/**
 * Apply bursary adjustment to student fees (helper function)
 */
async function applyBursaryAdjustment(connection, bursaryId, studentId, schoolId, term, year, bursaryType, value) {
  // Get student fees
  const feesQuery = `
    SELECT id, amount FROM student_fees
    WHERE student_id = ? AND school_id = ? 
      AND term = ? AND year = ?
      AND deleted_at IS NULL
  `;
  const fees = await connection.query(feesQuery, [studentId, schoolId, term, year]);

  if (!fees || fees.length === 0) {
    return; // No fees to adjust
  }

  for (const fee of fees) {
    let adjustmentAmount = 0;

    if (bursaryType === 'percentage') {
      adjustmentAmount = (fee.amount * value) / 100;
    } else if (bursaryType === 'fixed_amount') {
      adjustmentAmount = Math.min(value, fee.amount);
    } else if (bursaryType === 'full_sponsorship') {
      adjustmentAmount = fee.amount;
    }

    // Create bursary adjustment record
    const insertQuery = `
      INSERT INTO bursary_adjustments (
        bursary_id, student_fee_id, original_amount, 
        adjustment_amount, adjusted_amount, created_at
      ) VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const adjustedAmount = fee.amount - adjustmentAmount;

    await connection.query(insertQuery, [
      bursaryId,
      fee.id,
      fee.amount,
      adjustmentAmount,
      adjustedAmount
    ]);

    // Update student fee amount
    const updateFeeQuery = `
      UPDATE student_fees
      SET amount = ?, bursary_applied = 1, updated_at = NOW()
      WHERE id = ?
    `;
    await connection.query(updateFeeQuery, [adjustedAmount, fee.id]);
  }

  // Recalculate student balance
  const totalFeesQuery = `
    SELECT COALESCE(SUM(amount), 0) as total_fees
    FROM student_fees
    WHERE student_id = ? AND school_id = ? AND term = ? AND year = ?
      AND deleted_at IS NULL
  `;
  const totalFeesResult = await connection.query(totalFeesQuery, [studentId, schoolId, term, year]);
  const totalFees = totalFeesResult[0]?.total_fees || 0;

  const totalPaidQuery = `
    SELECT COALESCE(SUM(t.amount), 0) as total_paid
    FROM transactions t
    JOIN student_fees sf ON t.student_fee_id = sf.id
    WHERE sf.student_id = ? AND sf.school_id = ? AND sf.term = ? AND sf.year = ?
      AND t.status = 'completed'
  `;
  const totalPaidResult = await connection.query(totalPaidQuery, [studentId, schoolId, term, year]);
  const totalPaid = totalPaidResult[0]?.total_paid || 0;

  const balance = totalFees - totalPaid;

  // Update student account
  const updateAccountQuery = `
    UPDATE student_account
    SET total_fees = ?, balance = ?, updated_at = NOW()
    WHERE student_id = ? AND school_id = ? AND term = ? AND year = ?
  `;
  await connection.query(updateAccountQuery, [totalFees, balance, studentId, schoolId, term, year]);
}

/**
 * Get bursaries
 */
export async function getBursaries(schoolId, options = {}) {
  try {
    const { studentId, status, term, year, page = 1, limit = 50 } = options;

    let conditions = ['b.school_id = ?'];
    let params = [schoolId];

    if (studentId) {
      conditions.push('b.student_id = ?');
      params.push(studentId);
    }

    if (status) {
      conditions.push('b.status = ?');
      params.push(status);
    }

    if (term) {
      conditions.push('b.term = ?');
      params.push(term);
    }

    if (year) {
      conditions.push('b.year = ?');
      params.push(year);
    }

    const whereClause = conditions.join(' AND ');
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total FROM bursaries b
      WHERE ${whereClause}
    `;
    const countResult = await db.query(countQuery, params);
    const total = countResult[0]?.total || 0;

    // Get bursaries
    const query = `
      SELECT 
        b.*,
        s.admission_no,
        p.first_name, p.last_name,
        c.name as class_name,
        u1.first_name as applied_by_name,
        u2.first_name as approved_by_name
      FROM bursaries b
      JOIN student s ON b.student_id = s.id
      JOIN person p ON s.person_id = p.id
      LEFT JOIN class c ON s.class_id = c.id
      LEFT JOIN users u1 ON b.applied_by = u1.id
      LEFT JOIN users u2 ON b.approved_by = u2.id
      WHERE ${whereClause}
      ORDER BY b.applied_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const bursaries = await db.query(query, params);

    return {
      success: true,
      data: bursaries || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Get bursaries error:', error);
    throw new Error(`Failed to fetch bursaries: ${error.message}`);
  }
}

/**
 * Get bursary statistics
 */
export async function getBursaryStats(schoolId, term, year) {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_bursaries,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
        COUNT(CASE WHEN bursary_type = 'full_sponsorship' THEN 1 END) as full_sponsorships,
        COALESCE(SUM(CASE WHEN status = 'approved' THEN 
          (SELECT COALESCE(SUM(adjustment_amount), 0) 
           FROM bursary_adjustments ba 
           WHERE ba.bursary_id = b.id)
        END), 0) as total_amount_waived
      FROM bursaries b
      WHERE school_id = ? AND term = ? AND year = ?
    `;

    const result = await db.query(query, [schoolId, term, year]);

    return {
      success: true,
      data: result[0] || {}
    };
  } catch (error) {
    console.error('Get bursary stats error:', error);
    throw new Error(`Failed to fetch bursary statistics: ${error.message}`);
  }
}
