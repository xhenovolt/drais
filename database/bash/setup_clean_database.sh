#!/bin/bash

# =====================================================
# DRAIS Database Complete Setup - FINAL VERSION
# All schemas validated and tested
# Version: 2.0.0
# =====================================================

set -e

echo "========================================="
echo "DRAIS Database Setup v2.0.0"
echo "Clean Schema Import"
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
mysql -u "$DB_USER" -e "DROP DATABASE IF EXISTS $DB_NAME;" 2>&1
mysql -u "$DB_USER" -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1
echo "✓ Database created"
echo ""

echo "Step 2: Importing base schema (core tables)..."
mysql -u "$DB_USER" "$DB_NAME" < database/00_base_schema.sql 2>&1
echo "✓ Base schema imported (school, user, student, teacher, class, subject)"
echo ""

echo "Step 3: Importing attendance & exams module..."
mysql -u "$DB_USER" "$DB_NAME" < database/01_attendance_exams.sql 2>&1
echo "✓ Attendance & exams imported"
echo ""

echo "Step 4: Importing fees & finance module..."
mysql -u "$DB_USER" "$DB_NAME" < database/02_fees_finance.sql 2>&1
echo "✓ Fees & finance imported"
echo ""

echo "Step 5: Importing library, transport & events..."
mysql -u "$DB_USER" "$DB_NAME" < database/03_library_transport_events.sql 2>&1
echo "✓ Library, transport & events imported"
echo ""

unset MYSQL_PWD

echo "========================================="
echo "✅ DATABASE SETUP COMPLETED!"
echo "========================================="
echo ""
echo "Verifying tables..."
mysql -u root -p"$DB_PASS" "$DB_NAME" -e "
SELECT 
    table_name,
    table_rows,
    ROUND((data_length + index_length) / 1024, 2) AS 'Size (KB)'
FROM information_schema.tables
WHERE table_schema = '$DB_NAME'
ORDER BY table_name
LIMIT 30;" 2>/dev/null

echo ""
echo "Total tables created:"
mysql -u root -p"$DB_PASS" "$DB_NAME" -e "
SELECT COUNT(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = '$DB_NAME' AND table_type = 'BASE TABLE';" 2>/dev/null

echo ""
echo "✅ All schemas imported successfully!"
echo ""
echo "Next steps:"
echo "1. Verify .env.local has correct credentials:"
echo "   DB_TYPE=mysql"
echo "   MYSQL_DATABASE=drais"
echo "   MYSQL_PASSWORD=your_password"
echo ""
echo "2. Start server: npm run dev"
echo "3. Test connection: curl http://localhost:3000/api/test-db"
echo "4. Register user: curl -X POST http://localhost:3000/api/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"admin@test.com\",\"password\":\"Test123!\",\"first_name\":\"Admin\",\"last_name\":\"User\",\"role\":\"school_admin\"}'"
echo ""
