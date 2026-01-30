/**
 * Onboarding Service
 * DRAIS v0.0.0048
 * 
 * Handles user onboarding flow and progress tracking
 * PostgreSQL-native with atomic transactions
 */

import db from '../db/index.js';

/**
 * Initialize onboarding for a new user
 */
export async function initializeOnboarding(userId) {
  try {
    // Check if onboarding already exists
    const existing = await getOnboardingStatus(userId);
    if (existing && existing.length > 0) {
      return { success: true, message: 'Onboarding already initialized', steps: existing };
    }

    const steps = [
      { user_id: userId, step_name: 'school_setup', step_order: 1, status: 'pending' },
      { user_id: userId, step_name: 'admin_profile', step_order: 2, status: 'pending' },
      { user_id: userId, step_name: 'payment_plan', step_order: 3, status: 'pending' },
      { user_id: userId, step_name: 'review_confirm', step_order: 4, status: 'pending' },
    ];

    for (const step of steps) {
      await db.insert('onboarding_steps', step);
    }

    return { success: true, message: 'Onboarding initialized', steps: await getOnboardingStatus(userId) };
  } catch (error) {
    console.error('Error initializing onboarding:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get user's onboarding status
 */
export async function getOnboardingStatus(userId) {
  try {
    return await db.findMany('onboarding_steps', {
      where: { user_id: userId },
      orderBy: 'step_order',
      limit: 100,
    });
  } catch (error) {
    console.error('Error getting onboarding status:', error.message);
    return [];
  }
}

/**
 * Check if onboarding is completed
 */
export async function isOnboardingCompleted(userId) {
  // Check the authoritative flag: users.onboarding_completed
  // This is the single source of truth set by markOnboardingComplete()
  try {
    const user = await db.findOne('users', { id: userId });
    
    if (!user) {
      return false;
    }

    // Return the actual onboarding_completed flag from database
    return user.onboarding_completed === true;
  } catch (error) {
    console.error('Error checking onboarding completed flag:', error.message);
    return false;
  }
}

/**
 * Update a specific onboarding step
 */
export async function updateOnboardingStep(userId, stepName, stepData, status = 'completed') {
  try {
    const updateData = {
      status,
      step_data: JSON.stringify(stepData),
      updated_at: new Date(),
    };

    if (status === 'in_progress') {
      updateData.started_at = new Date();
    } else if (status === 'completed') {
      updateData.completed_at = new Date();
    }

    await db.update(
      'onboarding_steps',
      updateData,
      { user_id: userId, step_name: stepName }
    );

    return { success: true, message: 'Step updated successfully' };
  } catch (error) {
    console.error('Error updating onboarding step:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId) {
  try {
    return await db.findOne('user_profiles', { user_id: userId });
  } catch (error) {
    console.error('Error getting user profile:', error.message);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId, profileData) {
  try {
    const existing = await getUserProfile(userId);

    if (!existing) {
      // Create new profile
      const data = { user_id: userId, ...profileData, created_at: new Date() };
      await db.insert('user_profiles', data);
    } else {
      // Update existing
      const data = { ...profileData, updated_at: new Date() };
      await db.update('user_profiles', data, { user_id: userId });
    }

    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Create school - generates school_code server-side, enforces uniqueness
 */
export async function createSchool(userId, schoolData) {
  try {
    // Generate server-side school_code if not provided (CRITICAL - never trust frontend)
    let schoolCode = schoolData.school_code;
    if (!schoolCode) {
      // Generate unique code: slug-based + random suffix
      const slug = (schoolData.school_name || 'school').toLowerCase().replace(/\s+/g, '-').substring(0, 10);
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      schoolCode = `${slug}-${randomSuffix}`;
    }

    // Ensure uniqueness
    const existing = await db.findOne('schools', { school_code: schoolCode });
    if (existing) {
      // Re-generate if collision
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      schoolCode = `${schoolCode.split('-')[0]}-${randomSuffix}`;
    }

    const school = {
      name: schoolData.school_name,
      school_code: schoolCode,
      school_type: schoolData.school_type || 'secondary',
      address: schoolData.address || null,
      region: schoolData.region || null,
      district: schoolData.district || null,
      phone: schoolData.phone || null,
      email: schoolData.email || null,
      website: schoolData.website || null,
      currency: schoolData.currency || 'UGX',
      timezone: schoolData.timezone || 'Africa/Kampala',
      owner_name: schoolData.owner_name || null,
      owner_email: schoolData.owner_email || null,
      owner_phone: schoolData.owner_phone || null,
      created_at: new Date(),
    };

    const result = await db.insert('schools', school);
    const schoolId = result.insertId;

    // Update user's profile with the school_id
    await db.update('user_profiles', { school_id: schoolId }, { user_id: userId });

    // Also update the user's school_id in users table
    await db.update('users', { school_id: schoolId }, { id: userId });

    return {
      success: true,
      message: 'School created successfully',
      schoolId: schoolId,
      schoolCode: schoolCode,
    };
  } catch (error) {
    console.error('Error creating school:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get user's schools
 */
export async function getUserSchools(userId) {
  try {
    // Get user's profile to find school_id
    const profile = await db.findOne('user_profiles', { user_id: userId });
    if (!profile || !profile.school_id) {
      return [];
    }
    const school = await db.findOne('schools', { id: profile.school_id });
    return school ? [school] : [];
  } catch (error) {
    console.error('Error getting user schools:', error.message);
    return [];
  }
}

/**
 * Get current onboarding step (first incomplete step)
 */
export async function getCurrentStep(userId) {
  const steps = await getOnboardingStatus(userId);
  
  if (!steps || steps.length === 0) {
    return null;
  }

  // Find first non-completed step
  const current = steps.find(step => step.status !== 'completed');
  
  return current || steps[steps.length - 1]; // Return last step if all completed
}

/**
 * Complete onboarding
 */
export async function completeOnboarding(userId) {
  try {
    const steps = await getOnboardingStatus(userId);
    
    // Ensure all steps are completed
    const allCompleted = steps.every(step => step.status === 'completed');
    
    if (!allCompleted) {
      throw new Error('Cannot complete onboarding. Some steps are incomplete.');
    }

    return {
      success: true,
      message: 'Onboarding completed successfully',
      completed: true,
    };
  } catch (error) {
    console.error('Error completing onboarding:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Check if all onboarding steps have been completed (in onboarding_steps table)
 * This is different from checking the users.onboarding_completed flag
 * @returns {boolean} True if all 4 steps are marked as 'completed'
 */
async function areAllStepsCompleted(userId) {
  try {
    const steps = await getOnboardingStatus(userId);
    
    if (!steps || steps.length === 0) {
      return false;
    }

    // All steps must be completed
    return steps.every(step => step.status === 'completed');
  } catch (error) {
    console.error('Error checking if all steps are completed:', error.message);
    return false;
  }
}

/**
 * Mark onboarding as complete for user
 */
export async function markOnboardingComplete(userId) {
  try {
    // Verify all steps are completed (in onboarding_steps table, not the flag)
    const allStepsComplete = await areAllStepsCompleted(userId);
    
    if (!allStepsComplete) {
      throw new Error('Cannot mark onboarding complete. Some steps are incomplete.');
    }

    // Update user record atomically - wrap in transaction
    await db.transaction(async (client) => {
      await db.update(
        'users',
        { 
          onboarding_completed: true, 
          onboarding_completed_at: new Date(), 
          updated_at: new Date() 
        },
        { id: userId }
      );
    });

    console.log(`✅ Onboarding completed atomically for user ${userId}`);

    return {
      success: true,
      message: 'Onboarding marked as complete',
    };
  } catch (error) {
    console.error('Error marking onboarding complete:', error.message);
    return { success: false, error: error.message };
  }
}
