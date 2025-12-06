#!/bin/bash

# =====================================================
# DRAIS Schema Reorganization Script
# Moves tables to appropriate schema files
# =====================================================

cd /home/xhenvolt/projects/drais/database

echo "Starting schema reorganization..."
echo ""

# =====================================================
# Step 1: Extract tahfiz tables from school.sql
# =====================================================
echo "Step 1: Extracting tahfiz tables from school.sql..."

> tahfiz_from_school.sql
grep -n "CREATE TABLE \`tahfiz_" school.sql | while IFS=: read line_num rest; do
    table_name=$(echo "$rest" | awk -F'`' '{print $2}')
    echo "  - Extracting $table_name"
    
    # Find the end of this table
    end_line=$(awk -v start=$line_num 'NR>start && /^CREATE TABLE/ {print NR-1; exit}' school.sql)
    if [ -z "$end_line" ]; then
        end_line=$(wc -l < school.sql)
    fi
    
    sed -n "${line_num},${end_line}p" school.sql >> tahfiz_from_school.sql
    echo "" >> tahfiz_from_school.sql
done

# =====================================================
# Step 2: Extract finance tables from school.sql
# =====================================================
echo "Step 2: Extracting finance tables from school.sql..."

> finance_from_school.sql
for table in fee_payments fee_structures finance_categories ledger salary_payments student_fee_items; do
    echo "  - Extracting $table"
    line_num=$(grep -n "CREATE TABLE \`$table\`" school.sql | cut -d: -f1)
    if [ -n "$line_num" ]; then
        end_line=$(awk -v start=$line_num 'NR>start && /^CREATE TABLE/ {print NR-1; exit}' school.sql)
        if [ -z "$end_line" ]; then
            end_line=$(wc -l < school.sql)
        fi
        sed -n "${line_num},${end_line}p" school.sql >> finance_from_school.sql
        echo "" >> finance_from_school.sql
    fi
done

# =====================================================
# Step 3: Remove extracted tables from school.sql
# =====================================================
echo "Step 3: Creating cleaned school.sql..."

cp school.sql school_original_backup.sql

# Remove tahfiz tables
for table in tahfiz_attendance tahfiz_books tahfiz_evaluations tahfiz_groups tahfiz_group_members tahfiz_migration_log tahfiz_plans tahfiz_portions tahfiz_records; do
    line_num=$(grep -n "CREATE TABLE \`$table\`" school.sql | cut -d: -f1)
    if [ -n "$line_num" ]; then
        end_line=$(awk -v start=$line_num 'NR>start && /^CREATE TABLE/ {print NR-1; exit}' school.sql)
        if [ -z "$end_line" ]; then
            end_line=$(wc -l < school.sql)
        fi
        sed -i "${line_num},${end_line}d" school.sql
    fi
done

# Remove finance tables  
for table in fee_payments fee_structures finance_categories ledger salary_payments student_fee_items; do
    line_num=$(grep -n "CREATE TABLE \`$table\`" school.sql | cut -d: -f1)
    if [ -n "$line_num" ]; then
        end_line=$(awk -v start=$line_num 'NR>start && /^CREATE TABLE/ {print NR-1; exit}' school.sql)
        if [ -z "$end_line" ]; then
            end_line=$(wc -l < school.sql)
        fi
        sed -i "${line_num},${end_line}d" school.sql
    fi
done

# =====================================================
# Step 4: Append to tahfiz_module_complete.sql
# =====================================================
echo "Step 4: Appending extracted tahfiz tables to tahfiz_module_complete.sql..."

cat >> tahfiz_module_complete.sql << 'EOFTAHFIZ'

-- =========================================
-- TAHFIZ TABLES FROM SCHOOL.SQL
-- Moved for better organization
-- =========================================

EOFTAHFIZ

cat tahfiz_from_school.sql >> tahfiz_module_complete.sql

# =====================================================
# Step 5: Create finance schema file
# =====================================================
echo "Step 5: Creating finance schema file..."

cat > database_schema_finance_module.sql << 'EOFFINANCE'
-- =====================================================
-- DRAIS Finance Module Schema
-- Version: 1.0
-- Date: December 6, 2025
-- =====================================================

USE `drais`;

SET FOREIGN_KEY_CHECKS = 0;

-- =========================================
-- FINANCE TABLES FROM SCHOOL.SQL
-- =========================================

EOFFINANCE

cat finance_from_school.sql >> database_schema_finance_module.sql

echo "SET FOREIGN_KEY_CHECKS = 1;" >> database_schema_finance_module.sql

# =====================================================
# Step 6: Fix alterations file
# =====================================================
echo "Step 6: Analyzing alterations file..."

# Check if 'schools' table exists in school.sql
if grep -q "CREATE TABLE \`schools\`" school.sql; then
    echo "  - 'schools' table found in school.sql - will convert to ALTER"
else
    echo "  - 'schools' table not in school.sql - keeping as CREATE"
fi

# Cleanup
rm -f tahfiz_from_school.sql finance_from_school.sql extract_tahfiz.sh

echo ""
echo "========================================="
echo "✅ Schema Reorganization Complete!"
echo "========================================="
echo ""
echo "Files created/modified:"
echo "  - school.sql (cleaned - tahfiz & finance tables removed)"
echo "  - school_original_backup.sql (original backup)"
echo "  - tahfiz_module_complete.sql (tahfiz tables appended)"
echo "  - database_schema_finance_module.sql (NEW - finance tables)"
echo ""
echo "Summary:"
grep -c "CREATE TABLE" school.sql | xargs echo "  - school.sql tables:"
grep -c "CREATE TABLE" tahfiz_module_complete.sql | xargs echo "  - tahfiz_module_complete.sql tables:"
grep -c "CREATE TABLE" database_schema_finance_module.sql | xargs echo "  - database_schema_finance_module.sql tables:"
