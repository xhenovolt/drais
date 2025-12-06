-- =====================================================
-- DRAIS School Management System
-- Complete Module Expansion Schema
-- Version 0.2.00
-- Date: December 5, 2025
-- =====================================================
-- This file expands the database to support all core
-- school management modules with full functionality
-- =====================================================

-- =====================================================
-- SECTION 1: FEE MANAGEMENT MODULE (COMPLETE)
-- =====================================================

-- Fee categories for flexible fee structures
CREATE TABLE IF NOT EXISTS fee_category (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT 'e.g., Tuition, Transport, Boarding, Meals, Uniform',
    description TEXT,
    is_recurring BOOLEAN DEFAULT FALSE COMMENT 'Charged every term',
    accounting_code VARCHAR(50) COMMENT 'For integration with accounting systems',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Fee category definitions';

-- Fee discounts and scholarships
CREATE TABLE IF NOT EXISTS fee_discount (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL COMMENT 'e.g., Siblings Discount, Merit Scholarship',
    discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    applicable_to ENUM('all_fees', 'specific_category', 'specific_structure') DEFAULT 'all_fees',
    fee_category_id BIGINT UNSIGNED NULL,
    conditions JSON COMMENT 'Eligibility conditions',
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Fee discounts and scholarships';

-- Student fee discounts (many-to-many)
CREATE TABLE IF NOT EXISTS student_fee_discount (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    fee_discount_id BIGINT UNSIGNED NOT NULL,
    academic_term_id BIGINT UNSIGNED NOT NULL,
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student discount assignments';

-- Payment installments
CREATE TABLE IF NOT EXISTS payment_plan (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    academic_term_id BIGINT UNSIGNED NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    number_of_installments INT UNSIGNED NOT NULL,
    installment_amount DECIMAL(10,2) NOT NULL,
    frequency ENUM('weekly', 'biweekly', 'monthly') DEFAULT 'monthly',
    start_date DATE NOT NULL,
    status ENUM('active', 'completed', 'defaulted', 'cancelled') DEFAULT 'active',
    created_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student payment plans';

-- Payment reminders
CREATE TABLE IF NOT EXISTS payment_reminder (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    academic_term_id BIGINT UNSIGNED NOT NULL,
    reminder_type ENUM('sms', 'email', 'notification', 'all') NOT NULL,
    amount_due DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    sent_at TIMESTAMP NULL,
    status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Payment reminder logs';

-- =====================================================
-- SECTION 2: HR MANAGEMENT MODULE
-- =====================================================

-- Staff/Employee details
CREATE TABLE IF NOT EXISTS staff (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    department ENUM('teaching', 'administration', 'support', 'management', 'it', 'finance', 'library', 'transport', 'security') NOT NULL,
    designation VARCHAR(255) NOT NULL COMMENT 'Job title',
    employment_type ENUM('full_time', 'part_time', 'contract', 'temporary', 'intern') NOT NULL,
    joining_date DATE NOT NULL,
    confirmation_date DATE NULL,
    
    -- Qualification
    highest_qualification VARCHAR(255),
    specialization VARCHAR(255),
    experience_years DECIMAL(4,1),
    
    -- Compensation
    basic_salary DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'UGX',
    pay_frequency ENUM('monthly', 'weekly', 'biweekly', 'hourly') DEFAULT 'monthly',
    bank_name VARCHAR(255),
    account_number VARCHAR(50),
    
    -- Contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relationship VARCHAR(100),
    
    -- Status
    employment_status ENUM('active', 'on_leave', 'suspended', 'terminated', 'retired') DEFAULT 'active',
    termination_date DATE NULL,
    termination_reason TEXT,
    
    -- Documents
    resume_url VARCHAR(500),
    contract_url VARCHAR(500),
    certificates JSON COMMENT 'Array of certificate URLs',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Staff and employee records';

-- Leave management
CREATE TABLE IF NOT EXISTS staff_leave (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    staff_id BIGINT UNSIGNED NOT NULL,
    leave_type ENUM('annual', 'sick', 'maternity', 'paternity', 'unpaid', 'study', 'compassionate', 'other') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT UNSIGNED NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Staff leave applications';

-- Payroll
CREATE TABLE IF NOT EXISTS payroll (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    staff_id BIGINT UNSIGNED NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    
    -- Earnings
    basic_salary DECIMAL(10,2) NOT NULL,
    allowances JSON COMMENT 'Housing, transport, meal allowances',
    bonuses DECIMAL(10,2) DEFAULT 0.00,
    overtime_hours DECIMAL(5,2) DEFAULT 0.00,
    overtime_pay DECIMAL(10,2) DEFAULT 0.00,
    gross_salary DECIMAL(10,2) NOT NULL,
    
    -- Deductions
    tax DECIMAL(10,2) DEFAULT 0.00,
    pension DECIMAL(10,2) DEFAULT 0.00,
    insurance DECIMAL(10,2) DEFAULT 0.00,
    loan_deduction DECIMAL(10,2) DEFAULT 0.00,
    other_deductions JSON,
    total_deductions DECIMAL(10,2) DEFAULT 0.00,
    
    -- Net
    net_salary DECIMAL(10,2) AS (gross_salary - total_deductions) STORED,
    
    -- Payment
    payment_date DATE,
    payment_method ENUM('bank_transfer', 'cash', 'cheque', 'mobile_money'),
    payment_reference VARCHAR(100),
    status ENUM('pending', 'processed', 'paid', 'cancelled') DEFAULT 'pending',
    
    -- Approval
    generated_by BIGINT UNSIGNED NULL,
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Payroll records';

-- Performance appraisal
CREATE TABLE IF NOT EXISTS staff_appraisal (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    staff_id BIGINT UNSIGNED NOT NULL,
    academic_term_id BIGINT UNSIGNED NOT NULL,
    appraisal_date DATE NOT NULL,
    
    -- Ratings (1-5 scale)
    teaching_quality DECIMAL(2,1),
    student_engagement DECIMAL(2,1),
    professionalism DECIMAL(2,1),
    punctuality DECIMAL(2,1),
    teamwork DECIMAL(2,1),
    innovation DECIMAL(2,1),
    overall_rating DECIMAL(2,1),
    
    -- Comments
    strengths TEXT,
    areas_for_improvement TEXT,
    goals TEXT,
    appraiser_comments TEXT,
    staff_comments TEXT,
    
    -- Appraisal by
    appraised_by BIGINT UNSIGNED NOT NULL,
    status ENUM('draft', 'submitted', 'acknowledged', 'disputed') DEFAULT 'draft',
    acknowledged_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Staff performance appraisals';

-- =====================================================
-- SECTION 3: LEARNING MANAGEMENT SYSTEM (LMS)
-- =====================================================

-- Courses/Subjects extended for LMS
CREATE TABLE IF NOT EXISTS course (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    subject_id BIGINT UNSIGNED NULL COMMENT 'Links to existing subject',
    course_code VARCHAR(50) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    description TEXT,
    objectives TEXT,
    duration_hours INT UNSIGNED COMMENT 'Total course duration',
    credits INT UNSIGNED,
    level ENUM('beginner', 'intermediate', 'advanced'),
    prerequisites JSON COMMENT 'Array of prerequisite course IDs',
    syllabus_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Course catalog for LMS';

-- Lessons/Topics
CREATE TABLE IF NOT EXISTS lesson (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    course_id BIGINT UNSIGNED NOT NULL,
    lesson_number INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT COMMENT 'Lesson content/notes',
    learning_outcomes TEXT,
    duration_minutes INT UNSIGNED,
    lesson_type ENUM('lecture', 'video', 'reading', 'quiz', 'assignment', 'practical') DEFAULT 'lecture',
    
    -- Resources
    video_url VARCHAR(500),
    presentation_url VARCHAR(500),
    notes_url VARCHAR(500),
    resources JSON COMMENT 'Additional resources',
    
    is_published BOOLEAN DEFAULT FALSE,
    publish_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Course lessons and topics';

-- Assignments
CREATE TABLE IF NOT EXISTS assignment (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    course_id BIGINT UNSIGNED NOT NULL,
    lesson_id BIGINT UNSIGNED NULL,
    class_id BIGINT UNSIGNED NOT NULL,
    teacher_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT,
    total_marks DECIMAL(5,2) NOT NULL,
    
    -- Dates
    assigned_date DATETIME NOT NULL,
    due_date DATETIME NOT NULL,
    late_submission_allowed BOOLEAN DEFAULT FALSE,
    late_penalty_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Files
    attachment_url VARCHAR(500),
    submission_type ENUM('file', 'text', 'link', 'both') DEFAULT 'file',
    allowed_file_types JSON COMMENT 'pdf, doc, jpg, etc.',
    max_file_size_mb INT UNSIGNED DEFAULT 10,
    
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student assignments';

-- Assignment submissions
CREATE TABLE IF NOT EXISTS assignment_submission (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    submission_text TEXT,
    submission_url VARCHAR(500),
    submitted_at TIMESTAMP NOT NULL,
    is_late BOOLEAN DEFAULT FALSE,
    
    -- Grading
    marks_obtained DECIMAL(5,2),
    feedback TEXT,
    graded_by BIGINT UNSIGNED NULL,
    graded_at TIMESTAMP NULL,
    status ENUM('pending', 'submitted', 'graded', 'returned') DEFAULT 'submitted',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student assignment submissions';

-- Online quizzes
CREATE TABLE IF NOT EXISTS quiz (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    course_id BIGINT UNSIGNED NOT NULL,
    lesson_id BIGINT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_marks DECIMAL(5,2) NOT NULL,
    pass_percentage DECIMAL(5,2) DEFAULT 50.00,
    duration_minutes INT UNSIGNED NOT NULL,
    attempts_allowed INT UNSIGNED DEFAULT 1,
    shuffle_questions BOOLEAN DEFAULT TRUE,
    show_results ENUM('immediately', 'after_due_date', 'manual') DEFAULT 'immediately',
    
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Online quizzes';

-- Quiz questions
CREATE TABLE IF NOT EXISTS quiz_question (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT UNSIGNED NOT NULL,
    question_number INT UNSIGNED NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'short_answer', 'essay') NOT NULL,
    options JSON COMMENT 'For multiple choice',
    correct_answer TEXT,
    marks DECIMAL(5,2) NOT NULL,
    explanation TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quiz questions';

-- Quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempt (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    attempt_number INT UNSIGNED NOT NULL,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP NULL,
    time_taken_minutes INT UNSIGNED,
    
    total_marks DECIMAL(5,2),
    marks_obtained DECIMAL(5,2),
    percentage DECIMAL(5,2),
    status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
    
    answers JSON COMMENT 'Student answers'
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student quiz attempts';

-- =====================================================
-- SECTION 4: INVENTORY MANAGEMENT
-- =====================================================

-- Inventory categories
CREATE TABLE IF NOT EXISTS inventory_category (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_category_id BIGINT UNSIGNED NULL COMMENT 'For subcategories',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Inventory item categories';

-- Inventory items
CREATE TABLE IF NOT EXISTS inventory_item (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    item_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit_of_measure VARCHAR(50) COMMENT 'pieces, kg, liters, etc.',
    
    -- Quantity
    current_quantity DECIMAL(10,2) DEFAULT 0.00,
    minimum_quantity DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Reorder level',
    maximum_quantity DECIMAL(10,2),
    
    -- Pricing
    unit_cost DECIMAL(10,2) DEFAULT 0.00,
    selling_price DECIMAL(10,2),
    
    -- Location
    storage_location VARCHAR(255),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_consumable BOOLEAN DEFAULT TRUE,
    
    -- Supplier
    supplier_name VARCHAR(255),
    supplier_contact VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Inventory items catalog';

-- Stock movements (purchases, issues, returns)
CREATE TABLE IF NOT EXISTS stock_movement (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    item_id BIGINT UNSIGNED NOT NULL,
    movement_type ENUM('purchase', 'issue', 'return', 'adjustment', 'damage', 'loss') NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2) AS (quantity * unit_cost) STORED,
    
    -- Transaction details
    transaction_date DATE NOT NULL,
    reference_number VARCHAR(100),
    issued_to VARCHAR(255) COMMENT 'Department or person',
    issued_by BIGINT UNSIGNED NULL,
    
    -- Balance
    quantity_before DECIMAL(10,2),
    quantity_after DECIMAL(10,2),
    
    remarks TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stock movement history';

-- Purchase orders
CREATE TABLE IF NOT EXISTS purchase_order (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_contact VARCHAR(100),
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    actual_delivery_date DATE NULL,
    
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('draft', 'submitted', 'approved', 'ordered', 'received', 'cancelled') DEFAULT 'draft',
    
    requested_by BIGINT UNSIGNED NOT NULL,
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    
    terms_and_conditions TEXT,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Purchase orders';

-- Purchase order items
CREATE TABLE IF NOT EXISTS purchase_order_item (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    purchase_order_id BIGINT UNSIGNED NOT NULL,
    item_id BIGINT UNSIGNED NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) AS (quantity * unit_cost) STORED,
    quantity_received DECIMAL(10,2) DEFAULT 0.00
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Purchase order line items';

-- =====================================================
-- SECTION 5: FINANCE MANAGEMENT (EXTENDED)
-- =====================================================

-- Chart of accounts
CREATE TABLE IF NOT EXISTS chart_of_account (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    account_code VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type ENUM('asset', 'liability', 'equity', 'revenue', 'expense') NOT NULL,
    parent_account_id BIGINT UNSIGNED NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chart of accounts';

-- Journal entries
CREATE TABLE IF NOT EXISTS journal_entry (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    journal_number VARCHAR(50) UNIQUE NOT NULL,
    entry_date DATE NOT NULL,
    description TEXT NOT NULL,
    reference_number VARCHAR(100),
    total_debit DECIMAL(12,2) NOT NULL,
    total_credit DECIMAL(12,2) NOT NULL,
    status ENUM('draft', 'posted', 'reversed') DEFAULT 'draft',
    posted_by BIGINT UNSIGNED NULL,
    posted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='General journal entries';

-- Journal entry lines
CREATE TABLE IF NOT EXISTS journal_entry_line (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    journal_entry_id BIGINT UNSIGNED NOT NULL,
    account_id BIGINT UNSIGNED NOT NULL,
    description TEXT,
    debit_amount DECIMAL(12,2) DEFAULT 0.00,
    credit_amount DECIMAL(12,2) DEFAULT 0.00
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Journal entry line items';

-- Expenses
CREATE TABLE IF NOT EXISTS expense (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    expense_number VARCHAR(50) UNIQUE NOT NULL,
    account_id BIGINT UNSIGNED NOT NULL,
    expense_date DATE NOT NULL,
    category VARCHAR(100) COMMENT 'Utilities, Salaries, Supplies, etc.',
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'cheque', 'mobile_money', 'card') NOT NULL,
    payment_reference VARCHAR(100),
    vendor_name VARCHAR(255),
    description TEXT,
    receipt_url VARCHAR(500),
    
    status ENUM('pending', 'approved', 'paid', 'rejected') DEFAULT 'pending',
    requested_by BIGINT UNSIGNED NOT NULL,
    approved_by BIGINT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Expense tracking';

-- Budgets
CREATE TABLE IF NOT EXISTS budget (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    academic_term_id BIGINT UNSIGNED NOT NULL,
    account_id BIGINT UNSIGNED NOT NULL,
    budget_amount DECIMAL(12,2) NOT NULL,
    spent_amount DECIMAL(12,2) DEFAULT 0.00,
    remaining_amount DECIMAL(12,2) AS (budget_amount - spent_amount) STORED,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Budget planning and tracking';

-- =====================================================
-- END OF COMPLETE MODULE EXPANSION
-- =====================================================
-- This schema now supports:
-- - Fee Management (Complete with discounts, installments)
-- - HR Management (Staff, Payroll, Leave, Appraisals)
-- - Learning Management (Courses, Lessons, Assignments, Quizzes)
-- - Inventory Management (Items, Stock, Purchase Orders)
-- - Finance Management (Accounting, Journals, Expenses, Budgets)
-- =====================================================
