# Critical Database Schema Structure Analysis

## Discovery Summary

**Date**: Current Session  
**Issue**: API endpoints written against incorrect schema assumptions  
**Impact**: All student management endpoints return 500 errors  
**Root Cause**: API assumes flat students table, actual schema uses relational structure with `people` table

## Actual Database Schema Structure

### Core Student Tables

#### 1. `students` table
Contains enrollment and academic placement information:
```
- id (SERIAL PK)
- school_id (INT FK → schools)
- person_id (INT FK → people) ⭐ LINKS TO PERSONAL DATA
- student_code (VARCHAR UNIQUE)
- admission_number (VARCHAR UNIQUE)
- admission_date (DATE)
- admission_type (VARCHAR)
- class_id (INT FK → classes)
- section_id (INT FK → sections)
- stream_id (INT FK → streams)
- date_of_admission (DATE)
- date_of_discharge (DATE)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

#### 2. `people` table  
Contains all personal/demographic information:
```
- id (SERIAL PK)
- school_id (INT FK → schools)
- first_name (VARCHAR)
- middle_name (VARCHAR)
- last_name (VARCHAR)
- date_of_birth (DATE)
- gender (VARCHAR)
- national_id (VARCHAR)
- phone (VARCHAR)
- email (VARCHAR)
- address (TEXT)
- city, state, country (VARCHAR)
- postal_code (VARCHAR)
- profile_image_url (VARCHAR)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

#### 3. `enrollments` table
Tracks enrollment in specific academic year/term:
```
- id (SERIAL PK)
- school_id (INT FK)
- student_id (INT FK → students)
- academic_year_id (INT FK → academic_years)
- term_id (INT FK → terms)
- class_id (INT FK → classes)
- section_id (INT FK → sections)
- enrollment_status (VARCHAR) - 'active', etc.
- enrollment_date (DATE)
- created_at, updated_at (TIMESTAMP)
```

#### 4. `student_attendance` table
```
- id (SERIAL PK)
- school_id (INT FK)
- student_id (INT FK → students)
- attendance_date (DATE NOT NULL)
- status (VARCHAR) - 'present', etc.
- remarks (TEXT)
- created_at, updated_at (TIMESTAMP)
```

### Financial Tables

#### `payment_plans` table
```
- id, plan_name, plan_code (UNIQUE)
- description, prices (termly, annual, monthly, yearly)
- trial_period_days, is_trial, is_active
- sort_order
- created_at, updated_at
```

Other financial tables:
- `fee_structures` - Define fees by class/year
- `user_payment_plans` - User subscription to plans
- `user_trials` - Track trial periods
- `payment_methods`, `payment_reminder`, `wallets`

## Critical Findings

### ❌ MISSING Tables (Referenced in Old API Code)
- `student_transactions` ← DOES NOT EXIST (only `transactions` table mentioned in listing)
- `student_discipline` ← DOES NOT EXIST
- `student_admissions` ← DOES NOT EXIST
- `student_audit_log` ← Use generic `audit_log` instead

### ❌ MISSING Columns in students table
- `first_name`, `last_name` ← In `people` table
- `dob` ← In `people` table as `date_of_birth`
- `gender` ← In `people` table
- `email`, `phone` ← In `people` table
- `address` ← In `people` table
- `status` ← Must be inferred from `is_active` or use `date_of_discharge`
- `admission_no` ← Actually called `admission_number`
- `roll_no`, `section_id` ← Exist but structure different

### ✅ CORRECT Fields in students table
- `admission_number` (not `admission_no`)
- `admission_date` 
- `class_id`, `section_id`, `stream_id`
- Links via `person_id` → `people` for demographics

## API Response Mapping Strategy

All GET endpoints should:
1. JOIN students → people to get personal data
2. Map response fields to consistent API contract
3. Filter by school_id for isolation

Example correct query pattern:
```sql
SELECT 
  s.id,
  s.admission_number,
  p.first_name,
  p.last_name,
  p.date_of_birth,
  p.gender,
  s.class_id,
  c.name as class_name,
  s.section_id,
  s.stream_id,
  p.email,
  p.phone,
  p.address,
  p.profile_image_url as photo_url,
  CASE WHEN s.is_active = true AND s.date_of_discharge IS NULL 
    THEN 'active' ELSE 'inactive' END as status,
  s.created_at as enrollment_date,
  s.updated_at
FROM students s
LEFT JOIN people p ON s.person_id = p.id
LEFT JOIN classes c ON s.class_id = c.id
WHERE s.school_id = $1
```

## Next Steps

1. **Revert incorrect changes** - Previous fixes assumed wrong schema
2. **Fix all API endpoints** to use correct JOIN pattern:
   - admissions (GET/POST/PUT/DELETE)
   - pocket-money (GET/POST) - Need to check if transactions table exists
   - promote (GET/POST) - Update enrollments, not students
   - alumni (GET/POST) - Update is_active/date_of_discharge
   - discipline (GET/POST) - Need to verify table structure
   - suspended (GET/POST) - Need to verify table structure
   - id-cards (GET) - Query with people join
   - import (POST) - Batch create students + people records

3. **Create/Update transaction handling**:
   - POST admissions: INSERT people + students + enrollments in transaction
   - POST promote: UPDATE enrollments (term-specific, not students)
   - POST alumni: UPDATE students (is_active, date_of_discharge)

4. **Test comprehensive workflow**:
   - Admissions: Create person → Create student → Create enrollment
   - List: Query students + people JOIN
   - Promote: Create enrollment record (don't update students)
   - Alumni: Update is_active/discharge date
