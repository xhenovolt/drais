# DRAIS Authentication & Onboarding Redesign v0.0.0052

## Overview

Complete production-grade redesign of authentication and onboarding for SaaS:
- **Session-based authentication** (no JWT)
- **Decoupled onboarding** (login ≠ onboarding)
- **Role-based access control** (RBAC)
- **Comprehensive audit logging**
- **Seamless existing user migration**

---

## Architecture Changes

### 1. Authentication Flow (NEW)

```
┌─────────────────┐
│   User Input    │
│  (identifier +  │
│   password)     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ findUserByIdentifier        │
│ (username, email, or phone) │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ verifyPassword           │
│ (password hash check)    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ createSession            │
│ (UUID-based session)     │
│ (httpOnly cookie)        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ logAuditEvent            │
│ (action: login)          │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Return session info      │
│ + redirectTo: /dashboard │
└──────────────────────────┘
```

### 2. Registration Flow (NEW)

```
User Registration
    ↓
Validate (email, username, password)
    ↓
Check uniqueness
    ↓
Create school (Pending Setup)
    ↓
Create school_onboarding record
    ↓
Create user + auto-assign role
    ├─ First user per instance = SUPERADMIN
    └─ Other users = STUDENT (can be changed by superadmin)
    ↓
Auto-assign FREE TRIAL (14 days)
    ↓
Create session (immediate login)
    ↓
Log registration event
    ↓
Redirect → /dashboard (NOT /onboarding)
```

### 3. Onboarding Flow (DECOUPLED)

```
After Login
    ↓
Redirect to /dashboard (always accessible)
    ↓
Dashboard shows:
    ├─ Onboarding status banner (if not complete)
    ├─ Links to school setup form
    ├─ Mandatory fields: school_name, school_address
    └─ Optional fields: phone, website, location, contact, principal
    ↓
Once mandatory fields set
    └─ school_onboarded = TRUE
    └─ Full system access unlocked
```

### 4. Session Lifecycle

```
Session Creation
    ↓
    ├─ sessionId: UUID
    ├─ user_id: references users(id)
    ├─ ip_address: client IP
    ├─ user_agent: browser info
    ├─ created_at: timestamp
    ├─ expires_at: timestamp (30 days default, 90 days with stay_logged_in)
    ├─ last_activity: updated on each request
    ├─ stay_logged_in: boolean
    └─ is_active: boolean
    ↓
    │ httpOnly cookie: sessionId=<UUID>
    │ secure=true (production)
    │ sameSite=strict
    │ maxAge=30 days or 90 days
    ↓
Every Request
    ├─ Validate session exists
    ├─ Check not expired
    ├─ Check user.status = 'active'
    ├─ Check inactivity (7 days default for non-stay_logged_in)
    └─ Update last_activity
    ↓
Logout / Expiry
    ├─ Set is_active = FALSE
    ├─ Set logged_out_at = CURRENT_TIMESTAMP
    ├─ Clear session cookie
    └─ Log audit event
```

---

## Database Schema Changes

### New Tables

#### 1. `sessions` Table
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    stay_logged_in BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    logged_out_at TIMESTAMP
);
```

#### 2. `school_onboarding` Table
```sql
CREATE TABLE school_onboarding (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT UNIQUE REFERENCES schools(id) ON DELETE CASCADE,
    school_name_set BOOLEAN DEFAULT FALSE,
    school_address_set BOOLEAN DEFAULT FALSE,
    contact_info_set BOOLEAN DEFAULT FALSE,
    location_details_set BOOLEAN DEFAULT FALSE,
    policies_set BOOLEAN DEFAULT FALSE,
    is_complete BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

#### 3. `user_roles` Table (Role Assignment)
```sql
CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL,
    assigned_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, school_id, role_name)
);
```

#### 4. `role_permissions` Table (Enhanced)
```sql
CREATE TABLE role_permissions (
    id BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    permission VARCHAR(100) NOT NULL,
    UNIQUE(role_name, permission)
);
```

#### 5. `audit_logs` Table (Action History)
```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    school_id BIGINT REFERENCES schools(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL
);
```

### Column Additions to Existing Tables

#### `users` Table
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS school_onboarded BOOLEAN DEFAULT FALSE;
```

---

## API Endpoints

### Authentication

#### Login (Session-Based)
```
POST /api/auth/login

Request:
{
  "identifier": "username | email | phone",
  "password": "user_password",
  "stayLoggedIn": true/false (optional)
}

Response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 123,
    "username": "john",
    "email": "john@example.com",
    "role": "superadmin"
  },
  "redirectTo": "/dashboard"
}

Cookies:
- sessionId: <UUID> (httpOnly, secure, sameSite=strict)
```

#### Register (Auto-Login)
```
POST /api/auth/register

Request:
{
  "email": "user@example.com",
  "username": "john",
  "password": "SecurePass123",
  "phone": "+1234567890" (optional),
  "name": "John Doe" (optional)
}

Response:
{
  "success": true,
  "message": "Registration successful. Welcome!",
  "user": {
    "id": 123,
    "username": "john",
    "email": "john@example.com",
    "role": "superadmin" | "student",
    "schoolId": 456,
    "isFirstUser": true
  },
  "redirectTo": "/dashboard"
}

Cookies:
- sessionId: <UUID> (httpOnly, secure, sameSite=strict)
```

#### Logout
```
POST /api/auth/logout

Headers:
- Cookie: sessionId=<UUID>

Response:
{
  "success": true,
  "message": "Logout successful",
  "redirectTo": "/login"
}

Cookies:
- sessionId: deleted (maxAge=0)
```

### School Setup (Decoupled Onboarding)

#### Update School Setup
```
PATCH /api/school/setup

Headers:
- Cookie: sessionId=<UUID>

Request:
{
  "school_name": "John Smith High School",
  "school_address": "123 Main Street, Springfield, IL 62701",
  "school_phone": "+1-217-555-0100" (optional),
  "school_website": "https://school.edu" (optional),
  "school_location": "Springfield, IL" (optional),
  "contact_email": "contact@school.edu" (optional),
  "principal_name": "Jane Principal" (optional)
}

Response:
{
  "success": true,
  "message": "School setup completed successfully",
  "school": {
    "id": 456,
    "name": "John Smith High School",
    "address": "123 Main Street, Springfield, IL 62701",
    "phone": "+1-217-555-0100",
    "website": "https://school.edu",
    "location": "Springfield, IL",
    "contactEmail": "contact@school.edu",
    "principalName": "Jane Principal"
  }
}
```

#### Get School Setup Status
```
GET /api/school/setup

Headers:
- Cookie: sessionId=<UUID>

Response:
{
  "success": true,
  "school": {
    "id": 456,
    "name": "John Smith High School",
    "address": "123 Main Street, Springfield, IL 62701",
    ...
  },
  "onboarding": {
    "schoolNameSet": true,
    "schoolAddressSet": true,
    "isComplete": true,
    "completedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Implementation Checklist

### Phase 1: Database Migration ✅
- [x] Create `sessions` table with indexes
- [x] Create `school_onboarding` table
- [x] Create `user_roles` table
- [x] Create `role_permissions` table
- [x] Create/enhance `audit_logs` table
- [x] Add columns to `users` table (phone, school_onboarded)

### Phase 2: Authentication Service ✅
- [x] `session.service.js` with core functions:
  - [x] `hashPassword()`
  - [x] `verifyPassword()`
  - [x] `createSession()`
  - [x] `validateSession()`
  - [x] `invalidateSession()`
  - [x] `findUserByIdentifier()`
  - [x] `authenticateUser()`
  - [x] `logAuditEvent()`

### Phase 3: API Endpoints ✅
- [x] `POST /api/auth/login` - Session-based login
- [x] `POST /api/auth/register` - Auto-login registration
- [x] `POST /api/auth/logout` - Session invalidation
- [ ] `PATCH /api/school/setup` - School configuration
- [ ] `GET /api/school/setup` - Get setup status

### Phase 4: Authentication Middleware
- [ ] Middleware to validate sessions on protected routes
- [ ] Extract user info from session headers
- [ ] Role-based route protection
- [ ] Public vs. protected route separation

### Phase 5: Frontend Updates
- [ ] Login form (username/email/phone field, password field)
- [ ] Registration form (email, username, password, optional phone)
- [ ] Dashboard (redirect target after login/registration)
- [ ] School setup form (name, address mandatory; others optional)
- [ ] Navigation with logout button
- [ ] Onboarding status banner on dashboard

### Phase 6: Migration of Existing Users
- [ ] Create safe migration script
- [ ] Identify first users per school → assign superadmin
- [ ] Auto-generate temporary passwords for existing users
- [ ] Create initial trial assignments
- [ ] Generate migration report

### Phase 7: Testing & Validation
- [ ] Test user registration (first user gets superadmin)
- [ ] Test user login (username/email/phone)
- [ ] Test session expiry and inactivity
- [ ] Test logout
- [ ] Test school setup endpoint
- [ ] Test audit logging
- [ ] Test role-based access
- [ ] Verify no infinite onboarding loops
- [ ] Load testing (session table queries)

---

## Security Considerations

### 1. Session Security
- ✅ httpOnly cookies (prevent XSS theft)
- ✅ secure flag (HTTPS only in production)
- ✅ sameSite=strict (prevent CSRF)
- ✅ Session ID as UUID (cryptographically secure)
- ✅ Expiry timestamps (prevent session reuse)

### 2. Password Security
- ✅ PBKDF2 with salt (consider bcryptjs for production)
- ✅ Minimum 8 characters enforced
- ✅ Never return password_hash in API responses
- ✅ Generic error messages (don't reveal valid usernames)

### 3. Audit Logging
- ✅ Immutable audit log (immutable=true, no updates)
- ✅ Captures: user_id, action, entity, timestamp, IP, user_agent
- ✅ JSONB storage for flexible change tracking
- ✅ Indexed on user_id, school_id, action, timestamp

### 4. Rate Limiting (TODO)
- [ ] Implement on `/api/auth/login` endpoint
- [ ] Prevent brute force attacks
- [ ] Lock account after N failed attempts
- [ ] Email notification on suspicious activity

### 5. 2FA / MFA (Optional)
- [ ] TOTP support
- [ ] Email verification
- [ ] SMS verification

---

## Files Modified / Created

### New Files
- `src/lib/auth/session.service.js` - Core session service
- `src/lib/auth/middleware.js` - Authentication middleware
- `src/app/api/school/setup/route.js` - School setup endpoint
- `database/migration_v0.0.0052_session_auth_redesign.sql` - Database schema
- `database/bash/apply_migration_v0.0.0052.sh` - Migration script

### Modified Files
- `src/app/api/auth/login/route.js` - New session-based login
- `src/app/api/auth/logout/route.js` - Session invalidation
- `src/app/api/auth/register/route.js` - Auto-login registration

---

## Next Steps

1. **Test API endpoints** with curl/Postman:
   ```bash
   # Register
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","username":"testuser","password":"TestPass123"}'

   # Login
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"identifier":"testuser","password":"TestPass123"}'

   # Setup school
   curl -X PATCH http://localhost:3000/api/school/setup \
     -H "Content-Type: application/json" \
     -H "Cookie: sessionId=<YOUR_SESSION_ID>" \
     -d '{"school_name":"Test School","school_address":"123 Main St"}'
   ```

2. **Implement frontend routes**:
   - `/login` - Login page
   - `/register` - Registration page
   - `/dashboard` - Main app (redirect after auth)
   - `/school-setup` - School configuration (optional)

3. **Migrate existing users**:
   - Run migration script
   - Assign roles to existing users
   - Generate temporary passwords
   - Notify users of new login flow

4. **Enable middleware** in `middleware.ts`/`middleware.js`

5. **Performance testing** on sessions table queries

---

## Rollback Plan

If issues arise:

1. Keep old JWT-based auth endpoints available
2. Add feature flag: `USE_SESSION_AUTH=true|false`
3. Support both authentication methods during transition
4. Gradual migration of user base (opt-in before mandatory)

---

## Monitoring & Debugging

### View Active Sessions
```sql
SELECT user_id, is_active, created_at, expires_at, last_activity 
FROM sessions 
WHERE is_active = TRUE 
ORDER BY created_at DESC;
```

### View Audit Trail
```sql
SELECT user_id, action, entity_type, created_at, ip_address 
FROM audit_logs 
ORDER BY created_at DESC 
LIMIT 50;
```

### View School Onboarding Status
```sql
SELECT so.*, s.name, s.address 
FROM school_onboarding so 
JOIN schools s ON so.school_id = s.id 
WHERE so.is_complete = FALSE;
```

---

**Version**: v0.0.0052  
**Status**: Implementation in Progress  
**Last Updated**: 2024-01-15
