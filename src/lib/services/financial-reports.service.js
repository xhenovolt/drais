/**
 * Financial Reports Service - DRAIS v0.0.0046
 * 
 * Generates periodic financial analytics and reports
 */

import db from '../db/index.js';

/**
 * Get daily financial report
 */
export async function getDailyReport(schoolId, date) {
  try {
    const reportDate = date || new Date().toISOString().split('T')[0];

    // Total collected today
    const collectionQuery = `
      SELECT 
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as total_collected
      FROM transactions
      WHERE school_id = ? 
        AND DATE(transaction_date) = ?
        AND status = 'completed'
    `;
    const collectionResult = await db.query(collectionQuery, [schoolId, reportDate]);
    const collection = collectionResult[0] || { transaction_count: 0, total_collected: 0 };

    // Payment method breakdown
    const methodsQuery = `
      SELECT 
        pm.method_name,
        COUNT(t.id) as count,
        COALESCE(SUM(t.amount), 0) as total
      FROM payment_methods pm
      LEFT JOIN transactions t ON pm.id = t.payment_method_id
        AND DATE(t.transaction_date) = ? AND t.status = 'completed'
      WHERE pm.school_id = ? AND pm.deleted_at IS NULL
      GROUP BY pm.id, pm.method_name
      ORDER BY total DESC
    `;
    const methods = await db.query(methodsQuery, [reportDate, schoolId]);

    // Top payers today
    const topPayersQuery = `
      SELECT 
        s.admission_no,
        p.first_name, p.last_name,
        c.name as class_name,
        SUM(t.amount) as total_paid,
        COUNT(t.id) as payment_count
      FROM transactions t
      JOIN student s ON t.student_id = s.id
      JOIN person p ON s.person_id = p.id
      LEFT JOIN class c ON s.class_id = c.id
      WHERE t.school_id = ? 
        AND DATE(t.transaction_date) = ?
        AND t.status = 'completed'
      GROUP BY s.id
      ORDER BY total_paid DESC
      LIMIT 10
    `;
    const topPayers = await db.query(topPayersQuery, [schoolId, reportDate]);

    // Hourly distribution
    const hourlyQuery = `
      SELECT 
        HOUR(transaction_date) as hour,
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as amount
      FROM transactions
      WHERE school_id = ? 
        AND DATE(transaction_date) = ?
        AND status = 'completed'
      GROUP BY HOUR(transaction_date)
      ORDER BY hour
    `;
    const hourlyDistribution = await db.query(hourlyQuery, [schoolId, reportDate]);

    return {
      success: true,
      data: {
        date: reportDate,
        summary: collection,
        paymentMethods: methods || [],
        topPayers: topPayers || [],
        hourlyDistribution: hourlyDistribution || []
      }
    };
  } catch (error) {
    console.error('Get daily report error:', error);
    throw new Error(`Failed to generate daily report: ${error.message}`);
  }
}

/**
 * Get weekly financial report
 */
export async function getWeeklyReport(schoolId, weekStart) {
  try {
    const startDate = weekStart || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Weekly summary
    const summaryQuery = `
      SELECT 
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as total_collected,
        AVG(amount) as avg_transaction,
        MIN(amount) as min_transaction,
        MAX(amount) as max_transaction
      FROM transactions
      WHERE school_id = ? 
        AND DATE(transaction_date) BETWEEN ? AND ?
        AND status = 'completed'
    `;
    const summaryResult = await db.query(summaryQuery, [schoolId, startDate, endDate]);
    const summary = summaryResult[0] || {};

    // Daily breakdown
    const dailyQuery = `
      SELECT 
        DATE(transaction_date) as date,
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as total_collected
      FROM transactions
      WHERE school_id = ? 
        AND DATE(transaction_date) BETWEEN ? AND ?
        AND status = 'completed'
      GROUP BY DATE(transaction_date)
      ORDER BY date
    `;
    const dailyBreakdown = await db.query(dailyQuery, [schoolId, startDate, endDate]);

    // Top classes by collection
    const classQuery = `
      SELECT 
        c.name as class_name,
        COUNT(DISTINCT s.id) as student_count,
        COUNT(t.id) as transaction_count,
        COALESCE(SUM(t.amount), 0) as total_collected
      FROM class c
      LEFT JOIN student s ON c.id = s.class_id AND s.school_id = ?
      LEFT JOIN transactions t ON s.id = t.student_id 
        AND DATE(t.transaction_date) BETWEEN ? AND ?
        AND t.status = 'completed'
      WHERE c.school_id = ?
      GROUP BY c.id
      ORDER BY total_collected DESC
    `;
    const classList = await db.query(classQuery, [schoolId, startDate, endDate, schoolId]);

    return {
      success: true,
      data: {
        period: { startDate, endDate },
        summary,
        dailyBreakdown: dailyBreakdown || [],
        classList: classList || []
      }
    };
  } catch (error) {
    console.error('Get weekly report error:', error);
    throw new Error(`Failed to generate weekly report: ${error.message}`);
  }
}

/**
 * Get monthly financial report
 */
export async function getMonthlyReport(schoolId, month, year) {
  try {
    const currentYear = year || new Date().getFullYear();
    const currentMonth = month || (new Date().getMonth() + 1);

    // Monthly summary
    const summaryQuery = `
      SELECT 
        COUNT(*) as transaction_count,
        COUNT(DISTINCT student_id) as unique_payers,
        COALESCE(SUM(amount), 0) as total_collected,
        AVG(amount) as avg_transaction
      FROM transactions
      WHERE school_id = ? 
        AND YEAR(transaction_date) = ?
        AND MONTH(transaction_date) = ?
        AND status = 'completed'
    `;
    const summaryResult = await db.query(summaryQuery, [schoolId, currentYear, currentMonth]);
    const summary = summaryResult[0] || {};

    // Outstanding balances
    const outstandingQuery = `
      SELECT 
        COUNT(*) as students_with_balance,
        COALESCE(SUM(balance), 0) as total_outstanding
      FROM student_account
      WHERE school_id = ? 
        AND year = ?
        AND balance > 0
    `;
    const outstandingResult = await db.query(outstandingQuery, [schoolId, currentYear]);
    const outstanding = outstandingResult[0] || {};

    // Weekly breakdown within month
    const weeklyQuery = `
      SELECT 
        WEEK(transaction_date, 1) as week_number,
        DATE(MIN(transaction_date)) as week_start,
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as total_collected
      FROM transactions
      WHERE school_id = ? 
        AND YEAR(transaction_date) = ?
        AND MONTH(transaction_date) = ?
        AND status = 'completed'
      GROUP BY WEEK(transaction_date, 1)
      ORDER BY week_number
    `;
    const weeklyBreakdown = await db.query(weeklyQuery, [schoolId, currentYear, currentMonth]);

    // Top debtors
    const debtorsQuery = `
      SELECT 
        s.admission_no,
        p.first_name, p.last_name,
        c.name as class_name,
        sa.total_fees,
        sa.amount_paid,
        sa.balance
      FROM student_account sa
      JOIN student s ON sa.student_id = s.id
      JOIN person p ON s.person_id = p.id
      LEFT JOIN class c ON s.class_id = c.id
      WHERE sa.school_id = ? 
        AND sa.year = ?
        AND sa.balance > 0
      ORDER BY sa.balance DESC
      LIMIT 20
    `;
    const topDebtors = await db.query(debtorsQuery, [schoolId, currentYear]);

    // Payment method statistics
    const methodStatsQuery = `
      SELECT 
        pm.method_name,
        COUNT(t.id) as transaction_count,
        COALESCE(SUM(t.amount), 0) as total_amount,
        AVG(t.amount) as avg_amount
      FROM payment_methods pm
      LEFT JOIN transactions t ON pm.id = t.payment_method_id
        AND YEAR(t.transaction_date) = ?
        AND MONTH(t.transaction_date) = ?
        AND t.status = 'completed'
      WHERE pm.school_id = ? AND pm.deleted_at IS NULL
      GROUP BY pm.id, pm.method_name
      ORDER BY total_amount DESC
    `;
    const methodStats = await db.query(methodStatsQuery, [currentYear, currentMonth, schoolId]);

    return {
      success: true,
      data: {
        period: { month: currentMonth, year: currentYear },
        summary,
        outstanding,
        weeklyBreakdown: weeklyBreakdown || [],
        topDebtors: topDebtors || [],
        paymentMethodStats: methodStats || []
      }
    };
  } catch (error) {
    console.error('Get monthly report error:', error);
    throw new Error(`Failed to generate monthly report: ${error.message}`);
  }
}

/**
 * Get termly financial report
 */
export async function getTermlyReport(schoolId, term, year) {
  try {
    const currentYear = year || new Date().getFullYear();
    const currentTerm = term || 1;

    // Term summary
    const summaryQuery = `
      SELECT 
        COUNT(*) as transaction_count,
        COUNT(DISTINCT student_id) as unique_payers,
        COALESCE(SUM(amount), 0) as total_collected
      FROM transactions
      WHERE school_id = ? 
        AND term = ?
        AND year = ?
        AND status = 'completed'
    `;
    const summaryResult = await db.query(summaryQuery, [schoolId, currentTerm, currentYear]);
    const summary = summaryResult[0] || {};

    // Fee allocation vs collection
    const allocationQuery = `
      SELECT 
        COUNT(DISTINCT sf.student_id) as students_with_fees,
        COALESCE(SUM(sf.amount), 0) as total_allocated,
        COALESCE(SUM(sa.amount_paid), 0) as total_collected,
        COALESCE(SUM(sa.balance), 0) as total_outstanding
      FROM student_fees sf
      LEFT JOIN student_account sa ON sf.student_id = sa.student_id 
        AND sa.term = sf.term AND sa.year = sf.year
      WHERE sf.school_id = ? 
        AND sf.term = ?
        AND sf.year = ?
        AND sf.deleted_at IS NULL
    `;
    const allocationResult = await db.query(allocationQuery, [schoolId, currentTerm, currentYear]);
    const allocation = allocationResult[0] || {};

    // Calculate collection rate
    const collectionRate = allocation.total_allocated > 0 
      ? ((allocation.total_collected / allocation.total_allocated) * 100).toFixed(2)
      : 0;

    // Class-wise performance
    const classPerformanceQuery = `
      SELECT 
        c.name as class_name,
        COUNT(DISTINCT s.id) as total_students,
        COALESCE(SUM(sa.total_fees), 0) as total_fees,
        COALESCE(SUM(sa.amount_paid), 0) as amount_paid,
        COALESCE(SUM(sa.balance), 0) as balance,
        CASE 
          WHEN SUM(sa.total_fees) > 0 
          THEN (SUM(sa.amount_paid) / SUM(sa.total_fees) * 100)
          ELSE 0 
        END as collection_rate
      FROM class c
      LEFT JOIN student s ON c.id = s.class_id AND s.school_id = ? AND s.status = 'active'
      LEFT JOIN student_account sa ON s.id = sa.student_id 
        AND sa.term = ? AND sa.year = ?
      WHERE c.school_id = ?
      GROUP BY c.id
      ORDER BY collection_rate DESC
    `;
    const classPerformance = await db.query(classPerformanceQuery, [
      schoolId, currentTerm, currentYear, schoolId
    ]);

    // Fee items performance
    const feeItemsQuery = `
      SELECT 
        fi.item_name,
        COUNT(sf.id) as allocation_count,
        COALESCE(SUM(sf.amount), 0) as total_allocated,
        COALESCE(SUM(
          SELECT COALESCE(SUM(t.amount), 0)
          FROM transactions t
          WHERE t.student_fee_id = sf.id AND t.status = 'completed'
        ), 0) as total_collected,
        COUNT(CASE WHEN sf.status = 'paid' THEN 1 END) as fully_paid_count
      FROM fee_items fi
      LEFT JOIN student_fees sf ON fi.id = sf.fee_item_id 
        AND sf.term = ? AND sf.year = ?
      WHERE fi.school_id = ?
        AND fi.deleted_at IS NULL
      GROUP BY fi.id
      ORDER BY total_allocated DESC
    `;
    const feeItems = await db.query(feeItemsQuery, [currentTerm, currentYear, schoolId]);

    // Students fully paid vs owing
    const studentStatusQuery = `
      SELECT 
        COUNT(CASE WHEN balance = 0 THEN 1 END) as fully_paid,
        COUNT(CASE WHEN balance > 0 AND balance < total_fees THEN 1 END) as partial,
        COUNT(CASE WHEN balance >= total_fees THEN 1 END) as not_paid,
        COUNT(*) as total_students
      FROM student_account
      WHERE school_id = ? AND term = ? AND year = ?
    `;
    const studentStatusResult = await db.query(studentStatusQuery, [schoolId, currentTerm, currentYear]);
    const studentStatus = studentStatusResult[0] || {};

    return {
      success: true,
      data: {
        period: { term: currentTerm, year: currentYear },
        summary,
        allocation: {
          ...allocation,
          collectionRate
        },
        classPerformance: classPerformance || [],
        feeItems: feeItems || [],
        studentStatus
      }
    };
  } catch (error) {
    console.error('Get termly report error:', error);
    throw new Error(`Failed to generate termly report: ${error.message}`);
  }
}

/**
 * Get comparative analysis (term-to-term)
 */
export async function getComparativeAnalysis(schoolId, year) {
  try {
    const currentYear = year || new Date().getFullYear();

    const query = `
      SELECT 
        term,
        COUNT(DISTINCT t.student_id) as unique_payers,
        COUNT(t.id) as transaction_count,
        COALESCE(SUM(t.amount), 0) as total_collected,
        AVG(t.amount) as avg_transaction
      FROM transactions t
      WHERE t.school_id = ? 
        AND t.year = ?
        AND t.status = 'completed'
      GROUP BY term
      ORDER BY term
    `;

    const termData = await db.query(query, [schoolId, currentYear]);

    // Calculate growth rates
    const analysis = [];
    for (let i = 0; i < termData.length; i++) {
      const current = termData[i];
      const previous = i > 0 ? termData[i - 1] : null;

      analysis.push({
        term: current.term,
        metrics: current,
        growth: previous ? {
          collection: ((current.total_collected - previous.total_collected) / previous.total_collected * 100).toFixed(2),
          transactions: ((current.transaction_count - previous.transaction_count) / previous.transaction_count * 100).toFixed(2),
          payers: ((current.unique_payers - previous.unique_payers) / previous.unique_payers * 100).toFixed(2)
        } : null
      });
    }

    return {
      success: true,
      data: {
        year: currentYear,
        analysis
      }
    };
  } catch (error) {
    console.error('Get comparative analysis error:', error);
    throw new Error(`Failed to generate comparative analysis: ${error.message}`);
  }
}
