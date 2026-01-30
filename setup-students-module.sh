#!/bin/bash

# Students Module Setup Script
# DRAIS v0.0.0300 - Complete Installation
# 
# This script initializes the Students Module with:
# 1. Database schema (tables, indexes, views)
# 2. Initial configuration
# 3. Verification

set -e

echo "================================"
echo "DRAIS Students Module Setup"
echo "================================"
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js 16+"
  exit 1
fi

echo "1️⃣  Setting up database schema..."
echo ""

# Run the schema migration
node scripts/students-module-schema.js

if [ $? -eq 0 ]; then
  echo "✅ Database schema created successfully"
else
  echo "❌ Database schema creation failed"
  exit 1
fi

echo ""
echo "2️⃣  Verifying installation..."
echo ""

# Verify tables exist by running a simple check
node -e "
const { getPool } = require('./src/lib/db/postgres.js');

(async () => {
  try {
    const pool = await getPool();
    const result = await pool.query(\`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('students', 'classes', 'student_admissions', 'student_promotions', 'student_discipline', 'student_suspensions', 'student_transactions', 'student_audit_log', 'student_id_cards', 'import_logs')
      ORDER BY table_name;
    \`);
    
    console.log('✅ Found tables:');
    result.rows.forEach(row => {
      console.log('   ✓ ' + row.table_name);
    });
    
    if (result.rows.length === 10) {
      console.log('');
      console.log('✅ All 10 required tables are created!');
      process.exit(0);
    } else {
      console.log('');
      console.log('⚠️  Only ' + result.rows.length + ' of 10 tables found');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    process.exit(1);
  }
})();
" || exit 1

echo ""
echo "3️⃣  Installation Summary"
echo ""
echo "✅ Students Module Successfully Initialized!"
echo ""
echo "Database Tables Created:"
echo "  • students (core student records)"
echo "  • classes (academic classes)"
echo "  • student_admissions (admission tracking)"
echo "  • student_promotions (promotion history)"
echo "  • student_discipline (disciplinary records)"
echo "  • student_suspensions (suspension tracking)"
echo "  • student_transactions (pocket money ledger)"
echo "  • student_audit_log (audit trail)"
echo "  • student_id_cards (ID card records)"
echo "  • import_logs (bulk import tracking)"
echo ""
echo "API Endpoints Ready:"
echo "  • POST   /api/modules/students/admissions (create)"
echo "  • GET    /api/modules/students/admissions (list)"
echo "  • GET    /api/modules/students/admissions/[id] (view)"
echo "  • PATCH  /api/modules/students/admissions/[id] (edit)"
echo "  • DELETE /api/modules/students/admissions/[id] (soft delete)"
echo "  • POST   /api/modules/students/pocket-money (record transaction)"
echo "  • POST   /api/modules/students/promote (promote students)"
echo "  • POST   /api/modules/students/id-cards (generate ID)"
echo "  • POST   /api/modules/students/discipline (record incident)"
echo "  • POST   /api/modules/students/suspended (suspend student)"
echo "  • POST   /api/modules/students/alumni (mark as alumni)"
echo "  • POST   /api/modules/students/import (bulk upload)"
echo ""
echo "📖 Read Documentation:"
echo "  cat STUDENTS_MODULE_README.md"
echo ""
echo "🚀 Next Steps:"
echo "  1. Navigate to /students in the dashboard"
echo "  2. Start by admitting your first student"
echo "  3. Explore each module tab"
echo ""
echo "================================"
