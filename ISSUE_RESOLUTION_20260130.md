# Issue Resolution Summary

## Problems Identified and Fixed

### Issue 1: `column s.person_id does not exist`
**Error**: PostgreSQL column error when querying students table
**Root Cause**: API assumed a relational schema (students → people) that didn't exist in the deployed database
**Solution**: Updated API to query the actual flat students table structure directly

### Issue 2: Multiple Lockfiles Warning
**Error**: "Next.js inferred your workspace root... multiple lockfiles detected"
**Root Cause**: Both `/` and `/home/xhenvolt/projects/drais/` have package-lock.json files
**Recommendation**: Configure `turbopack.root` in next.config.mjs or remove unnecessary lockfile

### Issue 3: SSL Connection Warning
**Error**: "SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases..."
**Root Cause**: PostgreSQL connection string using deprecated SSL mode syntax
**Recommendation**: Update connection string to use `sslmode=verify-full` or add `uselibpqcompat=true`

---

## Changes Made

### 1. API Endpoint Fix (`src/app/api/modules/students/admissions/route.js`)

#### GET Endpoint
- **Removed**: `LEFT JOIN people p ON s.person_id = p.id` (table doesn't exist)
- **Changed**: Column references from `p.first_name` to `s.first_name`, `p.dob` to `s.dob`, etc.
- **Changed**: `admission_number` column to `admission_no`
- **Added**: Response mapping for `date_of_birth` (from `dob` column)

**Database Query**:
```sql
SELECT 
  s.id,
  s.admission_no,
  s.first_name,
  s.last_name,
  s.dob as date_of_birth,  -- Map to consistent API field
  s.gender,
  s.email,
  s.phone,
  s.address,
  s.photo_url,
  s.class_id,
  s.section_id,
  s.roll_no,
  s.status,
  s.created_at as enrollment_date,
  s.updated_at
FROM students s
WHERE s.school_id = $1
```

#### POST Endpoint  
- **Removed**: Transaction creating person → student → enrollment (people table doesn't exist)
- **Changed**: Direct INSERT into students table
- **Changed**: Column names to match actual table (`admission_no` not `admission_number`)
- **Simplified**: No longer references non-existent tables

**Database Insert**:
```sql
INSERT INTO students (
  school_id, admission_no, first_name, last_name,
  gender, dob, email, phone, address, photo_url,
  class_id, section_id, status
) VALUES (...)
```

### 2. Form Update (`src/app/admissions/page.js`)

**Field Changes**:
- `profile_image_url` → `photo_url`
- `admission_number` → `admission_no`
- Removed: `stream_id` (doesn't exist in students table)

**Data Mapping**:
```javascript
const admissionData = {
  first_name, last_name, gender, date_of_birth,
  class_id, section_id,
  email, phone, address,
  photo_url,
  admission_no  // Auto-generated if not provided
}
```

### 3. Display Update (`src/app/students/page.js`)

- Changed display of admission identifier from `student.admission_number` to `student.admission_no`

---

## Actual Database Schema

The deployed students table structure:

```sql
students (
  id              BIGINT (PK)
  school_id       BIGINT (FK)
  admission_no    VARCHAR (UNIQUE)        ← Not admission_number
  class_id        BIGINT (FK, nullable)
  section_id      BIGINT (FK, nullable)
  roll_no         INTEGER (nullable)
  first_name      VARCHAR (required)      ← Direct column
  last_name       VARCHAR (required)      ← Direct column
  dob             DATE (nullable)         ← Not date_of_birth
  gender          ENUM (nullable)
  phone           VARCHAR (nullable)
  email           VARCHAR (nullable)
  address         TEXT (nullable)
  photo_url       VARCHAR (nullable)
  status          ENUM (nullable)
  created_at      TIMESTAMP (nullable)
  updated_at      TIMESTAMP (nullable)
)
```

**No relations to**:
- ❌ people table
- ❌ person_id foreign key
- ❌ stream_id column

---

## Test Results

✅ **API Status**:
- `GET /api/modules/students/admissions` → **200 OK** (not 500)
- `GET /students` → **200 OK** (page loads)
- Authentication still properly enforces school isolation
- Returns 401 Unauthorized when not authenticated (correct)

✅ **Database Operations**:
- Students table queries work without errors
- No "column does not exist" errors
- API response mapping works correctly

✅ **Deployment Ready**:
- All existing session authentication working
- School-scoped data isolation enforced
- Form submissions map to correct columns
- Page displays render without errors

---

## Remaining Issues (Not Critical)

### 1. Multiple Lockfiles
**File**: Root directory has `/package-lock.json` in addition to `/home/xhenvolt/projects/drais/package-lock.json`

**Fix Option A** (Recommended):
```json
// next.config.mjs
export default {
  turbopack: {
    root: "./",
  }
}
```

**Fix Option B** (Alternative):
Remove the outer `/home/xhenvolt/package-lock.json` if it's not needed for another project

### 2. PostgreSQL SSL Warning
**File**: `.env.local` DATABASE_URL

**Current**: `postgres://...?sslmode=require`

**Recommended Update**: 
```
postgres://...?sslmode=verify-full
```
or
```
postgres://...?uselibpqcompat=true&sslmode=require
```

---

## Commits Made

1. `491924a` - fix: correct schema to match actual database structure (flat students table)
2. `02b2b71` - chore: remove debug schema endpoint

---

## Next Steps

1. ✅ **RESOLVED** - GET/POST admissions endpoints now work
2. ✅ **RESOLVED** - Forms submit with correct field names
3. ✅ **RESOLVED** - Database queries use actual table structure
4. **Optional** - Fix multiple lockfiles warning
5. **Optional** - Update PostgreSQL SSL connection string
6. **Future** - Apply same schema fixes to other student modules (pocket-money, promote, alumni, etc.)
