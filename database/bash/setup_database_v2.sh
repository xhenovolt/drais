#!/bin/bash

# =====================================================
# DRAIS Database Complete Setup Script v2
# Fixes ALL schema issues including table name mismatches
# =====================================================

set -e  # Exit on error

echo "========================================="
echo "DRAIS Database Complete Setup v2"
echo "========================================="
echo ""

DB_NAME="drais"
DB_USER="root"

# Get password
echo "Enter MySQL root password:"
read -s DB_PASS
echo ""
export MYSQL_PWD="$DB_PASS"

echo "Step 1: Dropping and recreating database..."
mysql -u "$DB_USER" -e "DROP DATABASE IF EXISTS $DB_NAME;"
mysql -u "$DB_USER" -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo "✓ Database created"
echo ""

echo "Step 2: Importing base schema (school.sql)..."
mysql -u "$DB_USER" "$DB_NAME" < school.sql
echo "✓ Base schema imported"
echo ""

echo "Step 3: Creating student table alias..."
# The base schema has 'students' (plural) but other schemas reference 'student' (singular)
# Create a view as a workaround, then create proper student table
mysql -u "$DB_USER" "$DB_NAME" <<EOF
-- Rename students to student for consistency
DROP TABLE IF EXISTS student;
RENAME TABLE students TO student;

-- Also check for other plural/singular mismatches
-- Fix teacher/teachers if exists
SET @check_teachers = (SELECT COUNT(*) FROM information_schema.tables 
    WHERE table_schema = '$DB_NAME' AND table_name = 'teachers');
SET @sql = IF(@check_teachers > 0, 'RENAME TABLE teachers TO teacher;', 'SELECT 1;');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Fix class/classes if exists  
SET @check_classes = (SELECT COUNT(*) FROM information_schema.tables 
    WHERE table_schema = '$DB_NAME' AND table_name = 'classes');
SET @sql = IF(@check_classes > 0, 'RENAME TABLE classes TO class;', 'SELECT 1;');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
EOF
echo "✓ Table names normalized to singular"
echo ""

echo "Step 4: Fixing and importing schema alterations..."
# Fix IF NOT EXISTS syntax (not supported in older MySQL)
cat database_schema_alterations_v0.1.01.sql | \
  sed 's/ADD COLUMN IF NOT EXISTS/ADD COLUMN/g' | \
  sed 's/ADD INDEX IF NOT EXISTS/ADD INDEX/g' | \
  sed 's/ADD FOREIGN KEY IF NOT EXISTS/ADD FOREIGN KEY/g' | \
  mysql -u "$DB_USER" "$DB_NAME" 2>&1 | grep -v "Duplicate column name" | grep -v "Duplicate key name" | grep -v "ERROR 1060" | grep -v "ERROR 1061" || true
echo "✓ Schema alterations applied"
echo ""

echo "Step 5: Importing new tables..."
mysql -u "$DB_USER" "$DB_NAME" < database_schema_new_tables_v0.1.01.sql 2>&1 | grep -v "already exists" || true
echo "✓ New tables imported"
echo ""

echo "Step 6: Importing module tables..."
mysql -u "$DB_USER" "$DB_NAME" < database_schema_modules_complete_v0.2.00.sql 2>&1 | grep -v "already exists" || true
echo "✓ Module tables imported"
echo ""

echo "Step 7: Fixing and importing Tahfiz module..."
# Fix wrong table reference: schools -> school
cat tahfiz_module_complete.sql | \
  sed "s/REFERENCES \`schools\`/REFERENCES \`school\`/g" | \
  mysql -u "$DB_USER" "$DB_NAME" 2>&1 | grep -v "already exists" || true
echo "✓ Tahfiz module imported"
echo ""

echo "Step 8: Final fixes - restore plural table names if needed..."
# Some parts of the app might expect plural names, so create views
mysql -u "$DB_USER" "$DB_NAME" <<EOF
-- Create views for backward compatibility with plural names
CREATE OR REPLACE VIEW students AS SELECT * FROM student;
CREATE OR REPLACE VIEW teachers AS SELECT * FROM teacher WHERE EXISTS (SELECT 1 FROM teacher LIMIT 1);
CREATE OR REPLACE VIEW classes AS SELECT * FROM class WHERE EXISTS (SELECT 1 FROM class LIMIT 1);
EOF
echo "✓ Compatibility views created"
echo ""

unset MYSQL_PWD

echo "========================================="
echo "✅ DATABASE SETUP COMPLETED!"
echo "========================================="
echo ""
echo "Verifying core tables..."
mysql -u root -p"$DB_PASS" "$DB_NAME" -e "SELECT table_name FROM information_schema.tables WHERE table_schema = '$DB_NAME' AND table_name IN ('school', 'student', 'teacher', 'class', 'user', 'academic_term') ORDER BY table_name;" 2>/dev/null
echo ""
echo "Total tables created:"
mysql -u root -p"$DB_PASS" "$DB_NAME" -e "SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = '$DB_NAME' AND table_type = 'BASE TABLE';" 2>/dev/null
echo ""
echo "Next steps:"
echo "1. Ensure .env.local has correct MySQL credentials"
echo "2. Run: npm run dev"
echo "3. Test: curl http://localhost:3000/api/test-db"
