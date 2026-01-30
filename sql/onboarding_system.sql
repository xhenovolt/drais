-- =====================================================
-- DRAIS v0.0.0042 - Onboarding & Payment System
-- =====================================================

-- 1. User Profiles Table (1:1 with users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  school_id BIGINT NULL,
  full_name VARCHAR(255) NULL,
  phone VARCHAR(30) NULL,
  address TEXT NULL,
  city VARCHAR(100) NULL,
  country VARCHAR(100) DEFAULT 'Uganda',
  timezone VARCHAR(50) DEFAULT 'Africa/Kampala',
  language VARCHAR(10) DEFAULT 'en',
  avatar_url VARCHAR(500) NULL,
  bio TEXT NULL,
  preferences JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_school_id (school_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Onboarding Steps Table
CREATE TABLE IF NOT EXISTS onboarding_steps (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  step_name VARCHAR(50) NOT NULL,
  step_order INT NOT NULL DEFAULT 0,
  status ENUM('pending', 'in_progress', 'completed', 'skipped') DEFAULT 'pending',
  step_data JSON NULL,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_step (user_id, step_name),
  INDEX idx_user_status (user_id, status),
  INDEX idx_step_order (user_id, step_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. Payment Plans Table
CREATE TABLE IF NOT EXISTS payment_plans (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  plan_name VARCHAR(100) NOT NULL UNIQUE,
  plan_code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT NULL,
  price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  price_yearly DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) DEFAULT 'UGX',
  trial_period_days INT DEFAULT 0,
  max_students INT NULL,
  max_staff INT NULL,
  max_schools INT DEFAULT 1,
  features JSON NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_trial BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (is_active),
  INDEX idx_trial (is_trial)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. User Payment Plans Table (subscription tracking)
CREATE TABLE IF NOT EXISTS user_payment_plans (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  plan_id BIGINT NOT NULL,
  billing_cycle ENUM('monthly', 'yearly', 'trial') DEFAULT 'monthly',
  status ENUM('active', 'trial', 'expired', 'cancelled', 'suspended') DEFAULT 'trial',
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP NULL,
  trial_end_date TIMESTAMP NULL,
  auto_renew BOOLEAN DEFAULT TRUE,
  payment_method VARCHAR(50) NULL,
  last_payment_date TIMESTAMP NULL,
  next_payment_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES payment_plans(id) ON DELETE RESTRICT,
  INDEX idx_user_status (user_id, status),
  INDEX idx_dates (start_date, end_date),
  INDEX idx_trial_end (trial_end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. Schools Table (for multi-school setup)
CREATE TABLE IF NOT EXISTS schools (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  owner_user_id BIGINT NOT NULL,
  school_name VARCHAR(255) NOT NULL,
  school_code VARCHAR(50) NULL UNIQUE,
  school_type ENUM('primary', 'secondary', 'high_school', 'university', 'technical', 'other') DEFAULT 'secondary',
  address TEXT NULL,
  city VARCHAR(100) NULL,
  country VARCHAR(100) DEFAULT 'Uganda',
  phone VARCHAR(30) NULL,
  email VARCHAR(150) NULL,
  website VARCHAR(255) NULL,
  logo_url VARCHAR(500) NULL,
  settings JSON NULL,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_owner (owner_user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert Default Payment Plans
INSERT INTO payment_plans (plan_name, plan_code, description, price_monthly, price_yearly, currency, trial_period_days, max_students, max_staff, features, is_active, is_trial, sort_order) VALUES
('Free Trial', 'trial', '14-day free trial with full features', 0.00, 0.00, 'UGX', 14, 50, 10, JSON_ARRAY('Student Management', 'Basic Reports', 'SMS Notifications', 'Email Support'), TRUE, TRUE, 1),
('Starter', 'starter', 'Perfect for small schools', 150000.00, 1500000.00, 'UGX', 0, 200, 20, JSON_ARRAY('Student Management', 'Fee Management', 'Basic Reports', 'SMS & Email', 'Priority Support'), TRUE, FALSE, 2),
('Professional', 'professional', 'Best for growing institutions', 350000.00, 3500000.00, 'UGX', 0, 500, 50, JSON_ARRAY('All Starter Features', 'Exam Management', 'Advanced Reports', 'Attendance Tracking', 'Library Management', 'WhatsApp Integration'), TRUE, FALSE, 3),
('Enterprise', 'enterprise', 'Unlimited power for large schools', 750000.00, 7500000.00, 'UGX', 0, NULL, NULL, JSON_ARRAY('All Professional Features', 'Unlimited Students', 'Unlimited Staff', 'AI Analytics', 'Custom Branding', 'Dedicated Support', 'Multi-School Management'), TRUE, FALSE, 4);

-- Initialize default onboarding steps for new users (will be created via trigger or API)
-- Step 1: School Information
-- Step 2: Admin Profile
-- Step 3: Payment Plan Selection
-- Step 4: Review & Confirmation

-- Optional: Trigger to create user profile on user registration
DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  -- Create user profile
  INSERT INTO user_profiles (user_id, school_id)
  VALUES (NEW.id, NEW.school_id);
  
  -- Initialize onboarding steps
  INSERT INTO onboarding_steps (user_id, step_name, step_order, status) VALUES
  (NEW.id, 'school_setup', 1, 'pending'),
  (NEW.id, 'admin_profile', 2, 'pending'),
  (NEW.id, 'payment_plan', 3, 'pending'),
  (NEW.id, 'review_confirm', 4, 'pending');
END//
DELIMITER ;

-- Indexes for performance
CREATE INDEX idx_user_profiles_user ON user_profiles(user_id);
CREATE INDEX idx_onboarding_user_status ON onboarding_steps(user_id, status);
CREATE INDEX idx_user_plans_active ON user_payment_plans(user_id, status);

-- Comments for documentation
ALTER TABLE user_profiles COMMENT = 'Extended user profile information (1:1 with users)';
ALTER TABLE onboarding_steps COMMENT = 'Tracks user onboarding progress step by step';
ALTER TABLE payment_plans COMMENT = 'Available subscription plans and pricing';
ALTER TABLE user_payment_plans COMMENT = 'User subscription tracking and billing';
ALTER TABLE schools COMMENT = 'Multi-school setup - each user can manage multiple schools';
