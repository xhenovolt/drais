-- =====================================================
-- DRAIS School Management System
-- Database Schema Alterations - CORRECTED
-- Version 0.1.02
-- Date: December 6, 2025
-- =====================================================
-- This file contains ALTER TABLE statements to modify
-- existing tables from school.sql for multi-tenancy
-- support and enhanced functionality.
-- IMPORTANT: Run this AFTER school.sql
-- =====================================================

USE `drais`;

-- =====================================================
-- SECTION 1: ALTER EXISTING SCHOOLS TABLE
-- =====================================================

-- Add missing columns to schools table (already exists in school.sql)
ALTER TABLE schools 
    -- ADD COLUMN  school_code VARCHAR(20) UNIQUE AFTER id,
    ADD COLUMN  slug VARCHAR(255) UNIQUE AFTER name,
    ADD COLUMN  region VARCHAR(100) AFTER address,
    ADD COLUMN  district VARCHAR(100) AFTER region,
    ADD COLUMN  website VARCHAR(255) AFTER logo_url,
    ADD COLUMN  registration_number VARCHAR(100) AFTER website,
    ADD COLUMN  school_type ENUM('primary', 'secondary', 'primary_secondary', 'tertiary', 'vocational') DEFAULT 'primary' AFTER registration_number;

ALTER TABLE schools
    ADD COLUMN  subscription_plan ENUM('trial', 'professional', 'premium', 'gold') DEFAULT 'trial',
    ADD COLUMN  subscription_status ENUM('active', 'suspended', 'cancelled', 'trial') DEFAULT 'trial',
    ADD COLUMN  subscription_start_date DATE,
    ADD COLUMN  subscription_end_date DATE;

ALTER TABLE schools
    ADD COLUMN  owner_name VARCHAR(255),
    ADD COLUMN  owner_email VARCHAR(255),
    ADD COLUMN  owner_phone VARCHAR(50);

ALTER TABLE schools
    ADD COLUMN  timezone VARCHAR(50) DEFAULT 'Africa/Kampala',
    ADD COLUMN  academic_year VARCHAR(20),
    ADD COLUMN  date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY';

ALTER TABLE schools
    ADD COLUMN  modules_enabled JSON COMMENT 'Array of enabled module IDs',
    ADD COLUMN  settings JSON COMMENT 'School-specific settings';

-- =====================================================
-- SECTION 2: CREATE NEW TABLES (NOT IN SCHOOL.SQL)
-- =====================================================

-- Create comprehensive users table
CREATE TABLE IF NOT EXISTS user (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NULL COMMENT 'NULL for super admins, set for school users',
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    gender ENUM('male', 'female', 'other'),
    date_of_birth DATE,
    national_id VARCHAR(50),
    profile_photo_url VARCHAR(500),
    role ENUM('super_admin', 'school_admin', 'teacher', 'student', 'parent', 'accountant', 'librarian', 'staff') NOT NULL,
    permissions JSON COMMENT 'Array of permission codes',
    status ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'pending',
    email_verified_at TIMESTAMP NULL,
    phone_verified_at TIMESTAMP NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45),
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    password_changed_at TIMESTAMP NULL,
    reset_token VARCHAR(255),
    reset_token_expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Unified user authentication and profile management';

-- =====================================================
-- SECTION 3: ALTER EXISTING TABLES FOR MULTI-TENANCY
-- =====================================================

-- Add school_id to students table
ALTER TABLE students 
    ADD COLUMN  school_id BIGINT UNSIGNED NOT NULL AFTER id,
    ADD COLUMN  user_id BIGINT UNSIGNED NULL,
    ADD COLUMN  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD COLUMN  deleted_at TIMESTAMP NULL DEFAULT NULL;

-- Add school_id to staff table (teachers/staff)
ALTER TABLE staff 
    ADD COLUMN  school_id BIGINT UNSIGNED NOT NULL AFTER id,
    ADD COLUMN  user_id BIGINT UNSIGNED NULL,
    ADD COLUMN  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD COLUMN  deleted_at TIMESTAMP NULL DEFAULT NULL;

-- Add school_id to classes table
ALTER TABLE classes 
    ADD COLUMN  school_id BIGINT UNSIGNED NOT NULL AFTER id,
    ADD COLUMN  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD COLUMN  deleted_at TIMESTAMP NULL DEFAULT NULL;

-- Add school_id to subjects table
ALTER TABLE subjects 
    ADD COLUMN  school_id BIGINT UNSIGNED NOT NULL AFTER id,
    ADD COLUMN  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD COLUMN  deleted_at TIMESTAMP NULL DEFAULT NULL;

-- Add school_id to exams table
ALTER TABLE exams 
    ADD COLUMN  school_id BIGINT UNSIGNED NOT NULL AFTER id,
    ADD COLUMN  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD COLUMN  deleted_at TIMESTAMP NULL DEFAULT NULL;

-- =====================================================
-- SECTION 4: ROLES & PERMISSIONS SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS role (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NULL COMMENT 'NULL for system-wide roles, set for custom school roles',
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE COMMENT 'System roles cannot be deleted',
    permissions JSON COMMENT 'Array of permission codes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Role definitions for RBAC';

CREATE TABLE IF NOT EXISTS permission (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    module VARCHAR(50) NOT NULL COMMENT 'e.g., students, finance, exams',
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System-wide permission registry';

CREATE TABLE IF NOT EXISTS user_role (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by BIGINT UNSIGNED COMMENT 'User who assigned this role'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User role assignments';

-- =====================================================
-- SECTION 5: ACADEMIC STRUCTURE TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS academic_term (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT 'e.g., Term 1, First Semester',
    academic_year VARCHAR(20) NOT NULL COMMENT 'e.g., 2025',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    status ENUM('upcoming', 'active', 'completed') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Academic terms/semesters';

CREATE TABLE IF NOT EXISTS section (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    class_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT 'e.g., A, B, Science, Arts',
    capacity INT UNSIGNED DEFAULT 40,
    class_teacher_id BIGINT UNSIGNED NULL,
    room_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Class sections/streams';

CREATE TABLE IF NOT EXISTS class_subject (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    class_id BIGINT UNSIGNED NOT NULL,
    subject_id BIGINT UNSIGNED NOT NULL,
    teacher_id BIGINT UNSIGNED NULL,
    is_compulsory BOOLEAN DEFAULT TRUE,
    pass_mark DECIMAL(5,2) DEFAULT 50.00,
    total_marks DECIMAL(5,2) DEFAULT 100.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Subjects assigned to classes';

-- =====================================================
-- SECTION 6: SYSTEM CONFIGURATION TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS system_setting (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NULL COMMENT 'NULL for global settings, set for school-specific',
    category VARCHAR(50) NOT NULL COMMENT 'e.g., email, sms, payment, general',
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    data_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    is_encrypted BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System and school configuration';

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NULL,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(50) NOT NULL COMMENT 'e.g., create, update, delete, login',
    entity_type VARCHAR(100) COMMENT 'Table/model name',
    entity_id BIGINT UNSIGNED COMMENT 'ID of affected record',
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System audit trail';

-- =====================================================
-- SECTION 7: INITIAL DATA SEEDING
-- =====================================================

INSERT IGNORE INTO permission (module, name, slug, description) VALUES
('students', 'View Students', 'students.view', 'View student records'),
('students', 'Create Students', 'students.create', 'Add new students'),
('students', 'Edit Students', 'students.edit', 'Modify student information'),
('students', 'Delete Students', 'students.delete', 'Remove student records'),
('teachers', 'View Teachers', 'teachers.view', 'View teacher records'),
('teachers', 'Create Teachers', 'teachers.create', 'Add new teachers'),
('teachers', 'Edit Teachers', 'teachers.edit', 'Modify teacher information'),
('teachers', 'Delete Teachers', 'teachers.delete', 'Remove teacher records'),
('finance', 'View Finances', 'finance.view', 'View financial records'),
('finance', 'Manage Fees', 'finance.manage', 'Create and edit fee structures'),
('finance', 'Process Payments', 'finance.payments', 'Record and process payments'),
('finance', 'Financial Reports', 'finance.reports', 'Generate financial reports'),
('exams', 'View Exams', 'exams.view', 'View examination records'),
('exams', 'Create Exams', 'exams.create', 'Set up examinations'),
('exams', 'Enter Marks', 'exams.marks', 'Record examination marks'),
('exams', 'Generate Reports', 'exams.reports', 'Generate report cards'),
('settings', 'System Settings', 'settings.system', 'Modify system configuration'),
('settings', 'User Management', 'settings.users', 'Manage user accounts'),
('settings', 'Role Management', 'settings.roles', 'Manage roles and permissions');

INSERT IGNORE INTO role (school_id, name, slug, description, is_system_role, permissions) VALUES
(NULL, 'Super Administrator', 'super_admin', 'Full system access across all schools', TRUE, '["*"]'),
(NULL, 'School Administrator', 'school_admin', 'Full access within school', TRUE, '["students.*", "teachers.*", "finance.*", "exams.*", "settings.*"]'),
(NULL, 'Teacher', 'teacher', 'Teaching and class management', TRUE, '["students.view", "exams.view", "exams.marks"]'),
(NULL, 'Accountant', 'accountant', 'Financial management', TRUE, '["finance.*", "students.view"]'),
(NULL, 'Librarian', 'librarian', 'Library management', TRUE, '["library.*", "students.view"]');

-- =====================================================
-- END OF SCHEMA ALTERATIONS
-- =====================================================
