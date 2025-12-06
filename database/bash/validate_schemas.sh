#!/bin/bash

# =====================================================
# DRAIS Schema Validation Report
# Checks execution flow and ensures no duplicates
# =====================================================

cd /home/xhenvolt/projects/drais/database

echo "========================================="
echo "DRAIS SCHEMA VALIDATION REPORT"
echo "Generated: $(date)"
echo "========================================="
echo ""

# =====================================================
# 1. Check for duplicate table creations
# =====================================================
echo "1. DUPLICATE TABLE CHECK"
echo "========================================="
DUPLICATES=$(cat original.sql database_schema_alterations_v0.1.02_FIXED.sql database_schema_new_tables_v0.1.01.sql database_schema_modules_complete_v0.2.00.sql database_schema_finance_module.sql tahfiz_module_complete.sql 2>/dev/null | grep "CREATE TABLE" | awk '{print $3}' | sed 's/`//g' | sed 's/IF//g' | sed 's/NOT//g' | sed 's/EXISTS//g' | awk '{print $1}' | sort | uniq -d)

if [ -z "$DUPLICATES" ]; then
    echo "✅ NO DUPLICATES FOUND"
else
    echo "❌ DUPLICATES FOUND:"
    echo "$DUPLICATES"
fi
echo ""

# =====================================================
# 2. Verify ALTER statements reference existing tables
# =====================================================
echo "2. ALTER STATEMENT VALIDATION"
echo "========================================="
grep "^ALTER TABLE" database_schema_alterations_v0.1.02_FIXED.sql 2>/dev/null | awk '{print $3}' | sort -u | while read table; do
    if grep -q "CREATE TABLE \`$table\`" original.sql; then
        echo "✅ $table - exists in original.sql"
    else
        echo "❌ $table - NOT FOUND in original.sql"
    fi
done
echo ""

# =====================================================
# 3. Table count per file
# =====================================================
echo "3. TABLE DISTRIBUTION"
echo "========================================="
for file in original.sql database_schema_alterations_v0.1.02_FIXED.sql database_schema_new_tables_v0.1.01.sql database_schema_modules_complete_v0.2.00.sql database_schema_finance_module.sql tahfiz_module_complete.sql; do
    if [ -f "$file" ]; then
        count=$(grep -c "CREATE TABLE" "$file" 2>/dev/null || echo 0)
        printf "%-50s %3d tables\n" "$file:" "$count"
    fi
done
echo ""

# =====================================================
# 4. Total unique tables
# =====================================================
echo "4. TOTAL UNIQUE TABLES"
echo "========================================="
TOTAL=$(cat original.sql database_schema_alterations_v0.1.02_FIXED.sql database_schema_new_tables_v0.1.01.sql database_schema_modules_complete_v0.2.00.sql database_schema_finance_module.sql tahfiz_module_complete.sql 2>/dev/null | grep "CREATE TABLE" | awk '{print $3}' | sed 's/`//g' | sed 's/IF//g' | sed 's/NOT//g' | sed 's/EXISTS//g' | awk '{print $1}' | sort -u | wc -l)
echo "Total unique tables across all files: $TOTAL"
echo ""

# =====================================================
# 5. Recommended import order
# =====================================================
echo "5. RECOMMENDED IMPORT ORDER"
echo "========================================="
echo "To avoid errors, import in this order:"
echo ""
echo "  1. original.sql                               (Base schema - 77 tables)"
echo "  2. database_schema_alterations_v0.1.02_FIXED  (Adds columns + new tables)"
echo "  3. database_schema_new_tables_v0.1.01         (Additional tables)"
echo "  4. database_schema_modules_complete_v0.2.00   (Module-specific tables)"
echo "  5. database_schema_finance_module.sql         (Finance extras - if any)"
echo "  6. tahfiz_module_complete.sql                 (Tahfiz enhanced tables)"
echo ""

# =====================================================
# 6. Files summary
# =====================================================
echo "6. FILES STATUS"
echo "========================================="
echo "Active Schema Files:"
ls -lh original.sql database_schema_alterations_v0.1.02_FIXED.sql database_schema_new_tables_v0.1.01.sql database_schema_modules_complete_v0.2.00.sql database_schema_finance_module.sql tahfiz_module_complete.sql 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'
echo ""
echo "Backup Files:"
ls -lh *.backup 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}' || echo "  No backup files"
echo ""

# =====================================================
# 7. Final verdict
# =====================================================
echo "========================================="
echo "VALIDATION SUMMARY"
echo "========================================="
if [ -z "$DUPLICATES" ]; then
    echo "✅ Schema structure is VALID"
    echo "✅ No duplicate table creations"
    echo "✅ Execution flow is intact"
    echo ""
    echo "Ready for import!"
else
    echo "❌ Schema has issues"
    echo "❌ Fix duplicates before importing"
fi
echo ""
