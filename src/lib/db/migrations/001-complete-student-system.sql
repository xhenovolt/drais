-- Complete Student Management System Migration
-- DRAIS v0.0.0300
-- Adds all missing tables for production use

-- ============================================================================
-- STUDENT PHOTOS MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS student_photos (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  school_id INT NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size INT,
  mime_type VARCHAR(50),
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_current BOOLEAN DEFAULT true,
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (school_id) REFERENCES schools(id),
  FOREIGN KEY (uploaded_by) REFERENCES users(id),
  INDEX idx_student_photos_current (student_id, is_current),
  INDEX idx_student_photos_school (school_id)
);

-- ============================================================================
-- POCKET MONEY SYSTEM (Financial Ledger)
-- ============================================================================

CREATE TABLE IF NOT EXISTS pocket_money_wallets (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  school_id INT NOT NULL,
  current_balance DECIMAL(15, 2) DEFAULT 0.00,
  total_credited DECIMAL(15, 2) DEFAULT 0.00,
  total_debited DECIMAL(15, 2) DEFAULT 0.00,
  last_transaction_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (school_id) REFERENCES schools(id),
  UNIQUE (student_id, school_id),
  INDEX idx_wallets_school (school_id)
);

CREATE TABLE IF NOT EXISTS pocket_money_transactions (
  id SERIAL PRIMARY KEY,
  wallet_id INT NOT NULL,
  student_id INT NOT NULL,
  school_id INT NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- 'credit', 'debit', 'borrow', 'repay'
  amount DECIMAL(15, 2) NOT NULL,
  balance_before DECIMAL(15, 2),
  balance_after DECIMAL(15, 2),
  description VARCHAR(255),
  reference_number VARCHAR(100),
  related_student_id INT, -- For borrowing/repayment
  is_approved BOOLEAN DEFAULT true,
  approved_by INT,
  approval_date TIMESTAMP,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wallet_id) REFERENCES pocket_money_wallets(id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (school_id) REFERENCES schools(id),
  FOREIGN KEY (related_student_id) REFERENCES students(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id),
  INDEX idx_transactions_student (student_id),
  INDEX idx_transactions_school (school_id),
  INDEX idx_transactions_date (transaction_date)
);

-- ============================================================================
-- PROMOTION & DEMOTION SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS promotions_history (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  school_id INT NOT NULL,
  from_class_id INT,
  from_section_id INT,
  to_class_id INT NOT NULL,
  to_section_id INT,
  promotion_type VARCHAR(50), -- 'promotion', 'demotion', 'repetition'
  academic_year VARCHAR(20),
  term VARCHAR(20),
  reason VARCHAR(255),
  approved_by INT,
  approval_date TIMESTAMP,
  promotion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (school_id) REFERENCES schools(id),
  FOREIGN KEY (approved_by) REFERENCES users(id),
  INDEX idx_promotions_student (student_id),
  INDEX idx_promotions_school (school_id),
  INDEX idx_promotions_academic_year (academic_year)
);

-- ============================================================================
-- ALUMNI SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS alumni_records (
  id SERIAL PRIMARY KEY,
  student_id INT, -- NULL if manual entry
  school_id INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  final_class VARCHAR(50),
  completion_year INT,
  graduation_date DATE,
  contact_address TEXT,
  contact_city VARCHAR(100),
  contact_country VARCHAR(100),
  current_occupation VARCHAR(255),
  current_employer VARCHAR(255),
  alumni_status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'deceased'
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
  FOREIGN KEY (school_id) REFERENCES schools(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_alumni_school (school_id),
  INDEX idx_alumni_year (completion_year)
);

-- ============================================================================
-- DISCIPLINE MANAGEMENT SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS discipline_cases (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  school_id INT NOT NULL,
  case_number VARCHAR(100) UNIQUE NOT NULL,
  incident_type VARCHAR(100), -- e.g. 'truancy', 'violence', 'cheating', 'insubordination'
  severity VARCHAR(50), -- 'minor', 'moderate', 'serious', 'critical'
  incident_date DATE NOT NULL,
  incident_location VARCHAR(255),
  incident_description TEXT NOT NULL,
  reported_by INT,
  investigation_status VARCHAR(50) DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'closed'
  outcome_status VARCHAR(50), -- 'pending', 'guilty', 'not_guilty', 'dismissed'
  outcome_description TEXT,
  disciplinary_action VARCHAR(255), -- e.g. 'suspension', 'expulsion', 'detention'
  action_duration_days INT,
  action_start_date DATE,
  action_end_date DATE,
  is_appealed BOOLEAN DEFAULT false,
  appeal_notes TEXT,
  resolved_date DATE,
  resolved_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (school_id) REFERENCES schools(id),
  FOREIGN KEY (reported_by) REFERENCES users(id),
  FOREIGN KEY (resolved_by) REFERENCES users(id),
  INDEX idx_discipline_student (student_id),
  INDEX idx_discipline_school (school_id),
  INDEX idx_discipline_status (investigation_status)
);

CREATE TABLE IF NOT EXISTS discipline_case_history (
  id SERIAL PRIMARY KEY,
  case_id INT NOT NULL,
  action_type VARCHAR(100), -- 'created', 'updated', 'commented', 'resolved'
  action_by INT,
  action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  previous_value TEXT,
  new_value TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES discipline_cases(id) ON DELETE CASCADE,
  FOREIGN KEY (action_by) REFERENCES users(id),
  INDEX idx_case_history (case_id)
);

-- ============================================================================
-- ADMISSION LETTERS & DOCUMENTATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS admission_letters (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  school_id INT NOT NULL,
  admission_number VARCHAR(50),
  letter_date DATE DEFAULT CURRENT_DATE,
  generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  letter_content TEXT, -- HTML or PDF content
  letter_format VARCHAR(50) DEFAULT 'pdf', -- 'pdf', 'html', 'html_print'
  is_printed BOOLEAN DEFAULT false,
  printed_date TIMESTAMP,
  printed_by INT,
  is_current BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (school_id) REFERENCES schools(id),
  FOREIGN KEY (printed_by) REFERENCES users(id),
  INDEX idx_letters_student (student_id),
  INDEX idx_letters_school (school_id)
);

-- ============================================================================
-- ID CARDS MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS id_cards (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  school_id INT NOT NULL,
  card_number VARCHAR(100) UNIQUE NOT NULL,
  card_issue_date DATE DEFAULT CURRENT_DATE,
  card_expiry_date DATE,
  photo_id INT,
  is_printed BOOLEAN DEFAULT false,
  printed_date TIMESTAMP,
  printed_by INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (school_id) REFERENCES schools(id),
  FOREIGN KEY (photo_id) REFERENCES student_photos(id),
  FOREIGN KEY (printed_by) REFERENCES users(id),
  INDEX idx_idcards_student (student_id),
  INDEX idx_idcards_school (school_id)
);

-- ============================================================================
-- STUDENT IMPORT TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS student_imports (
  id SERIAL PRIMARY KEY,
  school_id INT NOT NULL,
  import_type VARCHAR(50), -- 'csv', 'excel', 'json'
  file_name VARCHAR(255),
  file_size INT,
  total_records INT,
  successful_imports INT DEFAULT 0,
  failed_imports INT DEFAULT 0,
  import_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  imported_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id),
  FOREIGN KEY (imported_by) REFERENCES users(id),
  INDEX idx_imports_school (school_id)
);

CREATE TABLE IF NOT EXISTS student_import_errors (
  id SERIAL PRIMARY KEY,
  import_id INT NOT NULL,
  row_number INT,
  error_message TEXT,
  error_field VARCHAR(100),
  error_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (import_id) REFERENCES student_imports(id) ON DELETE CASCADE,
  INDEX idx_import_errors (import_id)
);

-- ============================================================================
-- AUDIT LOGGING FOR CRITICAL OPERATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS student_audit_log (
  id SERIAL PRIMARY KEY,
  school_id INT NOT NULL,
  student_id INT,
  user_id INT,
  action VARCHAR(100), -- 'created', 'updated', 'deleted', 'promoted', 'photo_uploaded'
  entity_type VARCHAR(50), -- 'student', 'admission', 'photo', 'promotion', 'discipline'
  entity_id INT,
  changes JSON, -- What changed
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_audit_school (school_id),
  INDEX idx_audit_student (student_id),
  INDEX idx_audit_action (action),
  INDEX idx_audit_date (created_at)
);

-- ============================================================================
-- INDEXES FOR MULTI-TENANT ISOLATION & PERFORMANCE
-- ============================================================================

-- Ensure all student queries filter by school_id
ALTER TABLE students ADD INDEX IF NOT EXISTS idx_students_school_id (school_id);

-- Session queries for authentication
ALTER TABLE sessions ADD INDEX IF NOT EXISTS idx_sessions_user_id (user_id);
ALTER TABLE sessions ADD INDEX IF NOT EXISTS idx_sessions_token (session_token);

-- User queries
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_users_email (email);
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_users_school_id (school_id);
