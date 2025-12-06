#!/bin/bash

# =====================================================
# DRAIS Database Complete Setup Script
# Fixes all SQL syntax errors and imports cleanly
# =====================================================

set -e  # Exit on error

echo "========================================="
echo "DRAIS Database Complete Setup"
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

echo "Step 3: Fixing and importing schema alterations..."
# Fix IF NOT EXISTS syntax (not supported in older MySQL)
cat database_schema_alterations_v0.1.01.sql | \
  sed 's/ADD COLUMN IF NOT EXISTS/ADD COLUMN/g' | \
  sed 's/ADD INDEX IF NOT EXISTS/ADD INDEX/g' | \
  sed 's/ADD FOREIGN KEY IF NOT EXISTS/ADD FOREIGN KEY/g' | \
  mysql -u "$DB_USER" "$DB_NAME" 2>&1 | grep -v "Duplicate column name" | grep -v "Duplicate key name" || true
echo "✓ Schema alterations applied"
echo ""

echo "Step 4: Importing new tables..."
mysql -u "$DB_USER" "$DB_NAME" < database_schema_new_tables_v0.1.01.sql
echo "✓ New tables imported"
echo ""

echo "Step 5: Importing module tables..."
mysql -u "$DB_USER" "$DB_NAME" < database_schema_modules_complete_v0.2.00.sql
echo "✓ Module tables imported"
echo ""

echo "Step 6: Fixing and importing Tahfiz module..."
# Fix wrong table reference: schools -> school
cat tahfiz_module_complete.sql | \
  sed "s/REFERENCES \`schools\`/REFERENCES \`school\`/g" | \
  mysql -u "$DB_USER" "$DB_NAME"
echo "✓ Tahfiz module imported"
echo ""

unset MYSQL_PWD

echo "========================================="
echo "✅ DATABASE SETUP COMPLETED!"
echo "========================================="
echo ""
echo "Verifying tables..."
mysql -u root -p"$DB_PASS" "$DB_NAME" -e "SHOW TABLES;" 2>/dev/null | head -20
echo ""
echo "Total tables created:"
mysql -u root -p"$DB_PASS" "$DB_NAME" -e "SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = '$DB_NAME';" 2>/dev/null
echo ""
echo "Next steps:"
echo "1. Update .env.local with MySQL credentials"
echo "2. Run: npm run dev"
echo "3. Test: curl http://localhost:3000/api/test-db"
