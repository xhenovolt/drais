#!/bin/bash

echo "Removing duplicate tables from module files..."
echo ""

# Backup module files
cp database_schema_finance_module.sql database_schema_finance_module.sql.backup
cp tahfiz_module_complete.sql tahfiz_module_complete.sql.backup

# Remove finance tables from finance module (they exist in original.sql)
echo "Step 1: Removing finance tables from database_schema_finance_module.sql..."
for table in fee_payments fee_structures finance_categories ledger salary_payments student_fee_items; do
    echo "  - Removing $table"
    # Find and remove the entire CREATE TABLE block
    perl -i -0pe "s/CREATE TABLE \`$table\`.*?\) ENGINE=InnoDB.*?;\n\n//s" database_schema_finance_module.sql
done

# Remove tahfiz tables from tahfiz module that exist in original.sql
echo ""
echo "Step 2: Removing duplicate tahfiz tables from tahfiz_module_complete.sql..."
for table in tahfiz_attendance tahfiz_books tahfiz_evaluations tahfiz_group_members tahfiz_groups tahfiz_migration_log tahfiz_plans tahfiz_portions tahfiz_records; do
    echo "  - Removing $table"
    perl -i -0pe "s/CREATE TABLE \`$table\`.*?\) ENGINE=InnoDB.*?;\n\n//s" tahfiz_module_complete.sql
done

echo ""
echo "✅ Duplicates removed!"
echo ""
echo "Verifying..."
grep -c "CREATE TABLE" database_schema_finance_module.sql | xargs echo "Finance module tables:"
grep -c "CREATE TABLE" tahfiz_module_complete.sql | xargs echo "Tahfiz module tables:"
