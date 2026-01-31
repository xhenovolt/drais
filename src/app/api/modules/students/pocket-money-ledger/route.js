/**
 * Pocket Money Financial Ledger API
 * Handles transactions: top-up, spend, borrow, repay
 * Atomic operations with balance calculations
 */

import { NextResponse } from 'next/server';
import { requireApiAuthFromCookies } from '@/lib/api-auth.js';
import { getPool } from '@/lib/db/postgres.js';

/**
 * GET /api/modules/students/pocket-money
 * Get transaction history with pagination
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

    let whereClause = 'pmt.school_id = $1';
    let params = [schoolId];
    let paramIndex = 2;

    if (studentId) {
      whereClause += ` AND pmt.student_id = $${paramIndex}`;
      params.push(studentId);
      paramIndex++;
    }

    // Get wallet info
    const wallet = await pool.query(
      `SELECT current_balance, total_credited, total_debited FROM pocket_money_wallets
       WHERE student_id = $1 AND school_id = $2`,
      [studentId, schoolId]
    );

    // Get transactions
    const result = await pool.query(
      `SELECT 
        pmt.id, pmt.student_id, pmt.transaction_type, pmt.amount,
        pmt.balance_before, pmt.balance_after, pmt.description,
        pmt.reference_number, pmt.transaction_date,
        s.first_name, s.last_name, s.admission_no
      FROM pocket_money_transactions pmt
      LEFT JOIN students s ON pmt.student_id = s.id
      WHERE ${whereClause}
      ORDER BY pmt.transaction_date DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    // Count total
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM pocket_money_transactions WHERE ${whereClause}`,
      params.slice(0, paramIndex - 1)
    );
    const total = parseInt(countResult.rows[0].total);

    return NextResponse.json({
      success: true,
      data: result.rows,
      wallet: wallet.rows[0],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
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
 * Create transaction (top-up, spend, borrow)
 * Atomic operation with rollback on failure
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

    const { student_id, transaction_type, amount, description, reference_number, related_student_id } = body;

    // Validation
    if (!student_id || !transaction_type || !amount) {
      return NextResponse.json(
        { error: 'student_id, transaction_type, and amount are required' },
        { status: 400 }
      );
    }

    if (!['credit', 'debit', 'borrow', 'repay'].includes(transaction_type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    try {
      await client.query('BEGIN');

      // Get or create wallet
      const walletResult = await client.query(
        `SELECT id FROM pocket_money_wallets WHERE student_id = $1 AND school_id = $2`,
        [student_id, schoolId]
      );

      let walletId;
      if (walletResult.rows.length === 0) {
        const newWallet = await client.query(
          `INSERT INTO pocket_money_wallets (student_id, school_id, current_balance, is_active)
           VALUES ($1, $2, 0.00, true)
           RETURNING id`,
          [student_id, schoolId]
        );
        walletId = newWallet.rows[0].id;
      } else {
        walletId = walletResult.rows[0].id;
      }

      // Get current balance
      const balanceResult = await client.query(
        `SELECT current_balance FROM pocket_money_wallets WHERE id = $1`,
        [walletId]
      );
      const balanceBefore = parseFloat(balanceResult.rows[0].current_balance);
      const amountValue = parseFloat(amount);

      // Calculate new balance based on transaction type
      let balanceAfter;
      switch (transaction_type) {
        case 'credit':
        case 'repay':
          balanceAfter = balanceBefore + amountValue;
          break;
        case 'debit':
        case 'borrow':
          balanceAfter = balanceBefore - amountValue;
          if (balanceAfter < 0) {
            throw new Error('Insufficient balance');
          }
          break;
      }

      // Create transaction record
      const transResult = await client.query(
        `INSERT INTO pocket_money_transactions (
          wallet_id, student_id, school_id, transaction_type, amount,
          balance_before, balance_after, description, reference_number,
          related_student_id, created_by, transaction_date, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, transaction_type, amount, balance_after, transaction_date`,
        [walletId, student_id, schoolId, transaction_type, amountValue,
         balanceBefore, balanceAfter, description || null, reference_number || null,
         related_student_id || null, authUser.userId]
      );

      // Update wallet balance
      await client.query(
        `UPDATE pocket_money_wallets 
         SET current_balance = $1, last_transaction_date = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [balanceAfter, walletId]
      );

      // Update wallet totals
      let creditUpdate = 0, debitUpdate = 0;
      if (transaction_type === 'credit' || transaction_type === 'repay') {
        creditUpdate = amountValue;
      } else {
        debitUpdate = amountValue;
      }

      if (creditUpdate > 0 || debitUpdate > 0) {
        await client.query(
          `UPDATE pocket_money_wallets 
           SET total_credited = total_credited + $1,
               total_debited = total_debited + $2
           WHERE id = $3`,
          [creditUpdate, debitUpdate, walletId]
        );
      }

      // Audit log
      await client.query(
        `INSERT INTO student_audit_log (school_id, student_id, user_id, action, entity_type, entity_id, changes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [schoolId, student_id, authUser.userId, 'transaction', 'pocket_money',
         transResult.rows[0].id, JSON.stringify({
           type: transaction_type,
           amount: amountValue,
           balance_after: balanceAfter
         })]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Transaction recorded successfully',
        data: {
          ...transResult.rows[0],
          balance_before: balanceBefore,
          wallet_id: walletId,
        },
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
    if (error.message === 'Insufficient balance') {
      return NextResponse.json({ error: 'Insufficient balance for this transaction' }, { status: 400 });
    }
    console.error('[Pocket Money POST]', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
