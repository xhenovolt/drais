-- Create missing critical tables for DRAIS
-- Payment System
CREATE TABLE IF NOT EXISTS payment_plans (
  id SERIAL PRIMARY KEY,
  plan_name VARCHAR(255) NOT NULL,
  plan_code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  price_termly DECIMAL(12, 2),
  price_annual DECIMAL(12, 2),
  trial_period_days INT DEFAULT 0,
  is_trial BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_payment_plans (
  id SERIAL PRIMARY KEY,
  user_id INT,
  payment_plan_id INT REFERENCES payment_plans(id),
  billing_cycle VARCHAR(50) DEFAULT 'monthly',
  status VARCHAR(50) DEFAULT 'active',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_trials (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  payment_plan_id INT REFERENCES payment_plans(id),
  trial_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  trial_end_date TIMESTAMP,
  trial_days_used INT DEFAULT 0,
  trial_days_remaining INT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Authentication & User Management
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  phone_number VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10),
  profile_image_url VARCHAR(500),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  bio TEXT,
  company_name VARCHAR(255),
  job_title VARCHAR(100),
  verification_status VARCHAR(50) DEFAULT 'unverified',
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  session_token VARCHAR(500) UNIQUE,
  device_info VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_people (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  person_id INT,
  relationship_type VARCHAR(50),
  designation VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (person_id) REFERENCES people(id)
);

-- Onboarding System
CREATE TABLE IF NOT EXISTS onboarding_steps (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  step_name VARCHAR(255) NOT NULL,
  step_order INT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  step_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indices for performance
CREATE INDEX idx_user_payment_plans_user_id ON user_payment_plans(user_id);
CREATE INDEX idx_user_trials_user_id ON user_trials(user_id);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_people_user_id ON user_people(user_id);
CREATE INDEX idx_onboarding_steps_user_id ON onboarding_steps(user_id);
CREATE INDEX idx_payment_plans_is_active ON payment_plans(is_active);

-- Insert payment plans
INSERT INTO payment_plans (plan_name, plan_code, trial_period_days, is_trial, is_active, sort_order)
VALUES 
  ('Free Trial', 'trial', 40, true, true, 1),
  ('Starter', 'starter', 40, false, true, 2),
  ('Professional', 'professional', 40, false, true, 3),
  ('Enterprise', 'enterprise', 0, false, true, 4)
ON CONFLICT (plan_code) DO NOTHING;
