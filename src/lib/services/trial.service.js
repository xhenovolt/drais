/**
 * Trial Service - DRAIS v0.0.0048
 * Manages 30-day free trial periods with daily countdown
 * PostgreSQL-native, MySQL-free implementation
 * 
 * Uses db.insert(), db.findOne(), db.findMany(), db.update()
 * instead of raw db.query() calls
 */

import db from '../db/index.js';

/**
 * Activate a 30-day free trial for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Trial activation result
 */
async function activateTrial(userId) {
  try {
    // Check if user already has an active trial
    const existingTrial = await getActiveTrial(userId);
    if (existingTrial) {
      return {
        success: false,
        error: 'User already has an active trial',
        trial: existingTrial,
      };
    }

    // Get the trial plan details first
    const trialPlan = await db.findOne('payment_plans', {
      plan_code: 'trial',
      is_active: true,
    });

    if (!trialPlan) {
      throw new Error('Trial plan not found');
    }

    // Calculate trial period using the plan's trial_period_days (default to 30 if not set)
    const startDate = new Date();
    const endDate = new Date();
    const trialDays = trialPlan.trial_period_days || 30;
    endDate.setDate(endDate.getDate() + trialDays);

    // Create trial record using db.insert()
    const trialResult = await db.insert('user_trials', {
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
    });

    if (!trialResult.success) {
      throw new Error('Failed to create trial record');
    }

    const trialId = trialResult.insertId;
    const trialPlanId = trialPlan.id;

    // Create corresponding payment plan record
    const paymentResult = await db.insert('user_payment_plans', {
      user_id: userId,
      plan_id: trialPlanId,
      billing_cycle: 'monthly',
      status: 'trial',
      start_date: startDate,
      end_date: endDate,
    });

    if (!paymentResult.success) {
      throw new Error('Failed to create payment plan record');
    }

    return {
      success: true,
      trial: {
        id: trialId,
        userId,
        startDate,
        endDate,
        daysRemaining: trialDays,
        status: 'trial',
      },
    };
  } catch (error) {
    console.error('Error activating trial:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get active trial for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} Active trial or null
 */
async function getActiveTrial(userId) {
  try {
    // Use raw query with PostgreSQL DATE_PART for days calculation
    // Note: trial_end_date is the actual column name
    const results = await db.query(`
      SELECT 
        ut.*,
        ut.trial_end_date as end_date,
        GREATEST(0, DATE_PART('day', (ut.trial_end_date - NOW())::interval))::INTEGER AS days_remaining
      FROM user_trials ut
      WHERE ut.user_id = $1
        AND ut.status = 'active'
        AND ut.trial_end_date >= NOW()
      ORDER BY ut.created_at DESC
      LIMIT 1
    `, [userId]);

    if (!results || results.length === 0) {
      return null;
    }

    return results[0];
  } catch (error) {
    console.error('Error getting active trial:', error.message);
    return null;
  }
}

/**
 * Get trial status for a user (includes expired trials)
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Trial status
 */
async function getTrialStatus(userId) {
  try {
    const results = await db.query(`
      SELECT 
        ut.id,
        ut.user_id,
        ut.trial_start_date as start_date,
        ut.trial_end_date as end_date,
        ut.status,
        GREATEST(0, DATE_PART('day', (ut.trial_end_date - NOW())::interval))::INTEGER AS days_remaining,
        CASE 
          WHEN ut.status = 'active' AND ut.trial_end_date >= NOW() THEN 1
          ELSE 0
        END AS is_active
      FROM user_trials ut
      WHERE ut.user_id = $1
      ORDER BY ut.created_at DESC
      LIMIT 1
    `, [userId]);

    if (!results || results.length === 0) {
      return {
        hasTrial: false,
        isActive: false,
        daysRemaining: 0,
      };
    }

    const trial = results[0];
    return {
      hasTrial: true,
      isActive: trial.is_active === 1,
      status: trial.status,
      startDate: trial.start_date,
      endDate: trial.end_date,
      daysRemaining: parseInt(trial.days_remaining, 10),
    };
  } catch (error) {
    console.error('Error getting trial status:', error.message);
    return {
      hasTrial: false,
      isActive: false,
      error: error.message,
    };
  }
}

/**
 * Check if user has an active trial or paid subscription
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Access status
 */
async function hasActiveAccess(userId) {
  try {
    // Check for active trial
    const trial = await getActiveTrial(userId);
    if (trial && trial.days_remaining > 0) {
      return {
        hasAccess: true,
        type: 'trial',
        daysRemaining: trial.days_remaining,
        endDate: trial.end_date,
      };
    }

    // Check for active paid subscription using db.query with PostgreSQL syntax
    try {
      const results = await db.query(`
        SELECT 
          upp.*,
          pp.plan_name,
          pp.plan_code
        FROM user_payment_plans upp
        JOIN payment_plans pp ON upp.payment_plan_id = pp.id
        WHERE upp.user_id = $1
          AND upp.status = 'active'
          AND pp.plan_code != 'trial'
          AND (upp.end_date IS NULL OR upp.end_date >= NOW())
        ORDER BY upp.created_at DESC
        LIMIT 1
      `, [userId]);

      if (results && results.length > 0) {
        const subscription = results[0];
        return {
          hasAccess: true,
          type: 'subscription',
          plan: subscription.plan_name,
          planCode: subscription.plan_code,
          endDate: subscription.end_date,
        };
      }
    } catch (queryError) {
      // If tables missing, log warning but allow access (fail graceful for onboarding)
      console.warn(`⚠️ Could not query payment plans for user ${userId}: ${queryError.message}`);
      return {
        hasAccess: true,
        type: 'default',
        message: 'Payment tables unavailable, allowing access for onboarding',
      };
    }

    return {
      hasAccess: false,
      type: null,
      message: 'No active trial or subscription',
    };
  } catch (error) {
    // Fail gracefully - don't block user flow if trial tables are missing
    console.warn(`⚠️ Error checking access for user ${userId}: ${error.message}`);
    return {
      hasAccess: true,
      type: 'default',
      message: 'Defaulting to access allowed due to system error',
    };
  }
}

/**
 * Expire trial for a user (manual expiration)
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Expiration result
 */
async function expireTrial(userId) {
  try {
    // Update trial status to expired
    await db.update('user_trials', 
      { status: 'expired' },
      { user_id: userId, status: 'active' }
    );

    // Also update payment plan status
    await db.query(`
      UPDATE user_payment_plans upp
      SET status = 'expired'
      WHERE upp.user_id = $1
        AND upp.status = 'active'
        AND upp.payment_plan_id IN (
          SELECT id FROM payment_plans WHERE plan_code = 'trial'
        )
    `, [userId]);

    return {
      success: true,
      message: 'Trial expired successfully',
    };
  } catch (error) {
    console.error('Error expiring trial:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Convert trial to paid plan
 * @param {number} userId - User ID
 * @param {number} planId - New plan ID
 * @returns {Promise<Object>} Conversion result
 */
async function convertTrialToPaid(userId, planId) {
  try {
    // Mark trial as converted
    await db.update('user_trials',
      { status: 'converted' },
      { user_id: userId, status: 'active' }
    );

    // Update payment plan to cancelled
    await db.query(`
      UPDATE user_payment_plans upp
      SET status = 'cancelled'
      WHERE upp.user_id = $1
        AND upp.status = 'active'
        AND upp.payment_plan_id IN (
          SELECT id FROM payment_plans WHERE plan_code = 'trial'
        )
    `, [userId]);

    return {
      success: true,
      message: 'Trial converted to paid plan',
    };
  } catch (error) {
    console.error('Error converting trial:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Update expired trials (called by scheduled job)
 * @returns {Promise<Object>} Update result
 */
async function updateExpiredTrials() {
  try {
    // Update user_trials
    await db.query(`
      UPDATE user_trials
      SET status = 'expired'
      WHERE status = 'active'
        AND trial_end_date < NOW()
    `);

    // Update corresponding payment plans
    await db.query(`
      UPDATE user_payment_plans upp
      SET status = 'expired'
      WHERE upp.status = 'active'
        AND upp.payment_plan_id IN (
          SELECT id FROM payment_plans WHERE plan_code = 'trial'
        )
        AND upp.user_id IN (
          SELECT DISTINCT user_id FROM user_trials WHERE status = 'expired'
        )
    `);

    return {
      success: true,
      message: 'Expired trials updated',
    };
  } catch (error) {
    console.error('Error updating expired trials:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Extend trial period
 * @param {number} userId - User ID
 * @param {number} additionalDays - Days to add
 * @returns {Promise<Object>} Extension result
 */
async function extendTrial(userId, additionalDays = 7) {
  try {
    // Update end_date using PostgreSQL INTERVAL syntax
    await db.query(`
      UPDATE user_trials
      SET trial_end_date = trial_end_date + INTERVAL '1 day' * $1
      WHERE user_id = $2
        AND status = 'active'
    `, [additionalDays, userId]);

    // Also update payment plan trial end date
    await db.query(`
      UPDATE user_payment_plans upp
      SET trial_end_date = trial_end_date + INTERVAL '1 day' * $1
      WHERE upp.user_id = $2
        AND upp.status = 'active'
        AND upp.payment_plan_id IN (
          SELECT id FROM payment_plans WHERE plan_code = 'trial'
        )
    `, [additionalDays, userId]);

    const newStatus = await getTrialStatus(userId);

    return {
      success: true,
      message: `Trial extended by ${additionalDays} days`,
      newDaysRemaining: newStatus.daysRemaining,
      newEndDate: newStatus.endDate,
    };
  } catch (error) {
    console.error('Error extending trial:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

export {
  activateTrial,
  getActiveTrial,
  getTrialStatus,
  hasActiveAccess,
  expireTrial,
  convertTrialToPaid,
  updateExpiredTrials,
  extendTrial,
};
