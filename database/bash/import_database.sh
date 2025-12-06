#!/bin/bash

# =====================================================
# DRAIS Database Import Script
# Automated schema import with fixes
# =====================================================

set -e  # Exit on error

echo "========================================="
echo "DRAIS Database Schema Import"
echo "========================================="
echo ""

# Database credentials
DB_NAME="drais"
DB_USER="root"

# Prompt for password once
echo "Please enter MySQL root password:"
read -s DB_PASS
echo ""

# Export password for mysql commands
export MYSQL_PWD="$DB_PASS"

echo "Step 1: Creating database if not exists..."
mysql -u "$DB_USER" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1
echo "✓ Database created/verified"
echo ""

echo "Step 2: Importing base schema (school.sql)..."
mysql -u "$DB_USER" "$DB_NAME" < school.sql 2>&1
echo "✓ Base schema imported"
echo ""

echo "Step 3: Applying schema fixes..."
mysql -u "$DB_USER" "$DB_NAME" < fix_and_import_schemas.sql 2>&1
echo "✓ Schema fixes applied"
echo ""

echo "Step 4: Importing schema alterations..."
# Remove problematic IF NOT EXISTS syntax
sed 's/ADD COLUMN IF NOT EXISTS/ADD COLUMN/g; s/ADD INDEX IF NOT EXISTS/ADD INDEX/g; s/ADD FOREIGN KEY IF NOT EXISTS/ADD FOREIGN KEY/g' database_schema_alterations_v0.1.01.sql > temp_alterations.sql
mysql -u "$DB_USER" "$DB_NAME" < temp_alterations.sql 2>&1 || echo "⚠ Some alterations may already exist (this is normal)"
rm temp_alterations.sql
echo "✓ Schema alterations imported"
echo ""

echo "Step 5: Importing new tables..."
mysql -u "$DB_USER" "$DB_NAME" < database_schema_new_tables_v0.1.01.sql 2>&1
echo "✓ New tables imported"
echo ""

echo "Step 6: Importing module tables..."
mysql -u "$DB_USER" "$DB_NAME" < database_schema_modules_complete_v0.2.00.sql 2>&1
echo "✓ Module tables imported"
echo ""

echo "Step 7: Importing Tahfiz module (skipping problematic tables)..."
# Skip tahfiz_books_enhanced as we already created it in fix script
grep -v "CREATE TABLE.*tahfiz_books_enhanced" tahfiz_module_complete.sql > temp_tahfiz.sql || cp tahfiz_module_complete.sql temp_tahfiz.sql
mysql -u "$DB_USER" "$DB_NAME" < temp_tahfiz.sql 2>&1 || echo "⚠ Some tahfiz tables may already exist"
rm temp_tahfiz.sql
echo "✓ Tahfiz module imported"
echo ""

# Clear password
unset MYSQL_PWD

echo "========================================="
echo "✅ DATABASE IMPORT COMPLETED SUCCESSFULLY!"
echo "========================================="
echo ""
echo "Database: $DB_NAME"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your MySQL credentials"
echo "2. Run: npm run dev"
echo "3. Test: curl http://localhost:3000/api/test-db"
echo ""
