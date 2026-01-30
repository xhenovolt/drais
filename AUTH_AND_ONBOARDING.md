# AUTHENTICATION & ONBOARDING

**Version:** 0.0.0050+  
**Status:** Session-based authentication (no JWT), fully functional onboarding pipeline

## Authentication Overview

### Strategy: Session-Based (No JWT)
DRAIS uses HTTP-only cookies with server-side session storage instead of JWT tokens for enhanced security.

**Advantages:**
- ✅ CSRF protection via SameSite cookies
- ✅ Session revocation (logout immediately effective)
- ✅ No token expiration edge cases
- ✅ Server-side control of user permissions
- ✅ Reduced client-side attack surface

### Session Storage
Sessions are stored in the `user_sessions` table with:
- `user_id` - User identifier
- `session_token` - HTTP-only cookie value
- `ip_address` - Client IP (for anomaly detection)
- `device_type` - Device classification (mobile/desktop/tablet)
- `last_activity` - For session timeout management
- `expires_at` - Session expiration timestamp

**Default Session Timeout:** 24 hours (86400000ms)  
**Configuration:** `SESSION_TIMEOUT` in `.env.local`

## Login Flow

### 1. Authentication Endpoint
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Steps:**
1. Validate input (email format, password non-empty)
2. Look up user by email: `SELECT * FROM users WHERE email = $1`
3. Verify password using bcryptjs: `bcryptjs.compare(password, user.password_hash)`
4. If invalid: Return 401 "Invalid credentials"
5. If valid: Create session record in `user_sessions` table
6. Set HTTP-only cookie: `Set-Cookie: sessionId=TOKEN; HttpOnly; Secure; SameSite=Lax`
7. Return user data (without password hash)

### 2. Session Cookie
```
Set-Cookie: sessionId=abc123def456; 
            Path=/; 
            HttpOnly;           -- Not accessible via JavaScript
            Secure;             -- HTTPS only (production)
            SameSite=Lax;       -- CSRF protection
            Max-Age=86400
```

### 3. Middleware: Session Validation
Every authenticated request includes middleware that:
1. Reads `sessionId` from cookies
2. Looks up session in `user_sessions` table
3. Verifies `expires_at > NOW()`
4. Validates IP address (optional: allow IP changes for mobile)
5. Updates `last_activity` timestamp
6. Attaches `req.user` object to request
7. If invalid: Return 401 "Session expired"

**Code Pattern:**
```javascript
// src/lib/middleware/auth.js
export async function withAuth(req, res, next) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return res.status(401).json({ error: 'No session' });
  
  const session = await db.findOne('user_sessions', { session_token: sessionId });
  if (!session || new Date(session.expires_at) < new Date()) {
    return res.status(401).json({ error: 'Session expired' });
  }
  
  const user = await db.findOne('users', { id: session.user_id });
  req.user = user;
  next();
}
```

## Logout Flow

### 1. Logout Endpoint
```
POST /api/auth/logout
```

**Steps:**
1. Read `sessionId` from cookies
2. Delete session record: `DELETE FROM user_sessions WHERE session_token = $1`
3. Clear cookie: `Set-Cookie: sessionId=; Max-Age=0`
4. Redirect to login page

**Result:** Session immediately invalidated on server, cookie removed from client

### 2. Session Cleanup
Sessions older than `SESSION_TIMEOUT` should be periodically deleted:
```sql
DELETE FROM user_sessions WHERE expires_at < NOW();
```

## Onboarding Pipeline

### Overview
New users are guided through a structured onboarding process before accessing the main application. Progress is tracked in the `onboarding_steps` table.

### Onboarding Steps (Sequential)
Defined in system as:
1. **verify_email** - Confirm email address
2. **create_profile** - Fill in personal information
3. **school_selection** - Select or create school
4. **role_assignment** - Assign user role (admin/teacher/student/parent)
5. **basic_setup** - Configure initial preferences
6. **payment_selection** - Choose plan or start free trial

**Each step has status:** pending → in_progress → completed (or skipped)

### Onboarding Check Endpoint
```
GET /api/onboarding/status
```

**Returns:**
```json
{
  "is_complete": false,
  "current_step": "create_profile",
  "progress": 30,
  "steps": [
    { "name": "verify_email", "status": "completed" },
    { "name": "create_profile", "status": "in_progress" },
    { "name": "school_selection", "status": "pending" },
    { "name": "role_assignment", "status": "pending" },
    { "name": "basic_setup", "status": "pending" },
    { "name": "payment_selection", "status": "pending" }
  ]
}
```

**Query:**
```sql
SELECT step_name, status FROM onboarding_steps 
WHERE user_id = $1 
ORDER BY step_order;
```

### Updating Onboarding Progress
```
POST /api/onboarding/step
{
  "step_name": "create_profile",
  "status": "completed",
  "step_data": {
    "full_name": "John Doe",
    "phone": "+256-700-123456"
  }
}
```

**Steps:**
1. Validate step_name exists
2. Check status is valid (pending/in_progress/completed/skipped)
3. Upsert into `onboarding_steps`:
   ```sql
   INSERT INTO onboarding_steps (user_id, step_name, status, step_data, completed_at)
   VALUES ($1, $2, $3, $4, CASE WHEN $3='completed' THEN NOW() ELSE NULL END)
   ON CONFLICT (user_id, step_name) DO UPDATE SET
     status = EXCLUDED.status,
     step_data = EXCLUDED.step_data,
     completed_at = EXCLUDED.completed_at;
   ```
4. Return updated step data

### Onboarding Completion
```
POST /api/onboarding/complete
```

**Triggers:**
1. All required steps marked as completed
2. User profile filled in (user_profiles table populated)
3. Payment status set (trial or paid)
4. Onboarding completion flag set in users table

**Actions:**
1. Update `users.onboarding_completed_at = NOW()`
2. Check trial eligibility → Create user_trials record if applicable
3. Redirect to dashboard

## Post-Login Access Control

### Access Decision Flow
```
User logs in
    ↓
Create session
    ↓
Check onboarding completion
    ├─ If NOT complete: Redirect to /onboarding
    ├─ If complete: Continue
    ↓
Check payment/trial status
    ├─ If trial active (user_trials.trial_end_date > NOW()): Grant access
    ├─ If paid plan active (user_payment_plans.is_active=true): Grant access
    ├─ If neither: Redirect to /upgrade
    ↓
Check user role permissions
    └─ Enforce role-based access control (RBAC)
    ↓
Grant dashboard access
```

### Check Payment Access Endpoint
```
GET /api/auth/check-access
```

**Query:**
```sql
SELECT 
  u.id,
  u.onboarding_completed_at,
  ut.is_active as trial_active,
  ut.trial_end_date,
  upp.is_active as has_paid_plan
FROM users u
LEFT JOIN user_trials ut ON u.id = ut.user_id
LEFT JOIN user_payment_plans upp ON u.id = upp.user_id AND upp.is_active=true
WHERE u.id = $1;
```

**Response Logic:**
```javascript
if (!user.onboarding_completed_at) {
  return { status: 'redirect', target: '/onboarding' };
}

const trialActive = user.trial_active && 
                    new Date(user.trial_end_date) > new Date();
const hasPaidPlan = user.has_paid_plan === true;

if (trialActive || hasPaidPlan) {
  return { status: 'allowed', trial_expires: user.trial_end_date };
} else {
  return { status: 'redirect', target: '/upgrade' };
}
```

## User Roles & Permissions

### Roles
- **Admin** - Full system access, school management
- **Teacher** - Class teaching, assignments, grading
- **Student** - Learning, submissions, grades
- **Parent** - View child progress, communicate with teachers
- **Staff** - Administrative support (varies by role)

### Role Enforcement
```sql
-- Users table stores role
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'student';

-- Middleware checks role on protected routes
SELECT COUNT(*) FROM users 
WHERE id = $1 AND role IN ('admin', 'teacher');
```

## Security Considerations

### Password Hashing
```javascript
// Register
const saltRounds = 10;
const hashedPassword = await bcryptjs.hash(password, saltRounds);
await db.insert('users', { email, password_hash: hashedPassword });

// Login
const match = await bcryptjs.compare(passwordAttempt, user.password_hash);
```

### HTTPS Requirement
- **Production:** Secure cookies require HTTPS
- **Development:** Can use http://localhost with Secure flag disabled
- Configure in next.config.js or middleware

### Session Security
- HTTP-only cookies prevent XSS token theft
- SameSite=Lax prevents CSRF attacks
- IP validation detects hijacked sessions
- Max session duration prevents indefinite access

### SQL Injection Prevention
- All queries use parameterized statements ($1, $2 for PostgreSQL)
- Never concatenate user input into SQL strings
- Use query builder or ORM layer

## Troubleshooting

### "Invalid credentials"
- User email not found in database
- Password incorrect
- User account inactive/deleted

### "Session expired"
- Session exceeded 24-hour timeout
- Logout was called previously
- Session was manually deleted from database

### "Onboarding incomplete"
- User has not completed required steps
- Check `onboarding_steps` table for pending steps
- Resume onboarding from last completed step

### "Access denied" (payment required)
- Trial period expired: Check `user_trials.trial_end_date`
- No paid plan: Check `user_payment_plans.is_active`
- Upgrade user to plan or extend trial manually

---

**Next Steps:**
- See PAYMENTS_AND_TRIALS.md for payment flow details
- See DEPLOYMENT_AND_OPERATIONS.md for deployment checklist
- Review src/lib/services/onboarding.service.js for implementation
