/**
 * Finance Service - DRAIS v0.0.0046
 * 
 * Comprehensive financial management system
 * - Fee items management
 * - Fee allocation engine
 * - Transaction recording
 * - Balance tracking
 * - Payment methods
 */

import db from '../db/index.js';

/**
 * ==========================================
 * FEE ITEMS MANAGEMENT
 * ==========================================
 */

/**
 * Create a new fee item
 */
export async function createFeeItem(itemData, userId, schoolId) {
  try {
    const query = `
      INSERT INTO fee_items (
        school_id, item_name, description, amount, 
        applies_to, class_id, term, year, 
        is_mandatory, is_active, created_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const result = await db.query(query, [
      schoolId,
      itemData.itemName,
      itemData.description || null,
      itemData.amount,
      itemData.appliesTo || 'all', // 'all', 'class', 'level'
      itemData.classId || null,
      itemData.term || null,
      itemData.year || new Date().getFullYear(),
      itemData.isMandatory !== false ? 1 : 0,
      itemData.isActive !== false ? 1 : 0,
      userId
    ]);

    return {
      success: true,
      message: 'Fee item created successfully',
      data: {
        itemId: result.insertId,
        ...itemData
      }
    };
  } catch (error) {
    console.error('Create fee item error:', error);
    throw new Error(`Failed to create fee item: ${error.message}`);
  }
}

/**
 * Get all fee items for a school
 */
export async function getFeeItems(schoolId, options = {}) {
  try {
    const { term, year, appliesTo, isActive = true } = options;

    let conditions = ['fi.school_id = ?', 'fi.deleted_at IS NULL'];
    let params = [schoolId];

    if (term) {
      conditions.push('(fi.term = ? OR fi.term IS NULL)');
      params.push(term);
    }

    if (year) {
      conditions.push('fi.year = ?');
      params.push(year);
    }

    if (appliesTo) {
      conditions.push('fi.applies_to = ?');
      params.push(appliesTo);
    }

    if (isActive !== null) {
      conditions.push('fi.is_active = ?');
      params.push(isActive ? 1 : 0);
    }

    const whereClause = conditions.join(' AND ');

    const query = `
      SELECT 
        fi.*,
        c.name as class_name,
        u.first_name as created_by_name
      FROM fee_items fi
      LEFT JOIN class c ON fi.class_id = c.id
      LEFT JOIN users u ON fi.created_by = u.id
      WHERE ${whereClause}
      ORDER BY fi.created_at DESC
    `;

    const items = await db.query(query, params);

    return {
      success: true,
      data: items || []
    };
  } catch (error) {
    console.error('Get fee items error:', error);
    throw new Error(`Failed to fetch fee items: ${error.message}`);
  }
}

/**
 * Update fee item
 */
export async function updateFeeItem(itemId, updateData, schoolId) {
  try {
    const fields = [];
    const params = [];

    if (updateData.itemName !== undefined) {
      fields.push('item_name = ?');
      params.push(updateData.itemName);
    }

    if (updateData.description !== undefined) {
      fields.push('description = ?');
      params.push(updateData.description);
    }

    if (updateData.amount !== undefined) {
      fields.push('amount = ?');
      params.push(updateData.amount);
    }

    if (updateData.appliesTo !== undefined) {
      fields.push('applies_to = ?');
      params.push(updateData.appliesTo);
    }

    if (updateData.classId !== undefined) {
      fields.push('class_id = ?');
      params.push(updateData.classId);
    }

    if (updateData.term !== undefined) {
      fields.push('term = ?');
      params.push(updateData.term);
    }

    if (updateData.year !== undefined) {
      fields.push('year = ?');
      params.push(updateData.year);
    }

    if (updateData.isMandatory !== undefined) {
      fields.push('is_mandatory = ?');
      params.push(updateData.isMandatory ? 1 : 0);
    }

    if (updateData.isActive !== undefined) {
      fields.push('is_active = ?');
      params.push(updateData.isActive ? 1 : 0);
    }

    if (fields.length === 0) {
      return { success: true, message: 'No changes to update' };
    }

    fields.push('updated_at = NOW()');
    params.push(itemId, schoolId);

    const query = `
      UPDATE fee_items 
      SET ${fields.join(', ')}
      WHERE id = ? AND school_id = ? AND deleted_at IS NULL
    `;

    await db.query(query, params);

    return {
      success: true,
      message: 'Fee item updated successfully'
    };
  } catch (error) {
    console.error('Update fee item error:', error);
    throw new Error(`Failed to update fee item: ${error.message}`);
  }
}

/**
 * Delete fee item (soft delete)
 */
export async function deleteFeeItem(itemId, schoolId) {
  try {
    const query = `
      UPDATE fee_items 
      SET deleted_at = NOW(), is_active = 0
      WHERE id = ? AND school_id = ?
    `;

    await db.query(query, [itemId, schoolId]);

    return {
      success: true,
      message: 'Fee item deleted successfully'
    };
  } catch (error) {
    console.error('Delete fee item error:', error);
    throw new Error(`Failed to delete fee item: ${error.message}`);
  }
}

/**
 * ==========================================
 * FEE ALLOCATION ENGINE
 * ==========================================
 */

/**
 * Allocate fees to a single student
 */
export async function allocateFeeToStudent(allocationData, userId, schoolId) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { studentId, feeItemIds, term, year, customAmounts = {} } = allocationData;

    for (const feeItemId of feeItemIds) {
      // Get fee item details
      const itemQuery = `SELECT * FROM fee_items WHERE id = ? AND school_id = ?`;
      const items = await connection.query(itemQuery, [feeItemId, schoolId]);
      
      if (!items || items.length === 0) continue;

      const item = items[0];
      const amount = customAmounts[feeItemId] || item.amount;

      // Check if already allocated
      const checkQuery = `
        SELECT id FROM student_fees 
        WHERE student_id = ? AND fee_item_id = ? AND term = ? AND year = ?
      `;
      const existing = await connection.query(checkQuery, [studentId, feeItemId, term, year]);

      if (existing && existing.length > 0) {
        // Update existing allocation
        const updateQuery = `
          UPDATE student_fees 
          SET amount = ?, updated_at = NOW()
          WHERE id = ?
        `;
        await connection.query(updateQuery, [amount, existing[0].id]);
      } else {
        // Insert new allocation
        const insertQuery = `
          INSERT INTO student_fees (
            school_id, student_id, fee_item_id, amount, 
            term, year, status, allocated_by, allocated_at
          ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, NOW())
        `;
        await connection.query(insertQuery, [
          schoolId, studentId, feeItemId, amount, term, year, userId
        ]);
      }
    }

    // Update student balance
    await updateStudentBalance(connection, studentId, schoolId, term, year);

    await connection.commit();

    return {
      success: true,
      message: 'Fees allocated successfully to student'
    };
  } catch (error) {
    await connection.rollback();
    console.error('Allocate fee error:', error);
    throw new Error(`Failed to allocate fees: ${error.message}`);
  } finally {
    connection.release();
  }
}

/**
 * Bulk allocate fees to multiple students
 */
export async function bulkAllocateFees(allocationData, userId, schoolId) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { 
      targetType, // 'all', 'class', 'stream'
      classId, 
      streamId, 
      feeItemIds, 
      term, 
      year 
    } = allocationData;

    // Get target students
    let studentIds = [];

    if (targetType === 'all') {
      const query = `
        SELECT id FROM student 
        WHERE school_id = ? AND status = 'active' AND deleted_at IS NULL
      `;
      const students = await connection.query(query, [schoolId]);
      studentIds = students.map(s => s.id);
    } else if (targetType === 'class') {
      const query = `
        SELECT id FROM student 
        WHERE school_id = ? AND class_id = ? AND status = 'active' AND deleted_at IS NULL
      `;
      const students = await connection.query(query, [schoolId, classId]);
      studentIds = students.map(s => s.id);
    } else if (targetType === 'stream') {
      const query = `
        SELECT id FROM student 
        WHERE school_id = ? AND class_id = ? AND stream_id = ? 
          AND status = 'active' AND deleted_at IS NULL
      `;
      const students = await connection.query(query, [schoolId, classId, streamId]);
      studentIds = students.map(s => s.id);
    }

    if (studentIds.length === 0) {
      throw new Error('No students found for allocation');
    }

    // Allocate to each student
    for (const studentId of studentIds) {
      for (const feeItemId of feeItemIds) {
        const itemQuery = `SELECT * FROM fee_items WHERE id = ? AND school_id = ?`;
        const items = await connection.query(itemQuery, [feeItemId, schoolId]);
        
        if (!items || items.length === 0) continue;

        const item = items[0];

        // Check if already allocated
        const checkQuery = `
          SELECT id FROM student_fees 
          WHERE student_id = ? AND fee_item_id = ? AND term = ? AND year = ?
        `;
        const existing = await connection.query(checkQuery, [studentId, feeItemId, term, year]);

        if (existing && existing.length > 0) {
          // Skip if already allocated
          continue;
        }

        // Insert allocation
        const insertQuery = `
          INSERT INTO student_fees (
            school_id, student_id, fee_item_id, amount, 
            term, year, status, allocated_by, allocated_at
          ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, NOW())
        `;
        await connection.query(insertQuery, [
          schoolId, studentId, feeItemId, item.amount, term, year, userId
        ]);
      }

      // Update student balance
      await updateStudentBalance(connection, studentId, schoolId, term, year);
    }

    await connection.commit();

    return {
      success: true,
      message: `Fees allocated successfully to ${studentIds.length} students`,
      data: {
        studentsAffected: studentIds.length
      }
    };
  } catch (error) {
    await connection.rollback();
    console.error('Bulk allocate fees error:', error);
    throw new Error(`Failed to bulk allocate fees: ${error.message}`);
  } finally {
    connection.release();
  }
}

/**
 * Get students without fee allocation
 */
export async function getUnallocatedStudents(schoolId, term, year) {
  try {
    const query = `
      SELECT 
        s.id, s.admission_no,
        p.first_name, p.last_name,
        c.name as class_name
      FROM student s
      LEFT JOIN person p ON s.person_id = p.id
      LEFT JOIN class c ON s.class_id = c.id
      LEFT JOIN student_fees sf ON s.id = sf.student_id 
        AND sf.term = ? AND sf.year = ? AND sf.deleted_at IS NULL
      WHERE s.school_id = ? 
        AND s.status = 'active' 
        AND s.deleted_at IS NULL
        AND sf.id IS NULL
      ORDER BY c.name, p.last_name
    `;

    const students = await db.query(query, [term, year, schoolId]);

    return {
      success: true,
      data: students || []
    };
  } catch (error) {
    console.error('Get unallocated students error:', error);
    throw new Error(`Failed to fetch unallocated students: ${error.message}`);
  }
}

/**
 * Get allocated fees for students
 */
export async function getAllocatedFees(schoolId, options = {}) {
  try {
    const { studentId, term, year, status } = options;

    let conditions = ['sf.school_id = ?', 'sf.deleted_at IS NULL'];
    let params = [schoolId];

    if (studentId) {
      conditions.push('sf.student_id = ?');
      params.push(studentId);
    }

    if (term) {
      conditions.push('sf.term = ?');
      params.push(term);
    }

    if (year) {
      conditions.push('sf.year = ?');
      params.push(year);
    }

    if (status) {
      conditions.push('sf.status = ?');
      params.push(status);
    }

    const whereClause = conditions.join(' AND ');

    const query = `
      SELECT 
        sf.*,
        fi.item_name, fi.description,
        s.admission_no,
        p.first_name, p.last_name,
        c.name as class_name,
        COALESCE(SUM(t.amount), 0) as amount_paid,
        (sf.amount - COALESCE(SUM(t.amount), 0)) as balance
      FROM student_fees sf
      JOIN fee_items fi ON sf.fee_item_id = fi.id
      JOIN student s ON sf.student_id = s.id
      JOIN person p ON s.person_id = p.id
      LEFT JOIN class c ON s.class_id = c.id
      LEFT JOIN transactions t ON sf.id = t.student_fee_id AND t.status = 'completed'
      WHERE ${whereClause}
      GROUP BY sf.id
      ORDER BY sf.allocated_at DESC
    `;

    const fees = await db.query(query, params);

    return {
      success: true,
      data: fees || []
    };
  } catch (error) {
    console.error('Get allocated fees error:', error);
    throw new Error(`Failed to fetch allocated fees: ${error.message}`);
  }
}

/**
 * Update student balance (helper function)
 */
async function updateStudentBalance(connection, studentId, schoolId, term, year) {
  // Calculate total fees
  const feesQuery = `
    SELECT COALESCE(SUM(amount), 0) as total_fees
    FROM student_fees
    WHERE student_id = ? AND school_id = ? AND term = ? AND year = ? AND deleted_at IS NULL
  `;
  const feesResult = await connection.query(feesQuery, [studentId, schoolId, term, year]);
  const totalFees = feesResult[0]?.total_fees || 0;

  // Calculate total paid
  const paidQuery = `
    SELECT COALESCE(SUM(t.amount), 0) as total_paid
    FROM transactions t
    JOIN student_fees sf ON t.student_fee_id = sf.id
    WHERE sf.student_id = ? AND sf.school_id = ? AND sf.term = ? AND sf.year = ?
      AND t.status = 'completed'
  `;
  const paidResult = await connection.query(paidQuery, [studentId, schoolId, term, year]);
  const totalPaid = paidResult[0]?.total_paid || 0;

  const balance = totalFees - totalPaid;

  // Update or insert student account
  const checkAccountQuery = `
    SELECT id FROM student_account
    WHERE student_id = ? AND school_id = ? AND term = ? AND year = ?
  `;
  const accountExists = await connection.query(checkAccountQuery, [studentId, schoolId, term, year]);

  if (accountExists && accountExists.length > 0) {
    const updateQuery = `
      UPDATE student_account
      SET total_fees = ?, amount_paid = ?, balance = ?, updated_at = NOW()
      WHERE id = ?
    `;
    await connection.query(updateQuery, [totalFees, totalPaid, balance, accountExists[0].id]);
  } else {
    const insertQuery = `
      INSERT INTO student_account (
        school_id, student_id, term, year, total_fees, amount_paid, balance, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    await connection.query(insertQuery, [
      schoolId, studentId, term, year, totalFees, totalPaid, balance
    ]);
  }

  return balance;
}

/**
 * ==========================================
 * PAYMENT METHODS MANAGEMENT
 * ==========================================
 */

/**
 * Create payment method
 */
export async function createPaymentMethod(methodData, schoolId) {
  try {
    const query = `
      INSERT INTO payment_methods (
        school_id, method_name, description, is_active, created_at
      ) VALUES (?, ?, ?, ?, NOW())
    `;

    const result = await db.query(query, [
      schoolId,
      methodData.methodName,
      methodData.description || null,
      methodData.isActive !== false ? 1 : 0
    ]);

    return {
      success: true,
      message: 'Payment method created successfully',
      data: {
        methodId: result.insertId
      }
    };
  } catch (error) {
    console.error('Create payment method error:', error);
    throw new Error(`Failed to create payment method: ${error.message}`);
  }
}

/**
 * Get payment methods for a school
 */
export async function getPaymentMethods(schoolId, isActive = true) {
  try {
    let query = `
      SELECT * FROM payment_methods
      WHERE school_id = ? AND deleted_at IS NULL
    `;
    const params = [schoolId];

    if (isActive !== null) {
      query += ' AND is_active = ?';
      params.push(isActive ? 1 : 0);
    }

    query += ' ORDER BY method_name';

    const methods = await db.query(query, params);

    return {
      success: true,
      data: methods || []
    };
  } catch (error) {
    console.error('Get payment methods error:', error);
    throw new Error(`Failed to fetch payment methods: ${error.message}`);
  }
}
