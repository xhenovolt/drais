# Session-Based Authentication Architecture Reference
## DRAIS v0.0.0052

---

## 📋 Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                   DRAIS Frontend (React)                     │
│                                                               │
│  Login.jsx  │  Register.jsx  │  Dashboard.jsx  │  SchoolSetup.jsx
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/HTTPS
                       │ Requests with sessionId cookie
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js API Routes (Backend)                    │
│                                                               │
│  /api/auth/login      → findUser → verifyPassword → createSession
│  /api/auth/register   → hashPassword → createUser → createSession
│  /api/auth/logout     → invalidateSession
│  /api/school/setup    → updateSchool → logAudit
└──────────────────────┬──────────────────────────────────────┘
                       │ Middleware validates session on every request
                       │
                       ├─→ session.service.js
                       │   ├─ hashPassword()
                       │   ├─ verifyPassword()
                       │   ├─ createSession()
                       │   ├─ validateSession()
                       │   ├─ invalidateSession()
                       │   └─ logAuditEvent()
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           PostgreSQL Database (Neon Cloud)                   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ users (existing table + new columns)                 │   │
│  │  - id, school_id, username, email, password_hash    │   │
│  │  - role, status, phone (NEW), school_onboarded (NEW)│   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ sessions (NEW)                                        │   │
│  │  - id (UUID), user_id, ip_address, user_agent        │   │
│  │  - created_at, expires_at, last_activity             │   │
│  │  - stay_logged_in, is_active, logged_out_at          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ school_onboarding (NEW)                              │   │
│  │  - school_id, school_name_set, school_address_set    │   │
│  │  - contact_info_set, location_details_set, policies_set
│  │  - is_complete, completed_at                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ user_roles (NEW)                                      │   │
│  │  - user_id, school_id, role_name, assigned_by        │   │
│  │  - assigned_at, is_primary                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ role_permissions (NEW)                                │   │
│  │  - role_name, permission                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ audit_logs (ENHANCED)                                 │   │
│  │  - user_id, school_id, action, entity_type, entity_id│   │
│  │  - old_values, new_values (JSONB), ip_address        │   │
│  │  - user_agent, created_at                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ schools (existing table)                              │   │
│  │  - id, name, address, phone, website, etc.            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ user_trials (existing table)                          │   │
│  │  - Auto-assigned FREE TRIAL on registration (14 days)│   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow Diagram

### Registration Flow

```
User clicks "Sign Up"
  │
  ├─ Input: email, username, password (+ optional phone)
  │
  ▼
POST /api/auth/register
  │
  ├─ Validate input
  ├─ Check email/username uniqueness
  ├─ Hash password (PBKDF2 + salt)
  │
  ├─ Transaction START
  │   ├─ CREATE schools (name="Pending Setup")
  │   ├─ CREATE school_onboarding (with school_id)
  │   ├─ CREATE users (role = superadmin if first, else student)
  │   ├─ CREATE user_roles (user_id, school_id, role_name)
  │   ├─ CREATE user_trials (14-day free trial)
  │   ├─ CREATE sessions (UUID, expires_at, is_active=true)
  │   └─ Transaction COMMIT
  │
  ├─ Log audit: action='user_registered'
  │
  ▼
Response:
  ├─ Set cookie: sessionId=<UUID>
  ├─ Return user info (id, username, email, role)
  ├─ redirectTo: /dashboard
  │
  ▼
Frontend redirects to /dashboard
  │
  └─ Dashboard shows onboarding status banner (optional setup)
```

### Login Flow

```
User clicks "Login"
  │
  ├─ Input: identifier (username|email|phone), password
  │
  ▼
POST /api/auth/login
  │
  ├─ Validate input
  ├─ findUserByIdentifier(identifier)
  │   └─ SELECT * FROM users WHERE username=? OR email=? OR phone=?
  │
  ├─ verifyPassword(password, user.password_hash)
  │   └─ Compare PBKDF2(password, salt) == stored_hash
  │
  ├─ createSession(user.id)
  │   ├─ Generate sessionId = uuid()
  │   ├─ INSERT INTO sessions (...)
  │   └─ Calculate expires_at (30 or 90 days)
  │
  ├─ UPDATE users SET last_login = NOW
  ├─ Log audit: action='login'
  │
  ▼
Response:
  ├─ Set cookie: sessionId=<UUID> (httpOnly, secure, sameSite=strict)
  ├─ Return user info
  ├─ redirectTo: /dashboard
  │
  ▼
Frontend sets cookie automatically, redirects to /dashboard
```

### Session Validation (On Every Request)

```
Frontend makes request to /api/...
  │
  ├─ Browser includes: Cookie: sessionId=<UUID>
  │
  ▼
Next.js Middleware
  │
  ├─ Extract sessionId from cookies
  ├─ validateSession(sessionId)
  │   │
  │   ├─ Query: SELECT * FROM sessions WHERE id=? AND is_active=TRUE
  │   ├─ Check: expires_at > NOW?
  │   ├─ Check: user.status = 'active'?
  │   ├─ Check: inactivity < 7 days? (if not stay_logged_in)
  │   │
  │   ├─ If all checks pass:
  │   │   ├─ UPDATE sessions SET last_activity = NOW
  │   │   ├─ Attach user info to request headers
  │   │   └─ Allow request to proceed
  │   │
  │   └─ If any check fails:
  │       ├─ Return 401 Unauthorized
  │       ├─ Redirect to /login
  │       └─ Clear sessionId cookie
  │
  ▼
Route handler processes request with user context
```

### Logout Flow

```
User clicks "Logout"
  │
  ├─ Current sessionId cookie included in request
  │
  ▼
POST /api/auth/logout
  │
  ├─ Extract sessionId from cookies
  ├─ validateSession(sessionId) → get user info
  ├─ invalidateSession(sessionId)
  │   ├─ UPDATE sessions SET is_active=FALSE, logged_out_at=NOW
  │   └─ Log audit: action='logout'
  │
  ▼
Response:
  ├─ Clear cookie: sessionId='' (maxAge=0)
  ├─ redirectTo: /login
  │
  ▼
Frontend is now logged out, redirected to /login
```

---

## 🗄️ Database Schema Reference

### 1. sessions (NEW)

**Purpose**: Track active user sessions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique session identifier (sent in httpOnly cookie) |
| user_id | BIGINT | FK → users | User owning this session |
| ip_address | VARCHAR(45) | | Client IP (IPv4/IPv6) for security logging |
| user_agent | TEXT | | Browser/client info for device tracking |
| created_at | TIMESTAMP | NOT NULL | When session was created |
| last_activity | TIMESTAMP | NOT NULL | When session was last used (updated on each request) |
| expires_at | TIMESTAMP | NOT NULL | When session expires (30 or 90 days) |
| stay_logged_in | BOOLEAN | DEFAULT FALSE | If true, extends session on activity |
| is_active | BOOLEAN | DEFAULT TRUE | If false, session is invalid |
| logged_out_at | TIMESTAMP | | When user explicitly logged out |

**Indexes**:
- `idx_sessions_user_id` ON user_id
- `idx_sessions_active` ON user_id WHERE is_active = TRUE
- `idx_sessions_expiry` ON expires_at

**Queries**:
```sql
-- Find active session
SELECT * FROM sessions 
WHERE id = $1 AND is_active = TRUE AND expires_at > NOW;

-- Cleanup expired sessions (optional background job)
DELETE FROM sessions WHERE expires_at < NOW;

-- Find user's active sessions
SELECT * FROM sessions 
WHERE user_id = $1 AND is_active = TRUE;
```

---

### 2. school_onboarding (NEW)

**Purpose**: Track school setup progress (non-blocking)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PK | |
| school_id | BIGINT | FK, UNIQUE → schools | School being set up |
| school_name_set | BOOLEAN | DEFAULT FALSE | Name field filled |
| school_address_set | BOOLEAN | DEFAULT FALSE | Address field filled |
| contact_info_set | BOOLEAN | DEFAULT FALSE | Contact info filled |
| location_details_set | BOOLEAN | DEFAULT FALSE | Location filled |
| policies_set | BOOLEAN | DEFAULT FALSE | Policies filled |
| is_complete | BOOLEAN | DEFAULT FALSE | Only TRUE if name + address set |
| completed_at | TIMESTAMP | | When setup completed |
| created_at | TIMESTAMP | NOT NULL | When record created |
| updated_at | TIMESTAMP | NOT NULL | When record last updated |

**Constraints**:
- `is_complete = (school_name_set AND school_address_set)`

**Indexes**:
- `idx_school_onboarding_status` ON is_complete

**Queries**:
```sql
-- Get school setup status
SELECT * FROM school_onboarding WHERE school_id = $1;

-- Find schools not yet set up
SELECT so.*, s.name 
FROM school_onboarding so
JOIN schools s ON so.school_id = s.id
WHERE so.is_complete = FALSE;
```

---

### 3. user_roles (NEW)

**Purpose**: Map users to roles within schools (RBAC)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PK | |
| user_id | BIGINT | FK → users | User being assigned a role |
| school_id | BIGINT | FK → schools | School context for the role |
| role_name | VARCHAR(50) | NOT NULL | Role name ('superadmin', 'admin', 'teacher', 'student', 'parent') |
| assigned_by | BIGINT | FK → users | Who assigned this role |
| assigned_at | TIMESTAMP | NOT NULL | When role was assigned |
| is_primary | BOOLEAN | DEFAULT FALSE | Primary role for this user-school combination |

**Unique Constraint**: (user_id, school_id, role_name)

**Indexes**:
- `idx_user_roles_school` ON (school_id, role_name)
- `idx_user_roles_primary` ON user_id WHERE is_primary = TRUE

**Queries**:
```sql
-- Get user's primary role in school
SELECT role_name FROM user_roles 
WHERE user_id = $1 AND school_id = $2 AND is_primary = TRUE;

-- Get all roles for a user in a school
SELECT role_name FROM user_roles 
WHERE user_id = $1 AND school_id = $2;

-- Find all superadmins in school
SELECT u.id, u.username, u.email 
FROM user_roles ur
JOIN users u ON ur.user_id = u.id
WHERE ur.school_id = $1 AND ur.role_name = 'superadmin';
```

---

### 4. role_permissions (NEW)

**Purpose**: Define what each role can do (RBAC permissions)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PK | |
| role_name | VARCHAR(50) | NOT NULL | Role ('superadmin', 'admin', 'teacher', 'student', 'parent') |
| permission | VARCHAR(100) | NOT NULL | Permission name ('view_dashboard', 'manage_users', 'edit_school', etc.) |

**Unique Constraint**: (role_name, permission)

**Default Permissions** (seeded at migration):
```
superadmin: view_dashboard, manage_users, edit_school, view_audit_log, manage_payments
admin: view_dashboard, manage_students, manage_staff, view_reports
teacher: view_dashboard, manage_classes, view_grades
student: view_dashboard, view_grades
parent: view_dashboard, view_child_progress
```

**Queries**:
```sql
-- Get all permissions for a role
SELECT permission FROM role_permissions 
WHERE role_name = 'superadmin' 
ORDER BY permission;

-- Check if role has permission
SELECT EXISTS (
  SELECT 1 FROM role_permissions 
  WHERE role_name = $1 AND permission = $2
);
```

---

### 5. audit_logs (ENHANCED)

**Purpose**: Immutable action log for security & compliance

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PK | |
| user_id | BIGINT | FK → users, NULL | User who performed action |
| school_id | BIGINT | FK → schools, NULL | School context (for multi-tenant) |
| action | VARCHAR(50) | NOT NULL | Action type ('login', 'logout', 'user_registered', 'school_setup_completed', etc.) |
| entity_type | VARCHAR(100) | | Type of entity affected ('user', 'school', 'session', 'payment_plan') |
| entity_id | BIGINT | | ID of affected entity |
| old_values | JSONB | | Previous state (for updates) |
| new_values | JSONB | | New state (for creates and updates) |
| ip_address | VARCHAR(45) | | Client IP for security investigation |
| user_agent | TEXT | | Browser/client info |
| created_at | TIMESTAMP | NOT NULL | Immutable timestamp |

**Indexes**:
- `idx_audit_logs_user` ON user_id
- `idx_audit_logs_school` ON school_id
- `idx_audit_logs_entity` ON (entity_type, entity_id)
- `idx_audit_logs_action` ON action
- `idx_audit_logs_timestamp` ON created_at (DESC)

**Queries**:
```sql
-- Get audit trail for user
SELECT * FROM audit_logs 
WHERE user_id = $1 
ORDER BY created_at DESC LIMIT 50;

-- Get recent actions
SELECT user_id, action, entity_type, created_at, ip_address 
FROM audit_logs 
ORDER BY created_at DESC LIMIT 100;

-- Find suspicious activity
SELECT COUNT(*) as attempts, user_id, ip_address 
FROM audit_logs 
WHERE action = 'login' AND created_at > NOW() - INTERVAL '5 minutes'
GROUP BY user_id, ip_address
HAVING COUNT(*) > 5; -- More than 5 login attempts in 5 minutes
```

---

### 6. users (MODIFIED - Additions)

**New Columns Added**:

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| phone | VARCHAR(20) | NULL | Phone number for login support |
| school_onboarded | BOOLEAN | FALSE | User completed school setup |

**Existing Columns** (for reference):
- id, school_id, person_id, username, email, password_hash
- role, status, email_verified, two_factor_enabled
- last_login, created_at, updated_at, onboarding_completed, onboarding_completed_at

---

## 🔗 Relationships Diagram

```
users (exists)
  ├─ PK: id
  ├─ FK: school_id → schools
  ├─ Columns: email, username, phone, password_hash, role, status
  │
  ├─→ sessions (1:N) ← One user can have multiple sessions
  │   ├─ user_id FK
  │   ├─ Tracks: ip_address, user_agent, last_activity, expires_at
  │   └─ Is the "login" relationship
  │
  ├─→ user_roles (1:N) ← User has multiple roles (per school)
  │   ├─ (user_id, school_id, role_name)
  │   └─ Can be: superadmin, admin, teacher, student, parent
  │
  └─→ audit_logs (1:N) ← All actions tracked
      ├─ action: 'login', 'logout', 'school_setup_completed'
      └─ Immutable history

schools (exists)
  ├─ PK: id
  ├─ Columns: name, address, phone, website, location
  │
  ├─→ school_onboarding (1:1) ← Tracks setup progress
  │   ├─ school_id FK (UNIQUE)
  │   └─ Fields: school_name_set, school_address_set, is_complete
  │
  └─→ user_roles (1:N) ← Users with roles in this school
      └─ (user_id, school_id, role_name)

role_permissions (static lookup table)
  └─ (role_name, permission) → Used for authorization checks

audit_logs (1:N from users, schools, or any entity)
  └─ Immutable trail of all actions
```

---

## 🔒 Security Features

### Session Security
✅ **httpOnly cookies** - JavaScript cannot access session ID (prevents XSS theft)
✅ **secure flag** - Cookie only sent over HTTPS in production
✅ **sameSite=strict** - Cookie not sent in cross-site requests (prevents CSRF)
✅ **UUID session IDs** - Cryptographically secure, unguessable
✅ **Expiry timestamps** - Sessions expire (30/90 days absolute, 7 days inactivity)

### Password Security
✅ **PBKDF2 hashing** - Key derivation function with salt (consider bcryptjs for production)
✅ **Minimum 8 characters** - Enforced at API level
✅ **Salt per password** - Each password has unique salt
✅ **Never logged** - Password_hash never returned in API responses
✅ **Generic error messages** - "Invalid credentials" doesn't leak if email exists

### Audit Logging
✅ **Immutable logs** - audit_logs table cannot be updated (only INSERT)
✅ **Captures context** - IP address, user-agent for device tracking
✅ **Tracks changes** - old_values and new_values in JSONB
✅ **Indexed for queries** - Can quickly find actions by user/school/type/time
✅ **Permanent record** - Never deleted (archival/compliance)

### Multi-Tenant Safety
✅ **school_id context** - All actions logged with school context
✅ **Row-level security** (future) - Can enforce via PostgreSQL policies
✅ **User isolation** - Users can only see their school's data
✅ **Audit separation** - Each school's logs are separate

### Authorization
✅ **Role-based access control** - user_roles + role_permissions
✅ **Superadmin enforcement** - First user auto-assigned, controls others
✅ **Middleware checks** - Validates session before route execution
✅ **Permission lookup** - Can check permission for action before executing

---

## 📊 Query Performance Notes

### Frequently Used Queries

1. **Validate Session** (on every request)
```sql
SELECT s.*, u.id as user_id, u.username, u.email, u.role, u.status, u.school_id
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.id = $1 AND s.is_active = TRUE AND s.expires_at > CURRENT_TIMESTAMP
```
**Optimization**: Indexes on sessions(id), sessions(expires_at), sessions(user_id)

2. **Find User** (login)
```sql
SELECT id, username, email, phone, password_hash, role, status, school_id
FROM users
WHERE (username ILIKE $1 OR email ILIKE $1 OR phone = $1) AND status = 'active'
```
**Optimization**: Indexes on users(username), users(email), users(phone), users(status)

3. **Audit Trail** (compliance)
```sql
SELECT * FROM audit_logs
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 100
```
**Optimization**: Index on audit_logs(user_id, created_at DESC)

### Cleanup/Maintenance Queries

```sql
-- Remove expired sessions (optional background job, weekly)
DELETE FROM sessions WHERE expires_at < NOW();

-- Archive old audit logs (optional, keep 2 years)
DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '2 years';

-- Find stale sessions
SELECT COUNT(*) FROM sessions WHERE is_active = FALSE;

-- Find long-running sessions
SELECT user_id, created_at, AGE(NOW(), created_at) 
FROM sessions 
WHERE is_active = TRUE 
ORDER BY created_at ASC;
```

---

## 🎯 Implementation Checklist

### Backend API ✅
- [x] `POST /api/auth/login` - Session-based login
- [x] `POST /api/auth/register` - Auto-login registration
- [x] `POST /api/auth/logout` - Session invalidation
- [x] `PATCH /api/school/setup` - School configuration
- [x] `GET /api/school/setup` - Get setup status
- [ ] `POST /api/auth/forgot-password` - Password reset
- [ ] `PUT /api/users/:id` - Update user (with audit logging)
- [ ] `DELETE /api/users/:id` - Delete user (soft delete)
- [ ] `GET /api/audit-logs` - View audit trail (superadmin only)
- [ ] Rate limiting on /api/auth/login (brute force protection)

### Frontend UI ❌ (Not yet started)
- [ ] Login page (/login)
- [ ] Register page (/register)
- [ ] Dashboard (/dashboard)
- [ ] School setup form (/school-setup)
- [ ] Navbar with logout button
- [ ] Onboarding status banner
- [ ] Protected route guards
- [ ] Session timeout warning

### Database ✅
- [x] Create sessions table
- [x] Create school_onboarding table
- [x] Create user_roles table
- [x] Create role_permissions table
- [x] Create/enhance audit_logs table
- [x] Add columns to users table
- [ ] Test migration on production DB
- [ ] Backup production DB before migration
- [ ] Verify all queries execute correctly

### Testing ⏳ (Ready to start)
- [ ] Register first user (verify superadmin role)
- [ ] Register second user (verify student role)
- [ ] Login with username
- [ ] Login with email
- [ ] Login with phone
- [ ] Stay logged in (90 day session)
- [ ] Session expiry (30 day timeout)
- [ ] Inactivity timeout (7 days)
- [ ] Logout
- [ ] School setup
- [ ] Audit logging
- [ ] Rate limiting on login attempts
- [ ] Load testing on sessions table
- [ ] E2E test: register → login → setup school → access dashboard

### Deployment 📋 (Next phase)
- [ ] Update environment variables (NODE_ENV=production)
- [ ] Enable HTTPS (secure=true for cookies)
- [ ] Setup rate limiting (Redis/Upstash for serverless)
- [ ] Migrate existing users (assign roles, create sessions)
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] 2FA/MFA (optional but recommended)
- [ ] Monitoring & alerting (unusual login patterns)
- [ ] Backup strategy for audit logs

---

## 📚 Related Documentation

- `IMPLEMENTATION_v0.0.0052_SESSION_REDESIGN.md` - Complete technical spec
- `SESSION_AUTH_IMPLEMENTATION_SUMMARY_v0.0.0052.md` - What was built
- `QUICKSTART_SESSION_AUTH_v0.0.0052.md` - Quick reference guide
- `test-session-auth-v0.0.0052.sh` - Test script (bash)

---

**Version**: v0.0.0052  
**Status**: Implementation Complete (API/Database Ready)  
**Next Phase**: Frontend UI Development  
**Last Updated**: 2024-01-15
