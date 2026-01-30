/**
 * Payment Service
 * DRAIS v0.0.0048
 * 
 * Handles payment plans, subscriptions, and trial management
 * Standardized to use db.findMany(), db.findOne(), db.query()
 */

import db from '../db/index.js';

/**
 * Get all available payment plans
 */
export async function getPaymentPlans() {
  try {
    return await db.findMany('payment_plans', {
      where: { is_active: true },
      orderBy: 'sort_order',
      limit: 1000,
    });
  } catch (error) {
    console.error('Error getting payment plans:', error.message);
    return [];
  }
}

/**
 * Get a specific payment plan by ID
 */
export async function getPaymentPlanById(planId) {
  try {
    return await db.findOne('payment_plans', { id: planId });
  } catch (error) {
    console.error('Error getting payment plan by ID:', error.message);
    return null;
  }
}

/**
 * Get payment plan by code
 */
export async function getPaymentPlanByCode(planCode) {
  try {
    return await db.findOne('payment_plans', { plan_code: planCode });
  } catch (error) {
    console.error('Error getting payment plan by code:', error.message);
    return null;
  }
}

/**
 * Get user's active payment plan
 */
export async function getUserPaymentPlan(userId) {
  try {
    const userPlan = await db.findOne('user_payment_plans', {
      user_id: userId,
    });
    
    if (!userPlan) return null;
    
    const plan = await db.findOne('payment_plans', { id: userPlan.plan_id });
    // Merge with userPlan properties taking precedence (status and end_date from userPlan)
    return { ...plan, ...userPlan };
  } catch (error) {
    console.error('Error getting user payment plan:', error.message);
    return null;
  }
}

/**
 * Check if user has active subscription or trial
 */
export async function hasActiveSubscription(userId) {
  const plan = await getUserPaymentPlan(userId);
  
  if (!plan) {
    return false;
  }

  // Check if trial/subscription is still valid
  if (plan.status === 'trial' && plan.end_date) {
    return new Date(plan.end_date) > new Date();
  }

  if (plan.status === 'active' && plan.end_date) {
    return new Date(plan.end_date) > new Date();
  }

  return plan.status === 'active' || plan.status === 'trial';
}

/**
 * Select/activate a payment plan for user
 */
export async function selectPaymentPlan(userId, planId, billingCycle = 'trial') {
  const dbType = db.getType();

  // Get plan details
  const plan = await getPaymentPlanById(planId);
  if (!plan) {
    throw new Error('Invalid payment plan');
  }

  // Check if user already has an active plan
  const existing = await getUserPaymentPlan(userId);
  if (existing && existing.status !== 'expired' && existing.status !== 'cancelled') {
    throw new Error('User already has an active payment plan');
  }

  const now = new Date();
  let endDate = null;
  let trialEndDate = null;
  let status = billingCycle;

  if (billingCycle === 'trial') {
    // Calculate trial end date
    trialEndDate = new Date(now.getTime() + plan.trial_period_days * 24 * 60 * 60 * 1000);
    endDate = trialEndDate;
    status = 'trial';
  } else if (billingCycle === 'monthly') {
    // 30 days
    endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    status = 'active';
  } else if (billingCycle === 'yearly') {
    // 365 days
    endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    status = 'active';
  }

  const userPlanData = {
    user_id: userId,
    plan_id: planId,
    billing_cycle: billingCycle,
    status: status,
    start_date: now,
    end_date: endDate,
    auto_renew: true,
    created_at: now,
  };

  const result = await db.insert('user_payment_plans', userPlanData);

  return {
    success: true,
    message: `Payment plan activated successfully (${status})`,
    subscriptionId: result.insertId || result.insertedId,
    plan: plan,
    endDate: endDate,
  };
}

/**
 * Upgrade/Downgrade payment plan
 */
export async function changePlan(userId, newPlanId, billingCycle = 'monthly') {
  const dbType = db.getType();

  // Cancel current plan
  const current = await getUserPaymentPlan(userId);
  if (current) {
    if (dbType === 'mysql') {
      await db.update(
        'user_payment_plans',
        { status: 'cancelled', updated_at: new Date() },
        'id = ?',
        [current.id]
      );
    } else {
      await db.update(
        'user_payment_plans',
        { status: 'cancelled', updated_at: new Date() },
        { id: current.id }
      );
    }
  }

  // Activate new plan
  return await selectPaymentPlan(userId, newPlanId, billingCycle);
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(userId) {
  const dbType = db.getType();

  const current = await getUserPaymentPlan(userId);
  if (!current) {
    throw new Error('No active subscription found');
  }

  if (dbType === 'mysql') {
    await db.update(
      'user_payment_plans',
      { status: 'cancelled', auto_renew: false, updated_at: new Date() },
      'id = ?',
      [current.id]
    );
  } else {
    await db.update(
      'user_payment_plans',
      { status: 'cancelled', auto_renew: false, updated_at: new Date() },
      { id: current.id }
    );
  }

  return {
    success: true,
    message: 'Subscription cancelled successfully',
  };
}

/**
 * Extend trial period
 */
export async function extendTrial(userId, additionalDays) {
  const dbType = db.getType();

  const current = await getUserPaymentPlan(userId);
  if (!current || current.status !== 'trial') {
    throw new Error('No active trial found');
  }

  const newTrialEnd = new Date(
    new Date(current.end_date).getTime() + additionalDays * 24 * 60 * 60 * 1000
  );

  if (dbType === 'mysql') {
    await db.update(
      'user_payment_plans',
      { end_date: newTrialEnd, updated_at: new Date() },
      'id = ?',
      [current.id]
    );
  } else {
    await db.update(
      'user_payment_plans',
      { end_date: newTrialEnd, updated_at: new Date() },
      { id: current.id }
    );
  }

  return {
    success: true,
    message: `Trial extended by ${additionalDays} days`,
    newTrialEndDate: newTrialEnd,
  };
}

/**
 * Get trial plan (for new users)
 */
export async function getTrialPlan() {
  const dbType = db.getType();

  if (dbType === 'mysql') {
    const rows = await db.query(
      'SELECT * FROM payment_plans WHERE is_trial = ? AND is_active = ? LIMIT 1',
      [true, true]
    );
    return rows[0] || null;
  } else {
    return await db.findOne('payment_plans', { is_trial: true, is_active: true });
  }
}

/**
 * Confirm payment for paid plans (mock payment gateway)
 * DRAIS v0.0.0044
 */
export async function confirmPayment(userId, subscriptionId, paymentDetails) {
  const dbType = db.getType();

  // Verify subscription belongs to user
  let subscription;
  if (dbType === 'mysql') {
    const rows = await db.query(
      'SELECT * FROM user_payment_plans WHERE id = ? AND user_id = ? LIMIT 1',
      [subscriptionId, userId]
    );
    subscription = rows[0];
  } else {
    subscription = await db.findOne('user_payment_plans', { 
      id: subscriptionId, 
      user_id: userId 
    });
  }

  if (!subscription) {
    throw new Error('Subscription not found');
  }

  // Update subscription status to active after payment confirmation
  const updateData = {
    status: 'active',
    payment_method: paymentDetails.paymentMethod,
    transaction_id: paymentDetails.transactionId,
    paid_at: paymentDetails.paidAt,
    updated_at: new Date(),
  };

  if (dbType === 'mysql') {
    await db.update(
      'user_payment_plans',
      updateData,
      'id = ?',
      [subscriptionId]
    );
  } else {
    await db.update(
      'user_payment_plans',
      updateData,
      { id: subscriptionId }
    );
  }

  return {
    subscriptionId,
    status: 'active',
    message: 'Payment confirmed and subscription activated',
  };
}
