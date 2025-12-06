-- =====================================================
-- DRAIS School Management System
-- New Tables Schema
-- Version 0.1.01
-- Date: December 5, 2025
-- =====================================================
-- This file contains CREATE TABLE statements for new
-- tables not present in the existing schema.
-- These tables support future features and complete
-- the school management system functionality.
-- =====================================================

-- =====================================================
-- SECTION 1: ATTENDANCE MANAGEMENT
-- =====================================================

-- Student attendance tracking
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    class_id BIGINT UNSIGNED NOT NULL,
    section_id BIGINT UNSIGNED NULL,
    academic_term_id BIGINT UNSIGNED NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused', 'half_day') NOT NULL,
    check_in_time TIME NULL,
    check_out_time TIME NULL,
    remarks TEXT,
    recorded_by BIGINT UNSIGNED NULL COMMENT 'User who recorded attendance',
    method ENUM('manual', 'biometric', 'rfid', 'qr_code') DEFAULT 'manual',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student daily attendance records';

-- Teacher/Staff attendance tracking
CREATE TABLE IF NOT EXISTS staff_attendance (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL COMMENT 'Teacher or staff user',
    attendance_date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'on_leave', 'half_day') NOT NULL,
    check_in_time TIME NULL,
    check_out_time TIME NULL,
    total_hours DECIMAL(5,2) NULL,
    remarks TEXT,
    recorded_by BIGINT UNSIGNED NULL,
    method ENUM('manual', 'biometric', 'rfid', 'qr_code') DEFAULT 'manual',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Staff daily attendance records';

-- =====================================================
-- SECTION 2: FEE MANAGEMENT & PAYMENTS
-- =====================================================

-- Fee structures for different classes
CREATE TABLE IF NOT EXISTS fee_structure (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    academic_term_id BIGINT UNSIGNED NOT NULL,
    class_id BIGINT UNSIGNED NULL COMMENT 'NULL for school-wide fees',
    fee_type VARCHAR(100) NOT NULL COMMENT 'e.g., Tuition, Transport, Boarding, Exam',
    amount DECIMAL(10,2) NOT NULL,
    is_compulsory BOOLEAN DEFAULT TRUE,
    due_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Fee structure definitions';

-- Payment transactions
CREATE TABLE IF NOT EXISTS payment (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    academic_term_id BIGINT UNSIGNED NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'mobile_money', 'cheque', 'card') NOT NULL,
    payment_reference VARCHAR(100) COMMENT 'Transaction ID from payment gateway',
    payment_date DATETIME NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    paid_by VARCHAR(255) COMMENT 'Name of person who paid',
    phone_number VARCHAR(50),
    remarks TEXT,
    processed_by BIGINT UNSIGNED NULL COMMENT 'User who processed payment',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Payment transactions';

-- Student account balances
CREATE TABLE IF NOT EXISTS student_account (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    academic_term_id BIGINT UNSIGNED NOT NULL,
    total_fees DECIMAL(10,2) DEFAULT 0.00,
    amount_paid DECIMAL(10,2) DEFAULT 0.00,
    balance DECIMAL(10,2) AS (total_fees - amount_paid) STORED,
    last_payment_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student fee account balances';

-- =====================================================
-- SECTION 3: COMMUNICATION & MESSAGING
-- =====================================================

-- Notifications system
CREATE TABLE IF NOT EXISTS notification (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NULL COMMENT 'NULL for system-wide notifications',
    user_id BIGINT UNSIGNED NULL COMMENT 'Specific user, NULL for broadcast',
    recipient_type ENUM('user', 'role', 'class', 'all') DEFAULT 'user',
    recipient_id VARCHAR(100) COMMENT 'User ID, role slug, or class ID',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error', 'announcement') DEFAULT 'info',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    category VARCHAR(50) COMMENT 'e.g., fees, exams, attendance, general',
    action_url VARCHAR(500) COMMENT 'Link to relevant page',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System notifications';

-- Messages/Chat system
CREATE TABLE IF NOT EXISTS message (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    sender_id BIGINT UNSIGNED NOT NULL,
    recipient_id BIGINT UNSIGNED NULL COMMENT 'NULL for group messages',
    conversation_id VARCHAR(100) COMMENT 'For threading messages',
    subject VARCHAR(255),
    body TEXT NOT NULL,
    message_type ENUM('direct', 'group', 'announcement') DEFAULT 'direct',
    priority ENUM('normal', 'high') DEFAULT 'normal',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    attachments JSON COMMENT 'Array of file URLs',
    parent_message_id BIGINT UNSIGNED NULL COMMENT 'For reply threading',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Internal messaging system';

-- SMS logs
CREATE TABLE IF NOT EXISTS sms_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    recipient_phone VARCHAR(50) NOT NULL,
    recipient_user_id BIGINT UNSIGNED NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed', 'delivered') DEFAULT 'pending',
    sms_provider VARCHAR(50) COMMENT 'e.g., africastalking, twilio',
    provider_message_id VARCHAR(255),
    cost DECIMAL(8,4) DEFAULT 0.0000,
    error_message TEXT,
    sent_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SMS sending logs';

-- Email logs
CREATE TABLE IF NOT EXISTS email_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_user_id BIGINT UNSIGNED NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed', 'bounced') DEFAULT 'pending',
    email_provider VARCHAR(50) COMMENT 'e.g., smtp, sendgrid, mailgun',
    provider_message_id VARCHAR(255),
    attachments JSON,
    error_message TEXT,
    sent_at TIMESTAMP NULL,
    opened_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Email sending logs';

-- =====================================================
-- SECTION 4: LIBRARY MANAGEMENT
-- =====================================================

-- Book catalog
CREATE TABLE IF NOT EXISTS library_book (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    isbn VARCHAR(20),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    publisher VARCHAR(255),
    publication_year YEAR,
    category VARCHAR(100) COMMENT 'e.g., Fiction, Science, History',
    total_copies INT UNSIGNED DEFAULT 1,
    available_copies INT UNSIGNED DEFAULT 1,
    book_location VARCHAR(100) COMMENT 'Shelf/rack location',
    description TEXT,
    cover_image_url VARCHAR(500),
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Library book catalog';

-- Book borrowing records
CREATE TABLE IF NOT EXISTS library_transaction (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    book_id BIGINT UNSIGNED NOT NULL,
    borrower_type ENUM('student', 'teacher', 'staff') NOT NULL,
    borrower_id BIGINT UNSIGNED NOT NULL COMMENT 'Student or User ID',
    borrowed_date DATE NOT NULL,
    due_date DATE NOT NULL,
    returned_date DATE NULL,
    status ENUM('borrowed', 'returned', 'overdue', 'lost') DEFAULT 'borrowed',
    fine_amount DECIMAL(10,2) DEFAULT 0.00,
    fine_paid BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    issued_by BIGINT UNSIGNED NULL,
    received_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Book borrowing transactions';

-- =====================================================
-- SECTION 5: EVENTS & CALENDAR
-- =====================================================

-- School events calendar
CREATE TABLE IF NOT EXISTS event (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type ENUM('holiday', 'exam', 'meeting', 'sports', 'cultural', 'other') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NULL,
    end_time TIME NULL,
    location VARCHAR(255),
    target_audience ENUM('all', 'students', 'teachers', 'parents', 'specific_class') DEFAULT 'all',
    class_id BIGINT UNSIGNED NULL COMMENT 'If target_audience is specific_class',
    is_holiday BOOLEAN DEFAULT FALSE,
    organizer_id BIGINT UNSIGNED NULL,
    max_participants INT UNSIGNED NULL,
    registration_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='School events and calendar';

-- Event participants/attendance
CREATE TABLE IF NOT EXISTS event_participant (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT UNSIGNED NOT NULL,
    participant_type ENUM('student', 'teacher', 'parent', 'guest') NOT NULL,
    participant_id BIGINT UNSIGNED NULL COMMENT 'Student or User ID',
    participant_name VARCHAR(255),
    status ENUM('registered', 'attended', 'absent', 'cancelled') DEFAULT 'registered',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended_at TIMESTAMP NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Event participants and attendance';

-- =====================================================
-- SECTION 6: TIMETABLE MANAGEMENT
-- =====================================================

-- Class timetable/schedule
CREATE TABLE IF NOT EXISTS timetable (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    academic_term_id BIGINT UNSIGNED NOT NULL,
    class_id BIGINT UNSIGNED NOT NULL,
    section_id BIGINT UNSIGNED NULL,
    subject_id BIGINT UNSIGNED NOT NULL,
    teacher_id BIGINT UNSIGNED NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Class timetables';

-- =====================================================
-- SECTION 7: TRANSPORT MANAGEMENT
-- =====================================================

-- Transport routes
CREATE TABLE IF NOT EXISTS transport_route (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    route_name VARCHAR(255) NOT NULL,
    route_number VARCHAR(50),
    description TEXT,
    fare DECIMAL(10,2) DEFAULT 0.00,
    vehicle_number VARCHAR(50),
    driver_name VARCHAR(255),
    driver_phone VARCHAR(50),
    capacity INT UNSIGNED,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Transport routes';

-- Route stops
CREATE TABLE IF NOT EXISTS route_stop (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT UNSIGNED NOT NULL,
    stop_name VARCHAR(255) NOT NULL,
    stop_order INT UNSIGNED NOT NULL,
    pickup_time TIME,
    dropoff_time TIME,
    landmark VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Route pickup/dropoff stops';

-- Student transport assignments
CREATE TABLE IF NOT EXISTS student_transport (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    route_id BIGINT UNSIGNED NOT NULL,
    stop_id BIGINT UNSIGNED NOT NULL,
    academic_term_id BIGINT UNSIGNED NOT NULL,
    status ENUM('active', 'suspended', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student transport assignments';

-- =====================================================
-- SECTION 8: EXAMINATION & GRADING
-- =====================================================

-- Exam schedules
CREATE TABLE IF NOT EXISTS exam_schedule (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    exam_id BIGINT UNSIGNED NOT NULL,
    class_id BIGINT UNSIGNED NOT NULL,
    subject_id BIGINT UNSIGNED NOT NULL,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT UNSIGNED,
    room_number VARCHAR(50),
    total_marks DECIMAL(5,2) DEFAULT 100.00,
    invigilator_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Examination schedules';

-- Exam results/marks
CREATE TABLE IF NOT EXISTS exam_result (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    exam_schedule_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    total_marks DECIMAL(5,2) NOT NULL,
    percentage DECIMAL(5,2) AS ((marks_obtained / total_marks) * 100) STORED,
    grade VARCHAR(10),
    remarks TEXT,
    entered_by BIGINT UNSIGNED NULL,
    verified_by BIGINT UNSIGNED NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Examination results and marks';

-- =====================================================
-- SECTION 9: CERTIFICATES & DOCUMENTS
-- =====================================================

-- Certificate templates
CREATE TABLE IF NOT EXISTS certificate_template (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    template_type ENUM('completion', 'achievement', 'participation', 'character', 'custom') NOT NULL,
    template_design JSON COMMENT 'Template design configuration',
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Certificate templates';

-- Generated certificates
CREATE TABLE IF NOT EXISTS certificate (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    template_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    certificate_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    issue_date DATE NOT NULL,
    pdf_url VARCHAR(500),
    issued_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Issued certificates';

-- =====================================================
-- SECTION 10: PLUGINS & EXTENSIONS
-- =====================================================

-- Installed plugins/extensions
CREATE TABLE IF NOT EXISTS plugin (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NULL COMMENT 'NULL for system-wide plugins',
    plugin_key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(20) NOT NULL,
    author VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    settings JSON COMMENT 'Plugin-specific settings',
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Installed plugins and extensions';

-- =====================================================
-- SECTION 11: REPORTS & ANALYTICS
-- =====================================================

-- Saved reports
CREATE TABLE IF NOT EXISTS saved_report (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    report_type VARCHAR(100) NOT NULL COMMENT 'e.g., income_statement, balance_sheet, attendance',
    report_name VARCHAR(255) NOT NULL,
    parameters JSON COMMENT 'Report generation parameters',
    file_url VARCHAR(500),
    file_format ENUM('pdf', 'excel', 'csv') NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL COMMENT 'Auto-delete old reports'
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Generated and saved reports';

-- =====================================================
-- SECTION 12: FILE UPLOADS & MEDIA
-- =====================================================

-- File uploads tracking
CREATE TABLE IF NOT EXISTS file_upload (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NULL,
    uploaded_by BIGINT UNSIGNED NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT UNSIGNED COMMENT 'Size in bytes',
    mime_type VARCHAR(100),
    entity_type VARCHAR(100) COMMENT 'Table name this file relates to',
    entity_id BIGINT UNSIGNED COMMENT 'ID of related record',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='File upload tracking';

-- =====================================================
-- END OF NEW TABLES SCHEMA
-- =====================================================
-- This completes the database schema for DRAIS
-- All tables support multi-tenancy and self-onboarding
-- =====================================================
