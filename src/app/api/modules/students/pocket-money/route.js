/**
 * Pocket Money Module API
 * GET /api/modules/students/pocket-money - Get all transactions
 * POST /api/modules/students/pocket-money - Create transaction
 * GET /api/modules/students/pocket-money/[student_id]/balance - Get current balance
 * 
 * DRAIS v0.0.0300 - Production Implementation
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres.js';

/**
 * GET /api/modules/students/pocket-money
 * Get all pocket money transactions
 */
export async function GET(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const pool = await getPool();
    
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    let whereClause = 'WHERE st.school_id = $1';
    const params = [schoolId];
    let paramIndex = 2;

    if (studentId) {
      whereClause += ` AND st.student_id = $${paramIndex}`;
      params.push(studentId);
      paramIndex++;
    }

    // Get total
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM student_transactions st ${whereClause}`,
      params.slice(0, paramIndex - (studentId ? 2 : 1))
    );
    const total = parseInt(countResult.rows[0].total);

    // Get transactions
    const query = `
      SELECT 
        st.id, st.student_id, st.transaction_type, st.amount,
        st.balance_before, st.balance_after, st.description,
        st.reference_number, st.transaction_date,
        s.first_name, s.last_name, s.admission_number
      FROM student_transactions st
      LEFT JOIN students s ON st.student_id = s.id
      ${whereClause}
      ORDER BY st.transaction_date DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Pocket Money GET]', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

/**
 * POST /api/modules/students/pocket-money
 * Create pocket money transaction
 */
export async function POST(request) {
  try {
    const authUser = await requireApiAuthFromCookies();
    const body = await request.json();
    const pool = await getPool();
    const client = await pool.connect();
    const schoolId = authUser.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'School not configured' }, { status: 400 });
    }

    const { student_id, transaction_type, amount, description, reference_number } = body;

    // Validation
    if (!student_id || !transaction_type || !amount) {
      return NextResponse.json(
        { error: 'student_id, transaction_type, and amount are required' },
        { status: 400 }
      );
    }

    if (!['credit', 'debit'].includes(transaction_type)) {
      return NextResponse.json(
        { error: 'transaction_type must be credit or debit' },
        { status: 400 }
      );
    }

    // Verify student exists
    const studentCheck = await pool.query(
      'SELECT id FROM students WHERE id = $1 AND school_id = $2 AND deleted_at IS NULL',
      [student_id, schoolId]
    );

    if (studentCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    try {
      await client.query('BEGIN');

      // Get current balance
      const balanceResult = await pool.query(
        `SELECT COALESCE(SUM(
          CASE 
            WHEN transaction_type = 'credit' THEN amount
            WHEN transaction_type = 'debit' THEN -amount
          END
        ), 0) as balance FROM student_transactions 
        WHERE student_id = $1 AND school_id = $2`,
        [student_id, schoolId]
      );

      const balanceBefore = parseFloat(balanceResult.rows[0].balance);
      
      // Calculate new balance
      const amountValue = parseFloat(amount);
      const balanceAfter = transaction_type === 'credit' 
        ? balanceBefore + amountValue 
        : balanceBefore - amountValue;

      // Prevent negative balance (unless explicitly allowed)
      if (balanceAfter < 0 && !body.allow_negative) {
        return NextResponse.json(
          { error: 'Insufficient balance for debit transaction' },
          { status: 400 }
        );
      }

      // Create transaction
      const result = await client.query(
        `INSERT INTO student_transactions (
          school_id, student_id, transaction_type, amount,
          balance_before, balance_after, description, reference_number,
          performed_by, transaction_date, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, transaction_type, amount, balance_after, transaction_date`,
        [
          schoolId, student_id, transaction_type, amountValue,
          balanceBefore, balanceAfter, description || null,
          reference_number || null, authUser.userId
        ]
      );

      // Log audit
      await client.query(
        `INSERT INTO student_audit_log (
          school_id, user_id, entity_type, entity_id, action, changes, created_at
        ) VALUES ($1, $2, 'pocket_money', $3, $4, $5, CURRENT_TIMESTAMP)`,
        [
          schoolId, authUser.userId, student_id, transaction_type,
          JSON.stringify({
            amount: amountValue,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            description
          })
        ]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Transaction recorded successfully',
        data: {
          ...result.rows[0],
          balance_before: balanceBefore
        }
      }, { status: 201 });

    } catch (transactionError) {
      await client.query('ROLLBACK');
      throw transactionError;
    } finally {
      client.release();
    }

  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Pocket Money POST]', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
