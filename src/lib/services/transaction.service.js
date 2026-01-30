/**
 * Transaction Service - DRAIS v0.0.0046
 * 
 * Handles payment recording, receipts, and invoices
 */

import db from '../db/index.js';
import { generateReceipt, generateInvoice } from './receipt.service.js';

/**
 * Record a manual payment
 */
export async function recordPayment(paymentData, userId, schoolId) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      studentId,
      amountPaid,
      feeItemId,
      payerName,
      relationshipToLearner,
      paymentMethodId,
      referenceNumber,
      term,
      year,
      notes
    } = paymentData;

    // Insert transaction
    const transactionQuery = `
      INSERT INTO transactions (
        school_id, student_id, student_fee_id, amount, 
        payment_method_id, payer_name, relationship_to_learner,
        reference_number, term, year, notes,
        status, recorded_by, transaction_date, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, NOW(), NOW())
    `;

    // Get student fee ID if feeItemId provided
    let studentFeeId = null;
    if (feeItemId) {
      const feeQuery = `
        SELECT id FROM student_fees 
        WHERE student_id = ? AND fee_item_id = ? AND term = ? AND year = ?
        LIMIT 1
      `;
      const feeResult = await connection.query(feeQuery, [studentId, feeItemId, term, year]);
      if (feeResult && feeResult.length > 0) {
        studentFeeId = feeResult[0].id;
      }
    }

    const transactionResult = await connection.query(transactionQuery, [
      schoolId,
      studentId,
      studentFeeId,
      amountPaid,
      paymentMethodId,
      payerName || null,
      relationshipToLearner || null,
      referenceNumber || null,
      term,
      year,
      notes || null,
      userId
    ]);

    const transactionId = transactionResult.insertId;

    // Update student fee status if specific fee item
    if (studentFeeId) {
      const updateFeeQuery = `
        UPDATE student_fees
        SET status = CASE 
          WHEN (amount - (
            SELECT COALESCE(SUM(amount), 0) 
            FROM transactions 
            WHERE student_fee_id = ? AND status = 'completed'
          )) <= 0 THEN 'paid'
          ELSE 'partial'
        END,
        updated_at = NOW()
        WHERE id = ?
      `;
      await connection.query(updateFeeQuery, [studentFeeId, studentFeeId]);
    }

    // Update student balance
    const balanceQuery = `
      SELECT id FROM student_account
      WHERE student_id = ? AND school_id = ? AND term = ? AND year = ?
    `;
    const accountResult = await connection.query(balanceQuery, [studentId, schoolId, term, year]);

    if (accountResult && accountResult.length > 0) {
      const accountId = accountResult[0].id;
      
      // Recalculate balance
      const totalPaidQuery = `
        SELECT COALESCE(SUM(amount), 0) as total_paid
        FROM transactions
        WHERE student_id = ? AND term = ? AND year = ? AND status = 'completed'
      `;
      const paidResult = await connection.query(totalPaidQuery, [studentId, term, year]);
      const totalPaid = paidResult[0]?.total_paid || 0;

      const updateAccountQuery = `
        UPDATE student_account
        SET amount_paid = ?, 
            balance = (total_fees - ?),
            last_payment_date = NOW(),
            updated_at = NOW()
        WHERE id = ?
      `;
      await connection.query(updateAccountQuery, [totalPaid, totalPaid, accountId]);
    }

    await connection.commit();

    // Generate receipt
    const receipt = await generateReceipt(transactionId, schoolId);

    // Check if invoice needed (balance > 0)
    const balanceCheckQuery = `
      SELECT balance FROM student_account
      WHERE student_id = ? AND school_id = ? AND term = ? AND year = ?
    `;
    const balanceCheckResult = await db.query(balanceCheckQuery, [studentId, schoolId, term, year]);
    const currentBalance = balanceCheckResult[0]?.balance || 0;

    let invoice = null;
    if (currentBalance > 0) {
      invoice = await generateInvoice(studentId, schoolId, term, year);
    }

    return {
      success: true,
      message: 'Payment recorded successfully',
      data: {
        transactionId,
        receipt,
        invoice,
        balance: currentBalance
      }
    };
  } catch (error) {
    await connection.rollback();
    console.error('Record payment error:', error);
    throw new Error(`Failed to record payment: ${error.message}`);
  } finally {
    connection.release();
  }
}

/**
 * Get transaction history
 */
export async function getTransactions(schoolId, options = {}) {
  try {
    const {
      studentId,
      term,
      year,
      paymentMethodId,
      dateFrom,
      dateTo,
      page = 1,
      limit = 50
    } = options;

    let conditions = ['t.school_id = ?'];
    let params = [schoolId];

    if (studentId) {
      conditions.push('t.student_id = ?');
      params.push(studentId);
    }

    if (term) {
      conditions.push('t.term = ?');
      params.push(term);
    }

    if (year) {
      conditions.push('t.year = ?');
      params.push(year);
    }

    if (paymentMethodId) {
      conditions.push('t.payment_method_id = ?');
      params.push(paymentMethodId);
    }

    if (dateFrom) {
      conditions.push('t.transaction_date >= ?');
      params.push(dateFrom);
    }

    if (dateTo) {
      conditions.push('t.transaction_date <= ?');
      params.push(dateTo);
    }

    const whereClause = conditions.join(' AND ');
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total FROM transactions t
      WHERE ${whereClause}
    `;
    const countResult = await db.query(countQuery, params);
    const total = countResult[0]?.total || 0;

    // Get transactions
    const query = `
      SELECT 
        t.*,
        s.admission_no,
        p.first_name, p.last_name,
        c.name as class_name,
        pm.method_name as payment_method,
        fi.item_name as fee_item_name,
        u.first_name as recorded_by_name
      FROM transactions t
      JOIN student s ON t.student_id = s.id
      JOIN person p ON s.person_id = p.id
      LEFT JOIN class c ON s.class_id = c.id
      LEFT JOIN payment_methods pm ON t.payment_method_id = pm.id
      LEFT JOIN student_fees sf ON t.student_fee_id = sf.id
      LEFT JOIN fee_items fi ON sf.fee_item_id = fi.id
      LEFT JOIN users u ON t.recorded_by = u.id
      WHERE ${whereClause}
      ORDER BY t.transaction_date DESC, t.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const transactions = await db.query(query, params);

    return {
      success: true,
      data: transactions || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Get transactions error:', error);
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }
}

/**
 * Get student transaction summary
 */
export async function getStudentTransactionSummary(studentId, schoolId, term, year) {
  try {
    const query = `
      SELECT 
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as total_paid,
        MIN(transaction_date) as first_payment_date,
        MAX(transaction_date) as last_payment_date
      FROM transactions
      WHERE student_id = ? AND school_id = ? AND term = ? AND year = ?
        AND status = 'completed'
    `;

    const result = await db.query(query, [studentId, schoolId, term, year]);

    return {
      success: true,
      data: result[0] || {
        transaction_count: 0,
        total_paid: 0,
        first_payment_date: null,
        last_payment_date: null
      }
    };
  } catch (error) {
    console.error('Get transaction summary error:', error);
    throw new Error(`Failed to fetch transaction summary: ${error.message}`);
  }
}

/**
 * Get payment statistics by method
 */
export async function getPaymentMethodStats(schoolId, term, year) {
  try {
    const query = `
      SELECT 
        pm.method_name,
        COUNT(t.id) as transaction_count,
        COALESCE(SUM(t.amount), 0) as total_amount
      FROM payment_methods pm
      LEFT JOIN transactions t ON pm.id = t.payment_method_id 
        AND t.term = ? AND t.year = ? AND t.status = 'completed'
      WHERE pm.school_id = ? AND pm.deleted_at IS NULL
      GROUP BY pm.id, pm.method_name
      ORDER BY total_amount DESC
    `;

    const stats = await db.query(query, [term, year, schoolId]);

    return {
      success: true,
      data: stats || []
    };
  } catch (error) {
    console.error('Get payment method stats error:', error);
    throw new Error(`Failed to fetch payment method statistics: ${error.message}`);
  }
}
