# DRAIS Database Quick Reference

## Schema Import Status: ✅ READY

### Validation Summary (as of Dec 6, 2025)

| Check | Status | Details |
|-------|--------|---------|
| Duplicate Tables | ✅ PASS | No duplicates found across all files |
| ALTER Statements | ✅ PASS | All 6 ALTER statements reference existing tables |
| Syntax Errors | ✅ PASS | All trailing/missing commas fixed |
| Foreign Keys | ✅ REMOVED | All FOREIGN KEY constraints removed |
| Secondary Indexes | ✅ REMOVED | Only PRIMARY KEYs remain |
| Total Tables | ✅ 162 | Across 6 schema files |

---

## Quick Import

```bash
cd /home/xhenvolt/projects/drais/database
./import_all_schemas.sh
```

---

## Table Distribution

```
Original Schema (77 tables)
├── Schools & Admin (10): schools, branches, academic_years, etc.
├── Users (4): users, staff, students, parents
├── Academic (15): classes, subjects, exams, grades, etc.
├── Finance Basic (6): fee_structures, fee_payments, ledger, etc.
├── Tahfiz Basic (8): tahfiz_groups, tahfiz_attendance, etc.
└── System (34): audit_log, notifications, sms_log, etc.

Alterations (9 new tables + column additions)
├── RBAC: user, role, permission, user_role
├── Academic: academic_term, section, class_subject
└── System: system_setting, audit_log

New Tables (25 tables)
├── Attendance (2): attendance, attendance_summary
├── Student Mgmt (3): promotions, transfers, discipline
├── Academic (4): homework, assignments (with submissions)
├── Scheduling (3): timetable, leave requests, events
├── Communication (3): announcements, meetings, parent meetings
├── Facilities (4): rooms, hostels (with allocations)
├── Transport (4): vehicles, routes, stops, student assignments
└── HR (3): staff attendance, leave types, payroll

Module Tables (26 tables)
├── Finance Extended (5): categories, transactions, expenses, income
├── Library (4): books, categories, issues, members
├── Inventory (3): items, categories, transactions
├── Health (2): records, checkups
├── Canteen (3): items, orders, menus
├── Sports (4): sports, teams, events, participation
├── Alumni (2): alumni, events
└── Certificates (2): templates, issues

Tahfiz Enhanced (25 tables)
├── Book Management (5): types, enhanced books, structures, sections
├── Progress Tracking (5): sessions, revisions, progress, history
├── Evaluations (4): categories, criteria, rubrics, comments
├── Analytics (3): cache, reports, retention stats
├── Notifications (3): preferences, queue, templates
├── Settings (3): settings, calendar sync, health checks
└── Import/Export (2): export queue, import logs
```

---

## Import Order (MUST FOLLOW)

```
1. original.sql                               (Base - 77 tables)
   ↓ Creates: schools, students, staff, classes, etc.
   
2. database_schema_alterations_v0.1.02_FIXED  (Enhances + 9 tables)
   ↓ Adds: school_id, user_id columns + RBAC tables
   
3. database_schema_new_tables_v0.1.01         (Additional - 25 tables)
   ↓ Adds: attendance, homework, timetables, etc.
   
4. database_schema_modules_complete_v0.2.00   (Modules - 26 tables)
   ↓ Adds: library, inventory, health, sports, etc.
   
5. tahfiz_module_complete.sql                 (Enhanced - 25 tables)
   ✓ Adds: Advanced Quran memorization features
```

---

## Files to Skip

- ❌ `database_schema_finance_module.sql` - Empty (duplicates removed)
- ❌ `school.sql` - Deprecated (use original.sql instead)
- ❌ All `.backup` files - For rollback only

---

## Verification Commands

```bash
# Check for duplicates
cd database && ./validate_schemas.sh

# Count tables after import
mysql -u root -p drais -e "SHOW TABLES;" | wc -l
# Expected: 162

# List all tables
mysql -u root -p drais -e "SHOW TABLES;"

# Check specific table
mysql -u root -p drais -e "DESCRIBE schools;"
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Table 'teachers' doesn't exist" | ✅ Fixed - Changed to 'staff' in alterations file |
| Duplicate table errors | ✅ Fixed - Removed duplicates from module files |
| Foreign key errors | ✅ Fixed - All foreign keys removed |
| Syntax errors (trailing commas) | ✅ Fixed - All commas corrected in tahfiz file |
| Wrong import order | Use `import_all_schemas.sh` for correct order |

---

## Next Steps After Import

1. **Configure .env:**
   ```bash
   cp .env.example .env
   # Set DB_TYPE=mysql
   # Set MYSQL_* credentials
   ```

2. **Test Connection:**
   ```bash
   npm run dev
   curl http://localhost:3000/api/test-db
   ```

3. **Test Authentication:**
   ```bash
   # Register user
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","email":"admin@drais.com","password":"Admin123!"}'
   
   # Login
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@drais.com","password":"Admin123!"}'
   ```

---

## Database Schema Version

**Version:** v0.2.00 (Final)  
**Last Updated:** December 6, 2025  
**Status:** Production Ready ✅

**Schema Features:**
- ✅ Multi-tenancy support (school_id on all tables)
- ✅ RBAC (Role-Based Access Control)
- ✅ Soft deletes (deleted_at timestamps)
- ✅ Audit trails (created_at, updated_at, user_id)
- ✅ No foreign key constraints
- ✅ Primary keys only (no secondary indexes)

---

## File Sizes

```
original.sql                                  37 KB
database_schema_alterations_v0.1.02_FIXED     14 KB
database_schema_new_tables_v0.1.01            22 KB
database_schema_modules_complete_v0.2.00      24 KB
tahfiz_module_complete.sql                    30 KB
database_schema_finance_module.sql           756 B (empty)
-------------------------------------------------------
TOTAL                                        127 KB
```

---

## Support

- 📖 Full documentation: `/database/SCHEMA_SUMMARY.md`
- 🚀 Backend setup: `/BACKEND_SETUP.md`
- 🔧 Validation: `./validate_schemas.sh`
- 📥 Import: `./import_all_schemas.sh`

---

**Ready to import? Run:**
```bash
cd /home/xhenvolt/projects/drais/database && ./import_all_schemas.sh
```
