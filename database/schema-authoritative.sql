-- =====================================================================
-- DRAIS PostgreSQL Complete Schema (Authoritative)
-- Converted from MySQL schema - Online Database Source of Truth
-- Version: 0.0.0050
-- 
-- This is the complete authoritative schema for ALL tables
-- Applied to: Neon PostgreSQL database
-- =====================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";



-- =====================================================================
-- CORE SYSTEM TABLES
-- =====================================================================

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  permission_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  module VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INT NOT NULL REFERENCES roles(id),
  permission_id INT NOT NULL REFERENCES permissions(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(255) NOT NULL UNIQUE,
  setting_value TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS schools (
  id SERIAL PRIMARY KEY,
  school_name VARCHAR(255) NOT NULL,
  school_code VARCHAR(100) UNIQUE,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(100),
  website VARCHAR(255),
  principal_name VARCHAR(255),
  registration_number VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  role_id INT REFERENCES roles(id),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- USER AUTHENTICATION & PROFILE TABLES
-- =====================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES users(id),
  phone_number VARCHAR(20),
  phone VARCHAR(20),
  full_name VARCHAR(255),
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
  timezone VARCHAR(100),
  language VARCHAR(10),
  school_id INT REFERENCES schools(id),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  session_token VARCHAR(500) UNIQUE,
  device_info VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- PEOPLE & STAFF MANAGEMENT TABLES
-- =====================================================================

CREATE TABLE IF NOT EXISTS people (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(10),
  national_id VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  profile_image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS persons (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_people (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  person_id INT REFERENCES people(id),
  relationship_type VARCHAR(50),
  designation VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  person_id INT REFERENCES people(id),
  staff_code VARCHAR(100) UNIQUE,
  designation VARCHAR(100),
  department VARCHAR(100),
  employment_type VARCHAR(50),
  employment_date DATE,
  salary DECIMAL(12, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff_attendance (
  id SERIAL PRIMARY KEY,
  staff_id INT REFERENCES staff(id),
  attendance_date DATE NOT NULL,
  check_in_time TIME,
  check_out_time TIME,
  status VARCHAR(50),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- ACADEMIC STRUCTURE TABLES
-- =====================================================================

CREATE TABLE IF NOT EXISTS academic_years (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  year_name VARCHAR(50) NOT NULL,
  year_code VARCHAR(10),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS terms (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  academic_year_id INT REFERENCES academic_years(id),
  term_name VARCHAR(50) NOT NULL,
  term_number INT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  department_name VARCHAR(100) NOT NULL,
  department_code VARCHAR(50),
  description TEXT,
  head_of_department INT REFERENCES staff(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  class_name VARCHAR(100) NOT NULL,
  class_code VARCHAR(50),
  level INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sections (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  class_id INT REFERENCES classes(id),
  section_name VARCHAR(100) NOT NULL,
  capacity INT,
  class_teacher INT REFERENCES staff(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS streams (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  class_id INT REFERENCES classes(id),
  stream_name VARCHAR(100) NOT NULL,
  capacity INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  subject_name VARCHAR(100) NOT NULL,
  subject_code VARCHAR(50),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_subjects (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  class_id INT REFERENCES classes(id),
  subject_id INT REFERENCES subjects(id),
  is_compulsory BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, subject_id)
);

-- =====================================================================
-- STUDENT MANAGEMENT TABLES
-- =====================================================================

CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  person_id INT REFERENCES people(id),
  student_code VARCHAR(100) UNIQUE,
  admission_number VARCHAR(100) UNIQUE,
  admission_date DATE,
  admission_type VARCHAR(50),
  class_id INT REFERENCES classes(id),
  section_id INT REFERENCES sections(id),
  stream_id INT REFERENCES streams(id),
  date_of_admission DATE,
  date_of_discharge DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  student_id INT REFERENCES students(id),
  academic_year_id INT REFERENCES academic_years(id),
  term_id INT REFERENCES terms(id),
  class_id INT REFERENCES classes(id),
  section_id INT REFERENCES sections(id),
  enrollment_status VARCHAR(50) DEFAULT 'active',
  enrollment_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_attendance (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  student_id INT REFERENCES students(id),
  attendance_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'present',
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- ACADEMICS & EXAMINATIONS TABLES
-- =====================================================================

CREATE TABLE IF NOT EXISTS timetable (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  class_id INT REFERENCES classes(id),
  section_id INT REFERENCES sections(id),
  subject_id INT REFERENCES subjects(id),
  teacher_id INT REFERENCES staff(id),
  day_of_week VARCHAR(20),
  start_time TIME,
  end_time TIME,
  room_number VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exams (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  exam_name VARCHAR(100) NOT NULL,
  exam_code VARCHAR(50),
  academic_year_id INT REFERENCES academic_years(id),
  term_id INT REFERENCES terms(id),
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  exam_id INT REFERENCES exams(id),
  student_id INT REFERENCES students(id),
  subject_id INT REFERENCES subjects(id),
  marks_obtained DECIMAL(5, 2),
  total_marks DECIMAL(5, 2),
  grade VARCHAR(2),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- FINANCIAL MANAGEMENT TABLES
-- =====================================================================

CREATE TABLE IF NOT EXISTS fee_structures (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  class_id INT REFERENCES classes(id),
  academic_year_id INT REFERENCES academic_years(id),
  fee_type VARCHAR(100),
  amount DECIMAL(12, 2),
  description TEXT,
  due_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_plans (
  id SERIAL PRIMARY KEY,
  plan_name VARCHAR(255) NOT NULL,
  plan_code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  price_termly DECIMAL(12, 2),
  price_annual DECIMAL(12, 2),
  price_monthly DECIMAL(12, 2),
  price_yearly DECIMAL(12, 2),
  trial_period_days INT DEFAULT 0,
  is_trial BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_payment_plans (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  payment_plan_id INT REFERENCES payment_plans(id),
  billing_cycle VARCHAR(50) DEFAULT 'monthly',
  status VARCHAR(50) DEFAULT 'active',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_trials (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  payment_plan_id INT REFERENCES payment_plans(id),
  trial_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  trial_end_date TIMESTAMP,
  trial_days_used INT DEFAULT 0,
  trial_days_remaining INT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  method_type VARCHAR(50),
  method_name VARCHAR(100),
  account_number VARCHAR(100),
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_reminder (
  id SERIAL PRIMARY KEY,
  payment_plan_id INT REFERENCES payment_plans(id),
  user_id INT REFERENCES users(id),
  reminder_date DATE,
  reminder_type VARCHAR(50),
  is_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id),
  balance DECIMAL(12, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- ONBOARDING & USER MANAGEMENT TABLES
-- =====================================================================

CREATE TABLE IF NOT EXISTS onboarding_steps (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  step_name VARCHAR(255) NOT NULL,
  step_order INT,
  is_completed BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'pending',
  completed_at TIMESTAMP,
  step_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  session_token VARCHAR(500) UNIQUE,
  device_info VARCHAR(255),
  ip_address VARCHAR(45),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- MISCELLANEOUS TABLES
-- =====================================================================

CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  table_name VARCHAR(100),
  record_id INT,
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notices (
  id SERIAL PRIMARY KEY,
  school_id INT REFERENCES schools(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  posted_by INT REFERENCES staff(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fingerprints (
  id SERIAL PRIMARY KEY,
  person_id INT REFERENCES people(id),
  fingerprint_data BYTEA,
  finger_position VARCHAR(50),
  quality_score DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS file_upload (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  original_filename VARCHAR(255) NOT NULL,
  stored_filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INT,
  upload_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  document_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(100),
  file_path VARCHAR(500),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS message (
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id),
  recipient_id INT REFERENCES users(id),
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================================

CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_staff_school_id ON staff(school_id);
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_student_attendance_student_id ON student_attendance(student_id);
CREATE INDEX idx_exams_school_id ON exams(school_id);
CREATE INDEX idx_results_exam_id ON results(exam_id);
CREATE INDEX idx_user_payment_plans_user_id ON user_payment_plans(user_id);
CREATE INDEX idx_user_trials_user_id ON user_trials(user_id);
CREATE INDEX idx_onboarding_steps_user_id ON onboarding_steps(user_id);
CREATE INDEX idx_payment_plans_is_active ON payment_plans(is_active);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);

-- =====================================================================
-- SEED PAYMENT PLANS
-- =====================================================================

INSERT INTO payment_plans (plan_name, plan_code, trial_period_days, is_trial, is_active, sort_order)
VALUES 
  ('Free Trial', 'trial', 40, true, true, 1),
  ('Starter', 'starter', 40, false, true, 2),
  ('Professional', 'professional', 40, false, true, 3),
  ('Enterprise', 'enterprise', 0, false, true, 4)
ON CONFLICT (plan_code) DO NOTHING;

\echo ''
\echo '✅ Complete schema deployed successfully!'
\echo ''
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
