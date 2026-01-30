/**
 * AI Financial Predictions Service - DRAIS v0.0.0046
 * 
 * Machine learning-based predictions for financial insights
 * Uses transaction history and payment patterns
 */

import db from '../db/index.js';

/**
 * Predict fee completion date for a student
 */
export async function predictFeeCompletionDate(studentId, schoolId, term, year) {
  try {
    // Get student's payment history
    const historyQuery = `
      SELECT 
        transaction_date,
        amount,
        DATEDIFF(transaction_date, LAG(transaction_date) OVER (ORDER BY transaction_date)) as days_between
      FROM transactions
      WHERE student_id = ? AND school_id = ? AND status = 'completed'
      ORDER BY transaction_date
    `;
    const history = await db.query(historyQuery, [studentId, schoolId]);

    if (!history || history.length < 2) {
      return {
        success: true,
        data: {
          hasSufficientData: false,
          message: 'Insufficient payment history for prediction'
        }
      };
    }

    // Calculate average payment interval
    const intervals = history
      .filter(h => h.days_between !== null)
      .map(h => h.days_between);
    
    const avgInterval = intervals.length > 0
      ? intervals.reduce((sum, val) => sum + val, 0) / intervals.length
      : 30;

    // Get current balance
    const balanceQuery = `
      SELECT balance, amount_paid, total_fees
      FROM student_account
      WHERE student_id = ? AND school_id = ? AND term = ? AND year = ?
    `;
    const balanceResult = await db.query(balanceQuery, [studentId, schoolId, term, year]);
    
    if (!balanceResult || balanceResult.length === 0) {
      return {
        success: true,
        data: {
          hasSufficientData: false,
          message: 'No fee allocation found'
        }
      };
    }

    const { balance, amount_paid, total_fees } = balanceResult[0];

    if (balance <= 0) {
      return {
        success: true,
        data: {
          completed: true,
          message: 'Fees already completed'
        }
      };
    }

    // Calculate average payment amount
    const totalPaid = history.reduce((sum, h) => sum + Number(h.amount), 0);
    const avgPayment = totalPaid / history.length;

    // Predict number of payments needed
    const paymentsNeeded = Math.ceil(balance / avgPayment);

    // Predict completion date
    const lastPaymentDate = history[history.length - 1].transaction_date;
    const estimatedDays = paymentsNeeded * avgInterval;
    const predictedDate = new Date(new Date(lastPaymentDate).getTime() + estimatedDays * 24 * 60 * 60 * 1000);

    // Calculate confidence based on payment regularity
    const variance = intervals.length > 1
      ? intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length
      : 0;
    const stdDev = Math.sqrt(variance);
    const confidence = Math.max(0, Math.min(100, 100 - (stdDev / avgInterval * 100)));

    return {
      success: true,
      data: {
        hasSufficientData: true,
        currentBalance: balance,
        totalFees: total_fees,
        amountPaid: amount_paid,
        paymentHistory: history.length,
        avgPaymentAmount: avgPayment.toFixed(2),
        avgPaymentInterval: avgInterval.toFixed(0),
        paymentsNeeded,
        predictedCompletionDate: predictedDate.toISOString().split('T')[0],
        daysUntilCompletion: estimatedDays.toFixed(0),
        confidence: confidence.toFixed(2)
      }
    };
  } catch (error) {
    console.error('Predict fee completion error:', error);
    throw new Error(`Failed to predict fee completion: ${error.message}`);
  }
}

/**
 * Calculate probability of on-time payment
 */
export async function calculatePaymentProbability(studentId, schoolId, term, year) {
  try {
    // Get historical on-time performance
    const historyQuery = `
      SELECT 
        COUNT(*) as total_terms,
        COUNT(CASE WHEN balance = 0 THEN 1 END) as completed_terms,
        AVG(CASE WHEN balance = 0 THEN 1 ELSE 0 END) * 100 as completion_rate
      FROM student_account
      WHERE student_id = ? AND school_id = ?
    `;
    const historyResult = await db.query(historyQuery, [studentId, schoolId]);
    const history = historyResult[0] || { total_terms: 0, completed_terms: 0, completion_rate: 0 };

    // Get current term progress
    const progressQuery = `
      SELECT 
        total_fees,
        amount_paid,
        balance,
        DATEDIFF(NOW(), created_at) as days_elapsed
      FROM student_account
      WHERE student_id = ? AND school_id = ? AND term = ? AND year = ?
    `;
    const progressResult = await db.query(progressQuery, [studentId, schoolId, term, year]);
    
    if (!progressResult || progressResult.length === 0) {
      return {
        success: true,
        data: {
          probability: 0,
          factors: ['No fee allocation found']
        }
      };
    }

    const progress = progressResult[0];
    const paymentRate = progress.total_fees > 0 
      ? (progress.amount_paid / progress.total_fees) * 100
      : 0;

    // Factors affecting probability
    const factors = [];
    let probability = 50; // Base probability

    // Historical performance (40% weight)
    probability += (history.completion_rate - 50) * 0.4;
    if (history.completion_rate > 80) {
      factors.push('Strong payment history');
    } else if (history.completion_rate < 30) {
      factors.push('Weak payment history');
    }

    // Current term progress (30% weight)
    const expectedProgress = Math.min(100, (progress.days_elapsed / 90) * 100); // Assume 90-day term
    const progressGap = paymentRate - expectedProgress;
    probability += progressGap * 0.3;

    if (paymentRate > expectedProgress + 20) {
      factors.push('Ahead of schedule');
    } else if (paymentRate < expectedProgress - 20) {
      factors.push('Behind schedule');
    }

    // Payment consistency (20% weight)
    const transactionCountQuery = `
      SELECT COUNT(*) as count
      FROM transactions
      WHERE student_id = ? AND term = ? AND year = ? AND status = 'completed'
    `;
    const transactionResult = await db.query(transactionCountQuery, [studentId, term, year]);
    const transactionCount = transactionResult[0]?.count || 0;

    if (transactionCount >= 3) {
      probability += 10;
      factors.push('Regular payment pattern');
    } else if (transactionCount === 0) {
      probability -= 20;
      factors.push('No payments made');
    }

    // Balance proximity (10% weight)
    if (progress.balance <= progress.total_fees * 0.2) {
      probability += 10;
      factors.push('Near completion');
    } else if (progress.balance >= progress.total_fees * 0.8) {
      probability -= 10;
      factors.push('Large outstanding balance');
    }

    // Clamp probability between 0 and 100
    probability = Math.max(0, Math.min(100, probability));

    return {
      success: true,
      data: {
        probability: probability.toFixed(2),
        paymentRate: paymentRate.toFixed(2),
        expectedProgress: expectedProgress.toFixed(2),
        historicalCompletionRate: history.completion_rate.toFixed(2),
        factors,
        recommendation: probability > 70 
          ? 'Likely to complete on time' 
          : probability > 40 
          ? 'May need reminder' 
          : 'High risk - requires immediate follow-up'
      }
    };
  } catch (error) {
    console.error('Calculate payment probability error:', error);
    throw new Error(`Failed to calculate payment probability: ${error.message}`);
  }
}

/**
 * Forecast monthly cash flow
 */
export async function forecastCashFlow(schoolId, months = 3) {
  try {
    // Get historical monthly data
    const historyQuery = `
      SELECT 
        YEAR(transaction_date) as year,
        MONTH(transaction_date) as month,
        COALESCE(SUM(amount), 0) as total_collected,
        COUNT(*) as transaction_count
      FROM transactions
      WHERE school_id = ? 
        AND status = 'completed'
        AND transaction_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY YEAR(transaction_date), MONTH(transaction_date)
      ORDER BY year, month
    `;
    const history = await db.query(historyQuery, [schoolId]);

    if (!history || history.length < 3) {
      return {
        success: true,
        data: {
          hasSufficientData: false,
          message: 'Insufficient historical data for forecasting'
        }
      };
    }

    // Calculate moving average and trend
    const recentMonths = history.slice(-6); // Last 6 months
    const avgMonthly = recentMonths.reduce((sum, m) => sum + Number(m.total_collected), 0) / recentMonths.length;

    // Simple linear trend
    let trendSlope = 0;
    if (recentMonths.length >= 2) {
      const firstHalf = recentMonths.slice(0, 3).reduce((sum, m) => sum + Number(m.total_collected), 0) / 3;
      const secondHalf = recentMonths.slice(3).reduce((sum, m) => sum + Number(m.total_collected), 0) / 3;
      trendSlope = (secondHalf - firstHalf) / 3;
    }

    // Generate forecast
    const forecast = [];
    const currentDate = new Date();

    for (let i = 1; i <= months; i++) {
      const forecastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const predictedAmount = avgMonthly + (trendSlope * i);

      // Add seasonal adjustment (if term-based)
      let seasonalFactor = 1.0;
      const forecastMonth = forecastDate.getMonth() + 1;
      
      // Typical school terms: Jan-Apr (Term 1), May-Aug (Term 2), Sep-Dec (Term 3)
      if ([1, 5, 9].includes(forecastMonth)) {
        seasonalFactor = 1.3; // Start of term spike
      } else if ([4, 8, 12].includes(forecastMonth)) {
        seasonalFactor = 0.8; // End of term slowdown
      }

      const adjustedPrediction = predictedAmount * seasonalFactor;

      forecast.push({
        month: forecastDate.getMonth() + 1,
        year: forecastDate.getFullYear(),
        predictedAmount: adjustedPrediction.toFixed(2),
        confidence: Math.max(50, 90 - (i * 10)) // Confidence decreases with distance
      });
    }

    return {
      success: true,
      data: {
        hasSufficientData: true,
        historicalAverage: avgMonthly.toFixed(2),
        trend: trendSlope > 0 ? 'increasing' : trendSlope < 0 ? 'decreasing' : 'stable',
        trendRate: (Math.abs(trendSlope) / avgMonthly * 100).toFixed(2),
        forecast
      }
    };
  } catch (error) {
    console.error('Forecast cash flow error:', error);
    throw new Error(`Failed to forecast cash flow: ${error.message}`);
  }
}

/**
 * Analyze class-wise payment trends
 */
export async function analyzeClassTrends(schoolId, term, year) {
  try {
    const query = `
      SELECT 
        c.id as class_id,
        c.name as class_name,
        COUNT(DISTINCT s.id) as total_students,
        COALESCE(SUM(sa.total_fees), 0) as total_fees,
        COALESCE(SUM(sa.amount_paid), 0) as amount_paid,
        COALESCE(SUM(sa.balance), 0) as balance,
        CASE 
          WHEN SUM(sa.total_fees) > 0 
          THEN (SUM(sa.amount_paid) / SUM(sa.total_fees) * 100)
          ELSE 0 
        END as collection_rate,
        COUNT(CASE WHEN sa.balance = 0 THEN 1 END) as fully_paid_count,
        COUNT(CASE WHEN sa.balance > 0 AND sa.balance < sa.total_fees THEN 1 END) as partial_count,
        COUNT(CASE WHEN sa.balance >= sa.total_fees THEN 1 END) as not_paid_count,
        AVG(sa.amount_paid) as avg_paid_per_student
      FROM class c
      LEFT JOIN student s ON c.id = s.class_id AND s.school_id = ? AND s.status = 'active'
      LEFT JOIN student_account sa ON s.id = sa.student_id 
        AND sa.term = ? AND sa.year = ?
      WHERE c.school_id = ?
      GROUP BY c.id
      ORDER BY collection_rate DESC
    `;

    const classes = await db.query(query, [schoolId, term, year, schoolId]);

    // Calculate insights
    const insights = [];
    const avgCollectionRate = classes.reduce((sum, c) => sum + Number(c.collection_rate), 0) / classes.length;

    for (const cls of classes) {
      const rate = Number(cls.collection_rate);
      
      if (rate > avgCollectionRate + 20) {
        insights.push(`${cls.class_name} performing exceptionally well (${rate.toFixed(1)}%)`);
      } else if (rate < avgCollectionRate - 20) {
        insights.push(`${cls.class_name} needs attention (${rate.toFixed(1)}%)`);
      }

      if (cls.not_paid_count > cls.total_students * 0.3) {
        insights.push(`${cls.class_name} has high non-payment rate (${cls.not_paid_count}/${cls.total_students})`);
      }
    }

    return {
      success: true,
      data: {
        classes: classes || [],
        overallCollectionRate: avgCollectionRate.toFixed(2),
        insights
      }
    };
  } catch (error) {
    console.error('Analyze class trends error:', error);
    throw new Error(`Failed to analyze class trends: ${error.message}`);
  }
}

/**
 * Detect unusual payment patterns
 */
export async function detectUnusualPayments(schoolId, days = 7) {
  try {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Get payment statistics
    const statsQuery = `
      SELECT 
        AVG(amount) as avg_amount,
        STDDEV(amount) as std_dev
      FROM transactions
      WHERE school_id = ? 
        AND status = 'completed'
        AND transaction_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `;
    const statsResult = await db.query(statsQuery, [schoolId]);
    const stats = statsResult[0] || { avg_amount: 0, std_dev: 0 };

    // Find unusual payments (outside 2 standard deviations)
    const threshold = Number(stats.avg_amount) + (2 * Number(stats.std_dev));
    const lowerThreshold = Math.max(0, Number(stats.avg_amount) - (2 * Number(stats.std_dev)));

    const unusualQuery = `
      SELECT 
        t.*,
        s.admission_no,
        p.first_name, p.last_name,
        c.name as class_name,
        pm.method_name
      FROM transactions t
      JOIN student s ON t.student_id = s.id
      JOIN person p ON s.person_id = p.id
      LEFT JOIN class c ON s.class_id = c.id
      LEFT JOIN payment_methods pm ON t.payment_method_id = pm.id
      WHERE t.school_id = ? 
        AND t.status = 'completed'
        AND t.transaction_date >= ?
        AND (t.amount > ? OR t.amount < ?)
      ORDER BY t.transaction_date DESC
    `;

    const unusual = await db.query(unusualQuery, [schoolId, startDate, threshold, lowerThreshold]);

    const findings = unusual.map(t => ({
      ...t,
      reason: Number(t.amount) > threshold 
        ? 'Exceptionally large payment'
        : 'Exceptionally small payment',
      deviation: ((Number(t.amount) - Number(stats.avg_amount)) / Number(stats.std_dev)).toFixed(2)
    }));

    return {
      success: true,
      data: {
        averagePayment: Number(stats.avg_amount).toFixed(2),
        standardDeviation: Number(stats.std_dev).toFixed(2),
        upperThreshold: threshold.toFixed(2),
        lowerThreshold: lowerThreshold.toFixed(2),
        unusualPayments: findings,
        count: findings.length
      }
    };
  } catch (error) {
    console.error('Detect unusual payments error:', error);
    throw new Error(`Failed to detect unusual payments: ${error.message}`);
  }
}

/**
 * Comprehensive AI predictions dashboard
 */
export async function getAIPredictionsDashboard(schoolId, term, year) {
  try {
    // Run all predictions in parallel
    const [
      cashFlowForecast,
      classTrends,
      unusualPayments
    ] = await Promise.all([
      forecastCashFlow(schoolId, 3),
      analyzeClassTrends(schoolId, term, year),
      detectUnusualPayments(schoolId, 7)
    ]);

    // Get high-risk students (low payment probability)
    const riskQuery = `
      SELECT 
        s.id, s.admission_no,
        p.first_name, p.last_name,
        c.name as class_name,
        sa.total_fees, sa.amount_paid, sa.balance,
        CASE 
          WHEN sa.total_fees > 0 
          THEN (sa.amount_paid / sa.total_fees * 100)
          ELSE 0 
        END as payment_rate
      FROM student s
      JOIN person p ON s.person_id = p.id
      LEFT JOIN class c ON s.class_id = c.id
      JOIN student_account sa ON s.id = sa.student_id 
        AND sa.term = ? AND sa.year = ?
      WHERE s.school_id = ? 
        AND s.status = 'active'
        AND sa.balance > 0
      HAVING payment_rate < 30
      ORDER BY balance DESC
      LIMIT 20
    `;
    const highRiskStudents = await db.query(riskQuery, [term, year, schoolId]);

    return {
      success: true,
      data: {
        cashFlowForecast: cashFlowForecast.data,
        classTrends: classTrends.data,
        unusualPayments: unusualPayments.data,
        highRiskStudents: highRiskStudents || [],
        generatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Get AI predictions dashboard error:', error);
    throw new Error(`Failed to generate AI predictions: ${error.message}`);
  }
}
