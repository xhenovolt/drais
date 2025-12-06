#!/bin/bash

# =====================================================
# DRAIS Complete Database Import Script
# Imports all schema files in the correct order
# =====================================================

DB_NAME="drais"
DB_USER="root"

echo "========================================="
echo "DRAIS Database Import Script"
echo "========================================="
echo ""

# Check if running with correct directory
if [ ! -f "original.sql" ]; then
    echo "❌ Error: Run this script from the database directory"
    echo "   cd /home/xhenvolt/projects/drais/database"
    exit 1
fi

echo "This will:"
echo "  1. Drop existing '$DB_NAME' database (if exists)"
echo "  2. Create fresh '$DB_NAME' database"
echo "  3. Import all schemas in correct order"
echo "  4. Verify final table count"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Import cancelled."
    exit 0
fi

echo ""
echo "Enter MySQL root password when prompted..."
echo ""

# =====================================================
# Step 1: Drop and recreate database
# =====================================================
echo "Step 1/7: Recreating database..."
mysql -u "$DB_USER" -p -e "DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if [ $? -eq 0 ]; then
    echo "✅ Database recreated successfully"
else
    echo "❌ Failed to recreate database"
    exit 1
fi
echo ""

# =====================================================
# Step 2: Import base schema (original.sql)
# =====================================================
echo "Step 2/7: Importing base schema (original.sql - 77 tables)..."
mysql -u "$DB_USER" -p "$DB_NAME" < original.sql
if [ $? -eq 0 ]; then
    echo "✅ Base schema imported"
else
    echo "❌ Failed to import base schema"
    exit 1
fi
echo ""

# =====================================================
# Step 3: Apply alterations + new tables
# =====================================================
echo "Step 3/7: Applying alterations (adds columns + 9 new tables)..."
mysql -u "$DB_USER" -p "$DB_NAME" < database_schema_alterations_v0.1.02_FIXED.sql
if [ $? -eq 0 ]; then
    echo "✅ Alterations applied"
else
    echo "❌ Failed to apply alterations"
    exit 1
fi
echo ""

# =====================================================
# Step 4: Import additional tables
# =====================================================
echo "Step 4/7: Importing additional tables (25 tables)..."
mysql -u "$DB_USER" -p "$DB_NAME" < database_schema_new_tables_v0.1.01.sql
if [ $? -eq 0 ]; then
    echo "✅ Additional tables imported"
else
    echo "❌ Failed to import additional tables"
    exit 1
fi
echo ""

# =====================================================
# Step 5: Import module tables
# =====================================================
echo "Step 5/7: Importing module tables (26 tables)..."
mysql -u "$DB_USER" -p "$DB_NAME" < database_schema_modules_complete_v0.2.00.sql
if [ $? -eq 0 ]; then
    echo "✅ Module tables imported"
else
    echo "❌ Failed to import module tables"
    exit 1
fi
echo ""

# =====================================================
# Step 6: Import tahfiz enhanced tables
# =====================================================
echo "Step 6/7: Importing Tahfiz enhanced tables (25 tables)..."
mysql -u "$DB_USER" -p "$DB_NAME" < tahfiz_module_complete.sql
if [ $? -eq 0 ]; then
    echo "✅ Tahfiz enhanced tables imported"
else
    echo "❌ Failed to import Tahfiz tables"
    exit 1
fi
echo ""

# =====================================================
# Step 7: Verify table count
# =====================================================
echo "Step 7/7: Verifying import..."
TABLE_COUNT=$(mysql -u "$DB_USER" -p "$DB_NAME" -e "SHOW TABLES;" -s --skip-column-names | wc -l)
echo "Total tables created: $TABLE_COUNT"
echo ""

if [ "$TABLE_COUNT" -eq 162 ]; then
    echo "========================================="
    echo "✅ IMPORT SUCCESSFUL!"
    echo "========================================="
    echo "Database: $DB_NAME"
    echo "Tables: $TABLE_COUNT/162"
    echo ""
    echo "Next steps:"
    echo "  1. Configure .env file with database credentials"
    echo "  2. Test connection: curl http://localhost:3000/api/test-db"
    echo "  3. Start developing: npm run dev"
else
    echo "========================================="
    echo "⚠️ WARNING: Unexpected table count"
    echo "========================================="
    echo "Expected: 162 tables"
    echo "Got: $TABLE_COUNT tables"
    echo ""
    echo "Check for errors in the import process above."
fi
echo ""
