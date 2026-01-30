/**
 * Onboarding Middleware
 * DRAIS v0.0.0043
 * 
 * Ensures users complete onboarding and have active payment/trial before accessing dashboard
 */

import { isOnboardingCompleted } from './onboarding.service.js';
import { hasActiveSubscription } from './payment.service.js';
import { hasActiveAccess } from './trial.service.js';

/**
 * Check if user can access dashboard
 * Returns { allowed: boolean, reason: string, redirectTo: string }
 */
export async function canAccessDashboard(userId) {
  try {
    // Check onboarding completion
    const onboardingComplete = await isOnboardingCompleted(userId);
    
    if (!onboardingComplete) {
      return {
        allowed: false,
        reason: 'onboarding_incomplete',
        message: 'Please complete onboarding first',
        redirectTo: '/onboarding/step1',
      };
    }

    // Check active subscription or trial
    const access = await hasActiveAccess(userId);
    
    if (!access.hasAccess) {
      return {
        allowed: false,
        reason: 'no_active_plan',
        message: 'Please select a payment plan or activate your free trial',
        redirectTo: '/payment/select',
      };
    }

    return {
      allowed: true,
      reason: 'access_granted',
      message: 'Access granted',
      accessType: access.type, // 'trial' or 'subscription'
      daysRemaining: access.daysRemaining,
      redirectTo: null,
    };

  } catch (error) {
    console.error('Dashboard access check error:', error);
    return {
      allowed: false,
      reason: 'error',
      message: 'Error checking access',
      redirectTo: '/onboarding/step1',
    };
  }
}

/**
 * Check if user should skip onboarding (already completed before)
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} True if should skip onboarding
 */
export async function shouldSkipOnboarding(userId) {
  try {
    const onboardingComplete = await isOnboardingCompleted(userId);
    return onboardingComplete;
  } catch (error) {
    console.error('Error checking onboarding skip:', error);
    return false;
  }
}

/**
 * Middleware wrapper for dashboard routes
 */
export async function requireOnboardingComplete(user) {
  const userId = user.id;
  const access = await canAccessDashboard(userId);
  
  if (!access.allowed) {
    return {
      valid: false,
      reason: access.reason,
      redirectTo: access.redirectTo,
    };
  }

  return {
    valid: true,
    user,
  };
}
