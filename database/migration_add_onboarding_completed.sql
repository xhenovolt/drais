-- =====================================================================
-- Migration: Add onboarding_completed flag to users table
-- Version: 0.0.0051
-- 
-- Adds single source of truth for onboarding completion
-- Previously relied on frontend step counting which was fragile
-- =====================================================================

-- Add onboarding_completed boolean column to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP;

-- Create index for efficient onboarding queries
CREATE INDEX IF NOT EXISTS idx_users_onboarding_completed 
  ON users(onboarding_completed, school_id);

-- Verify migration
SELECT 'Migration complete: users table now has onboarding_completed column' as status;

\d users
