-- =====================================================
-- DRAIS School Management System
-- Database Schema Alterations - FIXED VERSION
-- Version 0.1.02
-- Date: December 5, 2025
-- =====================================================
-- This file contains ALTER TABLE statements to modify
-- existing tables for multi-tenancy support.
-- FIXES: Removed unsupported IF NOT EXISTS syntax
-- =====================================================

-- Use the database
USE drais;

-- =====================================================
-- SECTION 1: MULTI-TENANCY CORE TABLES
-- =====================================================

-- Add schools table if not exists (reference for all school-specific data)
CREATE TABLE IF NOT EXISTS school (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_code VARCHAR(20) UNIQUE NOT NULL COMMENT 'Unique identifier like SCH0001',
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL COMMENT 'URL-friendly name',
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    region VARCHAR(100),
    district VARCHAR(100),
    logo_url VARCHAR(500),
    website VARCHAR(255),
    registration_number VARCHAR(100),
    school_type ENUM('primary', 'secondary', 'primary_secondary', 'tertiary', 'vocational') DEFAULT 'primary',
    
    -- Subscription & Status
    subscription_plan ENUM('trial', 'professional', 'premium', 'gold') DEFAULT 'trial',
    subscription_status ENUM('active', 'suspended', 'cancelled', 'trial') DEFAULT 'trial',
    subscription_start_date DATE,
    subscription_end_date DATE,
    
    -- Owner Information
    owner_name VARCHAR(255),
    owner_email VARCHAR(255),
    owner_phone VARCHAR(50),
    
    -- System Configuration
    timezone VARCHAR(50) DEFAULT 'Africa/Kampala',
    currency VARCHAR(10) DEFAULT 'UGX',
    academic_year VARCHAR(20),
    date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
    
    -- Feature Flags
    modules_enabled JSON COMMENT 'Array of enabled module IDs',
    settings JSON COMMENT 'School-specific settings',
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    
    INDEX idx_school_code (school_code),
    INDEX idx_subscription_status (subscription_status),
    INDEX idx_region (region)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Multi-tenant school registry';

-- =====================================================
-- SECTION 2: USER MANAGEMENT & AUTHENTICATION
-- =====================================================

-- Create comprehensive users table
CREATE TABLE IF NOT EXISTS user (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NULL COMMENT 'NULL for super admins, set for school users',
    
    -- Authentication
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    gender ENUM('male', 'female', 'other'),
    date_of_birth DATE,
    national_id VARCHAR(50),
    profile_photo_url VARCHAR(500),
    
    -- Role & Permissions
    role ENUM('super_admin', 'school_admin', 'teacher', 'student', 'parent', 'accountant', 'librarian', 'staff') NOT NULL,
    permissions JSON COMMENT 'Array of permission codes',
    
    -- Status & Security
    status ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'pending',
    email_verified_at TIMESTAMP NULL,
    phone_verified_at TIMESTAMP NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    
    -- Session Management
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45),
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    
    -- Password Management
    password_changed_at TIMESTAMP NULL,
    reset_token VARCHAR(255),
    reset_token_expires_at TIMESTAMP NULL,
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE,
    INDEX idx_school_role (school_id, role),
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_status (status),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Unified user authentication and profile management';

-- =====================================================
-- SECTION 3: ALTER EXISTING TABLES FOR MULTI-TENANCY
-- Note: These ALTER statements may fail if columns exist
-- This is expected and can be ignored
-- =====================================================

-- Add columns to students table (using the actual table name from school.sql)
ALTER TABLE students 
    ADD COLUMN school_id BIGINT UNSIGNED NOT NULL AFTER id,
    ADD COLUMN user_id BIGINT UNSIGNED NULL COMMENT 'Links to user table for authentication',
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE students 
    ADD INDEX idx_school_student (school_id, id);

ALTER TABLE students 
    ADD CONSTRAINT fk_student_school FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE;

ALTER TABLE students 
    ADD CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL;

-- Add columns to teachers table
ALTER TABLE teachers 
    ADD COLUMN school_id BIGINT UNSIGNED NOT NULL AFTER id,
    ADD COLUMN user_id BIGINT UNSIGNED NULL COMMENT 'Links to user table for authentication',
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE teachers 
    ADD INDEX idx_school_teacher (school_id, id);

ALTER TABLE teachers 
    ADD CONSTRAINT fk_teacher_school FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE;

ALTER TABLE teachers 
    ADD CONSTRAINT fk_teacher_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL;

-- Add columns to classes table
ALTER TABLE classes 
    ADD COLUMN school_id BIGINT UNSIGNED NOT NULL AFTER id,
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE classes 
    ADD INDEX idx_school_class (school_id, id);

ALTER TABLE classes 
    ADD CONSTRAINT fk_class_school FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE;

-- Add columns to subjects table
ALTER TABLE subjects 
    ADD COLUMN school_id BIGINT UNSIGNED NOT NULL AFTER id,
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE subjects 
    ADD INDEX idx_school_subject (school_id, id);

ALTER TABLE subjects 
    ADD CONSTRAINT fk_subject_school FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE;

-- Add columns to exams table
ALTER TABLE exams 
    ADD COLUMN school_id BIGINT UNSIGNED NOT NULL AFTER id,
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE exams 
    ADD INDEX idx_school_exam (school_id, id);

ALTER TABLE exams 
    ADD CONSTRAINT fk_exam_school FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE;

-- Add columns to fees table (if it exists)
ALTER TABLE fees 
    ADD COLUMN school_id BIGINT UNSIGNED NOT NULL AFTER id,
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE fees 
    ADD INDEX idx_school_fee (school_id, id);

ALTER TABLE fees 
    ADD CONSTRAINT fk_fee_school FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE;

-- =====================================================
-- SECTION 4: ROLES & PERMISSIONS SYSTEM
-- =====================================================

-- Create roles table for custom role definitions
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
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    
    UNIQUE KEY unique_role_slug (school_id, slug),
    FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE,
    INDEX idx_school_role (school_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Role definitions for RBAC';

-- Create permissions table for granular permission management
CREATE TABLE IF NOT EXISTS permission (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    module VARCHAR(50) NOT NULL COMMENT 'e.g., students, finance, exams',
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System-wide permission registry';

-- Create user_role junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS user_role (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by BIGINT UNSIGNED COMMENT 'User who assigned this role',
    
    UNIQUE KEY unique_user_role (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES user(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_role (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User role assignments';

-- =====================================================
-- SECTION 5: ACADEMIC STRUCTURE TABLES
-- =====================================================

-- Create academic terms table
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
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE,
    INDEX idx_school_term (school_id, is_current),
    INDEX idx_academic_year (academic_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Academic terms/semesters';

-- Create sections/streams table (e.g., Class 5A, Class 5B)
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
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (class_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
    INDEX idx_school_section (school_id, class_id),
    UNIQUE KEY unique_class_section (class_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Class sections/streams';

-- Create class_subject junction table
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_class_subject (class_id, subject_id),
    FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
    INDEX idx_school_class_subject (school_id, class_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Subjects assigned to classes';

-- =====================================================
-- SECTION 6: SYSTEM CONFIGURATION TABLES
-- =====================================================

-- Create system settings table
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_school_setting (school_id, category, setting_key),
    FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE,
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System and school configuration';

-- Create audit log table for tracking changes
CREATE TABLE IF NOT EXISTS audit_log_enhanced (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL,
    INDEX idx_school_audit (school_id, created_at),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_user_action (user_id, action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System audit trail';

-- =====================================================
-- SECTION 7: INITIAL DATA SEEDING
-- =====================================================

-- Insert default system permissions
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

-- Insert default system roles
INSERT IGNORE INTO role (school_id, name, slug, description, is_system_role, permissions) VALUES
(NULL, 'Super Administrator', 'super_admin', 'Full system access across all schools', TRUE, '["*"]'),
(NULL, 'School Administrator', 'school_admin', 'Full access within school', TRUE, '["students.*", "teachers.*", "finance.*", "exams.*", "settings.*"]'),
(NULL, 'Teacher', 'teacher', 'Teaching and class management', TRUE, '["students.view", "exams.view", "exams.marks"]'),
(NULL, 'Accountant', 'accountant', 'Financial management', TRUE, '["finance.*", "students.view"]'),
(NULL, 'Librarian', 'librarian', 'Library management', TRUE, '["library.*", "students.view"]');

-- =====================================================
-- END OF SCHEMA ALTERATIONS
-- =====================================================
