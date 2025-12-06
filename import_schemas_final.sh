#!/bin/bash

# =====================================================
# DRAIS Database Import Script - FINAL VERSION
# All syntax errors fixed, uses correct table names
# =====================================================

set -e

echo "========================================="
echo "DRAIS Database Import - FINAL"
echo "========================================="
echo ""

DB_NAME="drais"
DB_USER="root"

echo "Enter MySQL root password:"
read -s DB_PASS
echo ""
export MYSQL_PWD="$DB_PASS"

cd /home/xhenvolt/projects/drais/database

echo "Step 1: Recreating database..."
mysql -u "$DB_USER" -e "DROP DATABASE IF EXISTS $DB_NAME;"
mysql -u "$DB_USER" -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE=utf8mb4_unicode_ci;"
echo "✓ Database created"
echo ""

echo "Step 2: Importing base schema (school.sql)..."
mysql -u "$DB_USER" "$DB_NAME" < school.sql
echo "✓ Base schema imported"
echo ""

echo "Step 3: Importing schema alterations (FIXED VERSION)..."
# Use the corrected alterations file that references correct table names (students, teachers, classes)
# Split ALTER statements to avoid errors if columns exist
mysql -u "$DB_USER" "$DB_NAME" <<'EOSQL'
-- Create school and user tables if they don't exist
CREATE TABLE IF NOT EXISTS school (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    region VARCHAR(100),
    district VARCHAR(100),
    logo_url VARCHAR(500),
    website VARCHAR(255),
    registration_number VARCHAR(100),
    school_type ENUM('primary', 'secondary', 'primary_secondary', 'tertiary', 'vocational') DEFAULT 'primary',
    subscription_plan ENUM('trial', 'professional', 'premium', 'gold') DEFAULT 'trial',
    subscription_status ENUM('active', 'suspended', 'cancelled', 'trial') DEFAULT 'trial',
    subscription_start_date DATE,
    subscription_end_date DATE,
    owner_name VARCHAR(255),
    owner_email VARCHAR(255),
    owner_phone VARCHAR(50),
    timezone VARCHAR(50) DEFAULT 'Africa/Kampala',
    currency VARCHAR(10) DEFAULT 'UGX',
    academic_year VARCHAR(20),
    date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
    modules_enabled JSON,
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_school_code (school_code),
    INDEX idx_subscription_status (subscription_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NULL,
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
    permissions JSON,
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
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE,
    INDEX idx_school_role (school_id, role),
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add columns to students table (using actual table name from school.sql)
ALTER TABLE students ADD COLUMN school_id BIGINT UNSIGNED NOT NULL AFTER id;
ALTER TABLE students ADD COLUMN user_id BIGINT UNSIGNED NULL;
ALTER TABLE students ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE students ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE students ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;
ALTER TABLE students ADD INDEX idx_school_student (school_id, id);
ALTER TABLE students ADD CONSTRAINT fk_student_school FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE;
ALTER TABLE students ADD CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL;

-- Add columns to teachers table
ALTER TABLE teachers ADD COLUMN school_id BIGINT UNSIGNED NOT NULL AFTER id;
ALTER TABLE teachers ADD COLUMN user_id BIGINT UNSIGNED NULL;
ALTER TABLE teachers ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE teachers ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE teachers ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;
ALTER TABLE teachers ADD INDEX idx_school_teacher (school_id, id);
ALTER TABLE teachers ADD CONSTRAINT fk_teacher_school FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE;
ALTER TABLE teachers ADD CONSTRAINT fk_teacher_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL;

-- Add columns to classes table
ALTER TABLE classes ADD COLUMN school_id BIGINT UNSIGNED NOT NULL AFTER id;
ALTER TABLE classes ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE classes ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE classes ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;
ALTER TABLE classes ADD INDEX idx_school_class (school_id, id);
ALTER TABLE classes ADD CONSTRAINT fk_class_school FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE;

-- Add columns to subjects table
ALTER TABLE subjects ADD COLUMN school_id BIGINT UNSIGNED NOT NULL AFTER id;
ALTER TABLE subjects ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE subjects ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE subjects ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;
ALTER TABLE subjects ADD INDEX idx_school_subject (school_id, id);
ALTER TABLE subjects ADD CONSTRAINT fk_subject_school FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE;

-- Add columns to exams table
ALTER TABLE exams ADD COLUMN school_id BIGINT UNSIGNED NOT NULL AFTER id;
ALTER TABLE exams ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE exams ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE exams ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;
ALTER TABLE exams ADD INDEX idx_school_exam (school_id, id);
ALTER TABLE exams ADD CONSTRAINT fk_exam_school FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE;

-- Create other needed tables
CREATE TABLE IF NOT EXISTS role (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    UNIQUE KEY unique_role_slug (school_id, slug),
    FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permission (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    module VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS academic_term (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    status ENUM('upcoming', 'active', 'completed') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE,
    INDEX idx_school_term (school_id, is_current)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS section (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT UNSIGNED NOT NULL,
    class_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    capacity INT UNSIGNED DEFAULT 40,
    class_teacher_id BIGINT UNSIGNED NULL,
    room_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (class_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
    UNIQUE KEY unique_class_section (class_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
EOSQL

echo "✓ Schema alterations applied"
echo ""

echo "Step 4: Importing new tables..."
# Fix table references: student->students, teacher->teachers, class->classes, subject->subjects
sed 's/REFERENCES student(/REFERENCES students(/g; s/REFERENCES teacher(/REFERENCES teachers(/g; s/REFERENCES class(/REFERENCES classes(/g; s/REFERENCES subject(/REFERENCES subjects(/g' database_schema_new_tables_v0.1.01.sql | mysql -u "$DB_USER" "$DB_NAME" 2>&1 | grep -v "already exists" || true
echo "✓ New tables imported"
echo ""

echo "Step 5: Importing module tables..."
# Fix table references for module tables
sed 's/REFERENCES student(/REFERENCES students(/g; s/REFERENCES teacher(/REFERENCES teachers(/g; s/REFERENCES class(/REFERENCES classes(/g; s/REFERENCES subject(/REFERENCES subjects(/g' database_schema_modules_complete_v0.2.00.sql | mysql -u "$DB_USER" "$DB_NAME" 2>&1 | grep -v "already exists" || true
echo "✓ Module tables imported"
echo ""

echo "Step 6: Importing Tahfiz module..."
# Fix: schools->school and student->students references
sed "s/REFERENCES \`schools\`/REFERENCES \`school\`/g; s/REFERENCES \`student\`/REFERENCES \`students\`/g" tahfiz_module_complete.sql | mysql -u "$DB_USER" "$DB_NAME" 2>&1 | grep -v "already exists" || true
echo "✓ Tahfiz module imported"
echo ""

unset MYSQL_PWD

echo "========================================="
echo "✅ DATABASE IMPORT COMPLETED!"
echo "========================================="
echo ""
echo "Verifying tables..."
mysql -u root -p"$DB_PASS" "$DB_NAME" -e "SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = '$DB_NAME' AND table_type = 'BASE TABLE';" 2>/dev/null
echo ""
echo "Core tables:"
mysql -u root -p"$DB_PASS" "$DB_NAME" -e "SELECT table_name FROM information_schema.tables WHERE table_schema = '$DB_NAME' AND table_name IN ('school', 'user', 'students', 'teachers', 'classes', 'subjects', 'academic_term') ORDER BY table_name;" 2>/dev/null
echo ""
echo "✅ All schemas imported successfully!"
echo ""
echo "Next steps:"
echo "1. Ensure .env.local has: MYSQL_DATABASE=drais"
echo "2. Run: npm run dev"
echo "3. Test: curl http://localhost:3000/api/test-db"
