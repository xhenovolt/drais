#!/bin/bash

echo "========================================="
echo "DUPLICATE TABLE ANALYSIS"
echo "========================================="
echo ""

# Check which files have these duplicate tables
for table in fee_payments fee_structures finance_categories ledger salary_payments student_fee_items tahfiz_attendance tahfiz_books tahfiz_evaluations tahfiz_group_members tahfiz_groups tahfiz_migration_log tahfiz_plans tahfiz_portions tahfiz_records; do
    echo "Table: $table"
    grep -l "CREATE TABLE.*\`$table\`" *.sql 2>/dev/null | while read file; do
        echo "  - Found in: $file"
    done
    echo ""
done

echo "========================================="
echo "RECOMMENDATION"
echo "========================================="
echo ""
echo "These tables exist in original.sql AND in module files."
echo "Solution: Remove them from original.sql OR remove from module files"
echo ""
echo "Suggested approach:"
echo "1. Keep original.sql as the BASE schema (like school.sql was)"
echo "2. Remove duplicates from module files (finance & tahfiz)"
echo "3. OR: Use original.sql as the complete schema and skip module files"
