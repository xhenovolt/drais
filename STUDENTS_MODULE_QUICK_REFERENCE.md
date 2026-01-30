# DRAIS Students Module - Quick Reference

## 🎯 Module Overview

| Module | Purpose | Key Features |
|--------|---------|--------------|
| **Admissions** | Manage active enrolled students | Create, list, edit, soft delete with unique admission numbers |
| **ID Cards** | Generate student identification | Card numbers, photos, expiry dates, printable |
| **Pocket Money** | Track student wallet | Credit/debit transactions, balance auto-calc, prevent negative |
| **Promote Students** | Move between classes/years | Individual or bulk, promotion history, eligibility check |
| **Alumni** | Graduated/exited students | Move to alumni status, read-only, graduation dates |
| **Discipline** | Record disciplinary cases | Incident types, descriptions, severity, actions (NOT auto-suspend) |
| **Suspended** | Manage temporary suspension | Reasons, dates, auto-reactivate, suspension history |
| **Import Students** | Bulk CSV/Excel upload | Validation, duplicates, preview, error reporting |

---

## 📡 API Quick Links

### Base Path: `/api/modules/students/`

```
Admissions:
  GET    /admissions                 - List students (paginated)
  POST   /admissions                 - Create student
  GET    /admissions/[id]            - Get student details
  PATCH  /admissions/[id]            - Edit student
  DELETE /admissions/[id]            - Soft delete

Pocket Money:
  GET    /pocket-money?student_id=X  - List transactions
  POST   /pocket-money               - Record transaction

ID Cards:
  GET    /id-cards                   - List cards
  POST   /id-cards                   - Generate card

Promote:
  GET    /promote?class_id=X         - Get eligible
  POST   /promote                    - Promote students

Alumni:
  GET    /alumni                     - List alumni
  POST   /alumni                     - Mark as alumni

Discipline:
  GET    /discipline?student_id=X    - List incidents
  POST   /discipline                 - Record incident

Suspended:
  GET    /suspended                  - List suspensions
  POST   /suspended                  - Suspend student
  PATCH  /suspended/[id]             - Reactivate

Import:
  POST   /import                     - Upload CSV
```

---

## 🔧 Database Tables

```
students              - Core records
classes               - Classes/forms
student_admissions    - Admission tracking
student_promotions    - Promotion history
student_discipline    - Incidents
student_suspensions   - Suspensions
student_transactions  - Pocket money
student_audit_log     - Complete audit trail
student_id_cards      - ID cards
import_logs           - Import tracking
```

---

## 💡 Common Tasks

### Create Student
```bash
curl -X POST http://localhost:3000/api/modules/students/admissions \
  -H "Content-Type: application/json" \
  -H "Cookie: jeton_session=YOUR_SESSION" \
  -d '{
    "admission_number": "ADM-2024-001",
    "first_name": "John",
    "last_name": "Doe",
    "gender": "male",
    "date_of_birth": "2010-01-15",
    "guardian_name": "Jane Doe"
  }'
```

### Get Student
```bash
curl http://localhost:3000/api/modules/students/admissions/1 \
  -H "Cookie: jeton_session=YOUR_SESSION"
```

### List Students
```bash
curl "http://localhost:3000/api/modules/students/admissions?page=1&limit=20&search=john" \
  -H "Cookie: jeton_session=YOUR_SESSION"
```

### Record Pocket Money
```bash
curl -X POST http://localhost:3000/api/modules/students/pocket-money \
  -H "Content-Type: application/json" \
  -H "Cookie: jeton_session=YOUR_SESSION" \
  -d '{
    "student_id": 1,
    "transaction_type": "credit",
    "amount": 50000,
    "description": "Weekly allowance"
  }'
```

### Promote Student
```bash
curl -X POST http://localhost:3000/api/modules/students/promote \
  -H "Content-Type: application/json" \
  -H "Cookie: jeton_session=YOUR_SESSION" \
  -d '{
    "promotion_type": "individual",
    "from_class_id": 1,
    "to_class_id": 2,
    "student_id": 1,
    "academic_year": "2024/2025"
  }'
```

### Bulk Promote
```bash
curl -X POST http://localhost:3000/api/modules/students/promote \
  -H "Content-Type: application/json" \
  -H "Cookie: jeton_session=YOUR_SESSION" \
  -d '{
    "promotion_type": "bulk",
    "from_class_id": 1,
    "to_class_id": 2,
    "student_ids": [1, 2, 3, 4, 5],
    "academic_year": "2024/2025"
  }'
```

### Mark as Alumni
```bash
curl -X POST http://localhost:3000/api/modules/students/alumni \
  -H "Content-Type: application/json" \
  -H "Cookie: jeton_session=YOUR_SESSION" \
  -d '{
    "student_id": 1,
    "exit_status": "graduated",
    "graduation_date": "2024-06-15"
  }'
```

### Generate ID Card
```bash
curl -X POST http://localhost:3000/api/modules/students/id-cards \
  -H "Content-Type: application/json" \
  -H "Cookie: jeton_session=YOUR_SESSION" \
  -d '{
    "student_id": 1,
    "photo_url": "https://example.com/photo.jpg",
    "expiry_years": 1
  }'
```

### Record Discipline
```bash
curl -X POST http://localhost:3000/api/modules/students/discipline \
  -H "Content-Type: application/json" \
  -H "Cookie: jeton_session=YOUR_SESSION" \
  -d '{
    "student_id": 1,
    "incident_type": "Late Arrival",
    "description": "Student arrived 30 minutes late",
    "incident_date": "2024-01-25",
    "severity": "minor"
  }'
```

### Suspend Student
```bash
curl -X POST http://localhost:3000/api/modules/students/suspended \
  -H "Content-Type: application/json" \
  -H "Cookie: jeton_session=YOUR_SESSION" \
  -d '{
    "student_id": 1,
    "reason": "Repeated misconduct",
    "start_date": "2024-01-25",
    "end_date": "2024-02-01"
  }'
```

### Import Students (CSV)
```bash
curl -X POST http://localhost:3000/api/modules/students/import \
  -H "Cookie: jeton_session=YOUR_SESSION" \
  -F "file=@students.csv" \
  -F "action=preview"
```

---

## ✅ Response Examples

### Success (201)
```json
{
  "success": true,
  "message": "Student admitted successfully",
  "data": {
    "id": 1,
    "admission_number": "ADM-2024-001",
    "first_name": "John",
    "last_name": "Doe",
    "status": "active",
    "enrollment_date": "2024-01-25"
  }
}
```

### List (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "admission_number": "ADM-2024-001",
      "first_name": "John",
      "last_name": "Doe",
      "class_name": "Grade 3",
      "status": "active",
      "enrollment_date": "2024-01-25"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### Error (400)
```json
{
  "error": "admission_number is required"
}
```

### Validation (409)
```json
{
  "error": "Admission number already exists for this school"
}
```

---

## 🔐 Authentication

All endpoints require:
1. **Session Cookie**: `jeton_session`
2. **School Context**: User must have school_id
3. **Valid Session**: Session must not be expired

```javascript
// In browsers, cookies are sent automatically
const res = await fetch('/api/modules/students/admissions');

// In Node.js, include the header
const res = await fetch('/api/modules/students/admissions', {
  headers: {
    'Cookie': 'jeton_session=YOUR_SESSION_ID'
  }
});
```

---

## 📊 Query Parameters

### Pagination
```
?page=1           # Page number (default: 1)
?limit=20         # Results per page (default: 20)
```

### Filtering
```
?search=john      # Search by name or admission number
?status=active    # Filter by status (active|alumni|expelled)
?class_id=1       # Filter by class
?student_id=1     # Filter by student
```

### Sorting
```
?orderBy=name     # Sort field
?order=ASC|DESC   # Sort direction
```

---

## 🎯 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST) |
| 207 | Partial Success (some rows failed) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing session) |
| 404 | Not Found (resource doesn't exist) |
| 409 | Conflict (duplicate admission number) |
| 500 | Server Error |

---

## 📋 Field Validation

### Student Creation
```javascript
{
  admission_number: String,  // Required, unique per school
  first_name: String,        // Required
  last_name: String,         // Required
  middle_name: String,       // Optional
  gender: String,            // Optional (male|female|other)
  date_of_birth: Date,       // Optional
  class_id: Number,          // Optional
  stream_id: Number,         // Optional
  guardian_name: String,     // Optional
  guardian_phone: String,    // Optional
  guardian_email: String,    // Optional
  address: String            // Optional
}
```

### Pocket Money Transaction
```javascript
{
  student_id: Number,        // Required
  transaction_type: String,  // Required (credit|debit)
  amount: Number,            // Required, positive
  description: String,       // Optional
  reference_number: String,  // Optional
  allow_negative: Boolean    // Optional (default: false)
}
```

---

## 🚀 Installation

```bash
# 1. Create schema
node scripts/students-module-schema.js

# 2. Verify tables
psql $DATABASE_URL << SQL
SELECT table_name FROM information_schema.tables 
WHERE table_name LIKE 'student_%' OR table_name = 'students'
ORDER BY table_name;
SQL

# 3. Run tests
node test-students-module.mjs

# 4. Start server
npm run dev
```

---

## 📚 Files

| File | Purpose |
|------|---------|
| STUDENTS_MODULE_README.md | Full documentation |
| STUDENTS_MODULE_IMPLEMENTATION.md | Implementation summary |
| scripts/students-module-schema.js | Database migration |
| src/app/api/modules/students/* | API routes |
| src/lib/services/students.service.js | Business logic |
| src/app/students/page.js | Frontend page |
| test-students-module.mjs | Test suite |
| setup-students-module.sh | Setup script |

---

## 🎓 Learning Resources

- **API Docs**: STUDENTS_MODULE_README.md
- **Implementation**: STUDENTS_MODULE_IMPLEMENTATION.md
- **Database**: Run `\dt student*` in psql
- **Tests**: cat test-students-module.mjs
- **Examples**: Check curl commands above

---

## ⚡ Tips & Tricks

1. **Always include school_id** - All queries auto-filter by school
2. **Use soft deletes** - Records are never hard-deleted
3. **Check audit_log** - See what changed and when
4. **Prevent negatives** - Set allow_negative for pocket money
5. **Validate imports** - Preview before importing
6. **Promote only active** - Alumni/suspended cannot be promoted
7. **Session required** - Always include jeton_session cookie
8. **Pagination saves data** - Always use page/limit for lists

---

**Version**: DRAIS v0.0.0300  
**Last Updated**: January 2026  
**Status**: Production Ready ✅
