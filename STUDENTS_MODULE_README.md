# Students Module - Complete Implementation Guide

## Overview

The Students Module is a production-grade student lifecycle management system for DRAIS. It provides comprehensive tools for managing students from admission through alumni status, including:

- **Admissions**: Create, list, edit, soft delete student records
- **ID Cards**: Generate and manage student identification cards
- **Pocket Money**: Track student wallet transactions (credit/debit)
- **Promotions**: Move students between classes/academic levels
- **Alumni**: Manage graduated or exited students
- **Discipline**: Record and track disciplinary incidents
- **Suspensions**: Manage temporary student suspensions
- **Import**: Bulk upload students via CSV/Excel

## Core Principles

### 1. **School-Scoped Data**
- Every record includes `school_id` to prevent cross-school data leakage
- No query succeeds without proper school context
- All APIs validate school ownership

### 2. **Session-Based Authentication**
- Uses existing `jeton_session` cookie authentication
- No JWT tokens
- Session validation happens in API routes via `requireApiAuthFromCookies()`

### 3. **Production-Grade Error Handling**
- All errors return appropriate HTTP status codes
- Validation errors are explicit
- Transaction rollback on failures
- Comprehensive audit logging

### 4. **No Demo/Seeded Data**
- Pure real data only
- No placeholder records
- Empty state UX guides users to create real records

### 5. **Soft Deletes**
- No hard deletes - records are marked with `deleted_at` timestamp
- Allows historical tracking and data recovery
- Filtering automatically excludes deleted records

## Database Schema

### Core Tables

#### `students` (Main Table)
```sql
id BIGSERIAL PRIMARY KEY
school_id BIGINT (FK) - School ownership
admission_number VARCHAR(100) - Unique per school
first_name VARCHAR(100)
middle_name VARCHAR(100) - Optional
last_name VARCHAR(100)
gender VARCHAR(20)
date_of_birth DATE
class_id BIGINT (FK) - Current class
stream_id BIGINT (FK) - Stream/section
status VARCHAR(50) - active|suspended|alumni|expired|graduated
enrollment_date DATE
guardian_name VARCHAR(255)
guardian_phone VARCHAR(20)
guardian_email VARCHAR(100)
address TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
deleted_at TIMESTAMP (soft delete)
```

#### Supporting Tables

1. **classes** - Academic classes/forms
2. **student_admissions** - Admission tracking
3. **student_promotions** - Class promotion history
4. **student_discipline** - Disciplinary records
5. **student_suspensions** - Suspension records
6. **student_transactions** - Pocket money transactions
7. **student_audit_log** - Comprehensive audit trail
8. **student_id_cards** - ID card generation records
9. **import_logs** - Bulk import tracking

## API Endpoints

### Admissions Module

**GET /api/modules/students/admissions**
- List all students with pagination, search, filtering
- Query parameters: page, limit, search, status, class_id
- Returns: Array of students + pagination metadata

**POST /api/modules/students/admissions**
- Create new student admission
- Required: admission_number, first_name, last_name
- Returns: Created student object with ID

**GET /api/modules/students/admissions/[id]**
- Get single student with all related data
- Returns: Student object with pocket money balance, class info, etc.

**PATCH /api/modules/students/admissions/[id]**
- Edit student details
- Allowed fields: All except school_id, admission_number
- Returns: Updated student object

**DELETE /api/modules/students/admissions/[id]**
- Soft delete student (mark as left)
- Body: { reason: string }
- Returns: Success message

### Pocket Money Module

**GET /api/modules/students/pocket-money**
- Get all transactions
- Query parameters: student_id, page, limit
- Returns: Transaction array

**POST /api/modules/students/pocket-money**
- Record credit/debit transaction
- Body: { student_id, transaction_type, amount, description }
- Returns: Transaction with before/after balance

### ID Cards Module

**GET /api/modules/students/id-cards**
- List ID cards
- Query parameters: student_id, class_id, page, limit

**POST /api/modules/students/id-cards**
- Generate ID card for single student
- Body: { student_id, photo_url?, expiry_years? }
- Returns: Card number, dates, URLs

### Promotions Module

**GET /api/modules/students/promote**
- Get eligible students for promotion
- Query parameters: class_id (required)

**POST /api/modules/students/promote**
- Promote students individually or bulk
- Body: { promotion_type, from_class_id, to_class_id, student_ids[], academic_year }
- Returns: Promotion summary

### Alumni Module

**GET /api/modules/students/alumni**
- List alumni (graduated, expelled, exited)

**POST /api/modules/students/alumni**
- Move student to alumni status
- Body: { student_id, exit_status, graduation_date?, exit_reason? }

### Discipline Module

**GET /api/modules/students/discipline**
- List incidents
- Query parameters: student_id, page, limit

**POST /api/modules/students/discipline**
- Record disciplinary incident
- Body: { student_id, incident_type, description, incident_date, action_taken, severity }

### Suspensions Module

**GET /api/modules/students/suspended**
- List active suspensions

**POST /api/modules/students/suspended**
- Suspend student
- Body: { student_id, reason, start_date, end_date?, notes? }

**PATCH /api/modules/students/suspended/[id]**
- Reactivate student (end suspension)

### Import Module

**POST /api/modules/students/import**
- Process bulk CSV upload
- FormData: file, action (preview|import), mapping (JSON)
- Preview: Returns validation errors and sample data
- Import: Processes rows, returns success/failure counts

## Authentication & Permissions

All endpoints require:
1. Valid session cookie (`jeton_session`)
2. User to belong to a school (school_id in session)
3. Implicit permission check (admin/staff roles)

Future enhancement: Add explicit role-based permissions (e.g., `students.create`, `students.edit`, `students.delete`)

## Usage Examples

### Admit a Student
```javascript
const res = await fetch('/api/modules/students/admissions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    admission_number: 'ADM-2024-001',
    first_name: 'John',
    last_name: 'Doe',
    gender: 'male',
    date_of_birth: '2010-01-15',
    class_id: 1,
    guardian_name: 'Jane Doe'
  })
});
```

### Record Pocket Money Credit
```javascript
const res = await fetch('/api/modules/students/pocket-money', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_id: 1,
    transaction_type: 'credit',
    amount: 50000,
    description: 'Weekly allowance'
  })
});
```

### Promote Students
```javascript
const res = await fetch('/api/modules/students/promote', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    promotion_type: 'bulk',
    from_class_id: 1,
    to_class_id: 2,
    student_ids: [1, 2, 3, 4, 5],
    academic_year: '2024/2025'
  })
});
```

### Generate ID Card
```javascript
const res = await fetch('/api/modules/students/id-cards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_id: 1,
    photo_url: 'https://example.com/photo.jpg',
    expiry_years: 1
  })
});
```

### Import Students from CSV
```javascript
const formData = new FormData();
formData.append('file', csvFile);
formData.append('action', 'preview'); // or 'import'
formData.append('mapping', JSON.stringify({
  admission_number: 0,
  first_name: 1,
  last_name: 2,
  gender: 3,
  date_of_birth: 4
}));

const res = await fetch('/api/modules/students/import', {
  method: 'POST',
  body: formData
});
```

## Frontend Components

The students module includes:

1. **Students Page** (`/src/app/students/page.js`)
   - Main dashboard with tabbed interface
   - Statistics cards (Active, Alumni, Suspended, etc.)
   - Search and filtering
   - CRUD operations

2. **Module-Specific Pages** (Coming)
   - Admissions form
   - Pocket money tracker
   - ID card generator
   - Promotion wizard
   - Alumni management
   - Discipline log
   - Suspension manager
   - CSV import interface

## Audit Trail

Every action is logged to `student_audit_log`:
- **user_id** - Who performed the action
- **entity_type** - What was acted upon (student, discipline, etc.)
- **entity_id** - Which record
- **action** - What was done (create, update, delete, promote, etc.)
- **changes** - JSON of before/after values
- **created_at** - When it happened

## Error Handling

| Status | Scenario |
|--------|----------|
| 400 | Validation failed, required field missing, invalid data |
| 401 | Not authenticated (missing session) |
| 404 | Resource not found |
| 409 | Conflict (e.g., duplicate admission number) |
| 500 | Server error |

## Performance Optimization

- Indexed queries on `school_id`, `status`, `admission_number`
- Pagination to limit result sets
- View for current pocket money balance
- Connection pooling via PostgreSQL driver

## Testing Checklist

- [ ] Can create student with all required fields
- [ ] Cannot admit with missing admission number
- [ ] Admission number unique per school
- [ ] Can edit student details
- [ ] Soft delete marks record as deleted
- [ ] Can record pocket money credits/debits
- [ ] Cannot debit below zero (unless allowed)
- [ ] Can promote active students only
- [ ] Cannot promote alumni/suspended students
- [ ] Can generate ID cards
- [ ] Can import CSV with validation
- [ ] Can record discipline incidents
- [ ] Can suspend and reactivate students
- [ ] Can move student to alumni
- [ ] All operations log to audit trail
- [ ] Cross-school data isolation works
- [ ] Empty states display proper CTAs

## Future Enhancements

1. **Role-Based Permissions** - Explicit permission checks
2. **File Uploads** - Store student photos and documents
3. **QR Codes** - Generate QR codes for ID cards
4. **Batch Operations** - Bulk export, printing
5. **Analytics** - Student demographics, trends
6. **SMS/Email Notifications** - Guardian communication
7. **Integration** - Sync with external systems
8. **Reporting** - Custom report generation
9. **API Rate Limiting** - Prevent abuse
10. **Webhooks** - External system integration

## Support

For issues or questions:
1. Check API response messages
2. Review audit logs for failed actions
3. Ensure school_id is properly set
4. Verify session authentication

---

**Version**: DRAIS v0.0.0300
**Database**: PostgreSQL 14+
**Framework**: Next.js 16+ with React 19
**Authentication**: Session-based (jeton_session cookie)
