# DATABASE SCHEMA & SCHEMA PARITY

**Version:** 0.0.0050+  
**Database:** PostgreSQL 55 tables | MySQL 86 tables  
**Status:** Full schema parity achieved and verified

## Schema Overview

### Database Engines
- **Primary:** PostgreSQL 14+ (Neon cloud - production)
- **Reference:** MySQL 8.0.44 (XAMPP - development/backup)
- **Synchronization:** One-way flow: MySQL → PostgreSQL via migrations

### Table Count
- **PostgreSQL:** 55 tables (31 original + 24 migrated)
- **MySQL:** 86 tables (complete authoritative source)
- **Migration Strategy:** Incremental, idempotent SQL migrations

## Critical Tables (Blocking Post-Login)

### 1. onboarding_steps
Tracks user onboarding progress step-by-step.

```sql
CREATE TABLE onboarding_steps (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,           -- FK → users.id
    step_name VARCHAR(50) NOT NULL,    -- 'profile', 'school', 'setup', etc.
    step_order INTEGER DEFAULT 0,      -- Sequential order
    status VARCHAR(20) DEFAULT 'pending', -- pending|in_progress|completed|skipped
    step_data JSONB,                   -- Additional context/form data
    started_at TIMESTAMP DEFAULT NULL,
    completed_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```
**Indexes:** 4 (user+status, step_order, user_id)  
**Data:** Updated as user progresses through onboarding  
**Use Case:** POST /api/onboarding/step → Insert/update row

### 2. user_profiles
Extended user profile information (1:1 with users table).

```sql
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,    -- FK → users.id
    full_name VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    bio TEXT,
    profile_picture_url VARCHAR(500),
    designation VARCHAR(100),          -- 'Admin', 'Teacher', 'Student'
    school_id BIGINT,                  -- FK → schools.id
    department_id BIGINT,              -- FK → departments.id
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```
**Indexes:** 2 (user_id UNIQUE, school_id)  
**Queries:** GET /api/profile/{userId} → SELECT from user_profiles  

### 3. user_sessions
Session tracking by IP address, device type, and activity.

```sql
CREATE TABLE user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,           -- FK → users.id
    session_token VARCHAR(255),        -- HTTP-only cookie value
    ip_address VARCHAR(50),
    device_type VARCHAR(50),           -- 'mobile', 'desktop', 'tablet'
    user_agent TEXT,
    last_activity TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);
```
**Indexes:** 3 (user_id, ip_address, activity timestamp)  
**Use Case:** Session management, concurrent login detection

### 4. user_people (Junction Table)
Normalizes users ↔ people relationship for organizational hierarchy.

```sql
CREATE TABLE user_people (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,           -- FK → users.id
    person_id BIGINT NOT NULL,         -- FK → people.id
    relationship_type VARCHAR(50),     -- 'self', 'parent', 'guardian'
    created_at TIMESTAMP DEFAULT NOW()
);
```
**Indexes:** 1 (person_id)  
**Use Case:** Multiple person records per user (1 user can have multiple related people)

### 5. user_trials
Trial subscription tracking for new users.

```sql
CREATE TABLE user_trials (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,    -- FK → users.id
    plan_id BIGINT,                    -- FK → payment_plans.id
    trial_start_date DATE NOT NULL,
    trial_end_date DATE NOT NULL,      -- Auto-calculated from start + trial_period_days
    is_active BOOLEAN DEFAULT true,
    auto_upgrade_plan_id BIGINT,       -- Plan to upgrade to after trial expires
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```
**Indexes:** 4 (user_id UNIQUE, is_active, trial_end_date)  
**Default Duration:** 40 days (stored in payment_plans.trial_period_days)  
**Queries:** 
- GET /api/trial/status/{userId} → SELECT from user_trials
- UPDATE when user converts from trial to paid

### 6. user_payment_plans
Maps users to their active/inactive payment plans.

```sql
CREATE TABLE user_payment_plans (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,           -- FK → users.id
    plan_id BIGINT NOT NULL,           -- FK → payment_plans.id
    start_date DATE NOT NULL,
    end_date DATE,                     -- NULL for active plans
    is_active BOOLEAN DEFAULT true,
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```
**Indexes:** 6 (user_id, plan_id, active flag, end date, created)  
**Use Case:** Determine user's payment tier for feature access control

### 7. payment_plans
Available subscription plans and pricing.

```sql
CREATE TABLE payment_plans (
    id BIGSERIAL PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,        -- 'Free Trial', 'Starter', etc.
    plan_code VARCHAR(50) NOT NULL UNIQUE, -- 'trial', 'starter', 'professional', 'enterprise'
    description TEXT,
    price_monthly DECIMAL(10, 2) DEFAULT 0.00,
    price_yearly DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'UGX',
    trial_period_days INTEGER DEFAULT 0,   -- 0 = no trial, 40 = 40-day trial
    max_students INTEGER,
    max_staff INTEGER,
    max_schools INTEGER DEFAULT 1,
    features JSONB,                        -- JSON array of feature flags
    is_active BOOLEAN DEFAULT true,
    is_trial BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Current Plans:**
1. Free Trial (trial) - 40 days, 0 UGX
2. Starter (starter) - 150,000 UGX/month
3. Professional (professional) - 350,000 UGX/month  
4. Enterprise (enterprise) - Custom pricing

**Indexes:** 3 (is_active, is_trial, plan_code)

## Supporting Tables

### Academic Core
- `students` - Student information and enrollments
- `teachers` - Staff information and assignments
- `classes` - Class/form definitions
- `exams` - Exam periods and schedules
- `assignments` - Teacher-created assignments
- `attendance` - Student attendance tracking
- `quiz` - Quiz definitions and metadata
- `quiz_question` - Individual quiz questions
- `quiz_attempt` - Student quiz submissions

### School Management
- `schools` - School/institution information
- `departments` - Academic departments
- `class_subjects` - Subject allocations per class
- `fee_structures` - Fee definitions and tiers
- `school_settings` - Configuration per school

### Communication
- `notifications` - User notifications (push, email, SMS)
- `messages` - Direct messaging between users
- `audit_log` - System audit trail

### Financial
- `payment_methods` - Credit cards, mobile money, etc.
- `payment_plan` - Legacy payment tier information
- `transactions` - Financial transaction records
- `payment_reminder` - Payment notification scheduling

### Files & Documents
- `file_upload` - Uploaded file metadata
- `documents` - School documents and archives

## Schema Synchronization

### Migration Files
Located in `/database/`:
1. **migration_v0.0.0048_missing_trial_payment_tables.sql** (200 lines)
   - Creates: payment_plans, user_trials, user_payment_plans
   - Inserts: 4 default payment plans
   
2. **migration_v0.0.0049_schema_parity.sql** (905 lines)
   - Creates: 34 tables (onboarding_steps + 33 supporting)
   - Indexes: 50+ performance indexes
   - Constraints: Foreign keys with CASCADE/SET NULL

### Consolidated Schema Files
- **schema.postgres.sql** - Idempotent PostgreSQL deployment (55 tables)
- **schema.mysql.sql** - MySQL reference schema (86 tables)

### Seed Files
- **seed.postgres.sql** - PostgreSQL reference data
- **seed.mysql.sql** - MySQL reference data

## Accessing Schema Information

### List All Tables
```sql
-- PostgreSQL
SELECT table_name FROM information_schema.tables 
WHERE table_schema='public' ORDER BY table_name;

-- MySQL
SELECT table_name FROM information_schema.tables 
WHERE table_schema=DATABASE();
```

### View Table Structure
```sql
-- PostgreSQL
\d table_name

-- MySQL
DESCRIBE table_name;
```

### Export Current Schema
```bash
# PostgreSQL
pg_dump --schema-only "$DATABASE_URL" > schema_export.sql

# MySQL
mysqldump --no-data -h $HOST -u $USER -p $DATABASE > schema_export.sql
```

## Known Differences (PostgreSQL vs MySQL)

| Feature | PostgreSQL | MySQL |
|---------|-----------|-------|
| BIGSERIAL | Native BIGINT AUTO_INCREMENT | BIGINT AUTO_INCREMENT |
| JSONB | Native JSONB type | JSON (text) |
| Timestamps | TIMESTAMP WITH TIME ZONE | DATETIME |
| Boolean | Native BOOLEAN | TINYINT(1) |
| Extensions | uuid-ossp, pgcrypto | None required |
| Constraints | Full FK support | MyISAM doesn't support FKs |

## Performance Tuning

### Recommended Indexes (Already Created)
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_onboarding_steps_user_status ON onboarding_steps(user_id, status);
CREATE INDEX idx_user_trials_active ON user_trials(is_active, trial_end_date);
CREATE INDEX idx_user_payment_plans_active ON user_payment_plans(user_id, is_active);
CREATE INDEX idx_payment_plans_active ON payment_plans(is_active);
```

### Query Optimization
- Index foreign key columns (users.id, schools.id, etc.)
- Index WHERE clause columns (is_active, status, trial_end_date)
- Index ORDER BY columns (sort_order, created_at)
- Consider composite indexes for common WHERE + ORDER BY patterns

## Backup & Recovery

### Backup Commands
```bash
# PostgreSQL
pg_dump "$DATABASE_URL" > drais_backup.sql

# MySQL
mysqldump -h $HOST -u $USER -p $DATABASE > drais_backup.sql
```

### Restore Commands
```bash
# PostgreSQL
psql "$DATABASE_URL" < drais_backup.sql

# MySQL
mysql -h $HOST -u $USER -p $DATABASE < drais_backup.sql
```

---

**Next Steps:**
- Review PAYMENTS_AND_TRIALS.md for payment logic
- Review AUTH_AND_ONBOARDING.md for access control queries
- Review DEPLOYMENT_AND_OPERATIONS.md for maintenance procedures
