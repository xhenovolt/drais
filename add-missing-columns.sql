-- Add missing columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(100),
ADD COLUMN IF NOT EXISTS language VARCHAR(10),
ADD COLUMN IF NOT EXISTS school_id INT REFERENCES schools(id);

-- Add missing columns to onboarding_steps
ALTER TABLE onboarding_steps 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

\echo '✅ Missing columns added successfully!';
