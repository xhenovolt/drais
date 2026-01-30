# Quick Start: Session-Based Authentication v0.0.0052

## 🚀 What's New

The DRAIS authentication system has been completely redesigned for production-grade SaaS:

| Feature | Before | After |
|---------|--------|-------|
| **Auth Method** | JWT tokens (localStorage) | Sessions (httpOnly cookies) |
| **Login** | Email only | Username, Email, or Phone |
| **Registration** | Manual role selection | Auto-assigned based on order (first = superadmin) |
| **Onboarding** | Blocking (must complete 4 steps) | Decoupled (optional, non-blocking) |
| **Dashboard Access** | After onboarding | Immediate after registration |
| **Password** | No hashing rules | PBKDF2 with salt, 8+ chars |
| **Session Lifetime** | JWT expiry only | Explicit expiry (30/90 days) + inactivity (7 days) |
| **Audit Trail** | Limited | Comprehensive (all actions logged) |

---

## 🔐 Key Security Improvements

✅ **No XSS token theft** - Sessions are httpOnly (JavaScript can't access them)
✅ **CSRF protection** - sameSite=strict on cookies
✅ **Secure by default** - secure flag on HTTPS
✅ **Immutable audit logs** - all actions tracked permanently
✅ **IP & User-Agent logging** - suspicious activity detection
✅ **Automatic role assignment** - prevents privilege escalation
✅ **Inactivity timeout** - sessions expire after 7 days of inactivity

---

## 🛠️ API Endpoints

### Register (Auto-Login)
```bash
POST /api/auth/register

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "john",
    "password": "SecurePass123",
    "phone": "+1234567890"  # optional
  }'

Response:
{
  "success": true,
  "user": {
    "id": 123,
    "username": "john",
    "email": "john@example.com",
    "role": "superadmin"  # or "student" if not first user
  },
  "redirectTo": "/dashboard"
}

✅ Session cookie set automatically
```

### Login (Username, Email, or Phone)
```bash
POST /api/auth/login

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john",        # can be username, email, or phone
    "password": "SecurePass123",
    "stayLoggedIn": false        # optional (extends session to 90 days)
  }'

Response:
{
  "success": true,
  "user": {
    "id": 123,
    "username": "john",
    "email": "john@example.com"
  },
  "redirectTo": "/dashboard"
}

✅ Session cookie set automatically
```

### Logout
```bash
POST /api/auth/logout

curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: sessionId=<SESSION_ID>"

Response:
{
  "success": true,
  "redirectTo": "/login"
}

✅ Session cookie deleted
```

### School Setup (Optional, Non-Blocking)
```bash
PATCH /api/school/setup

curl -X PATCH http://localhost:3000/api/school/setup \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionId=<SESSION_ID>" \
  -d '{
    "school_name": "John Smith High School",
    "school_address": "123 Main Street, Springfield, IL",
    "school_phone": "+1-217-555-0100",       # optional
    "school_website": "https://school.edu",  # optional
    "school_location": "Springfield, IL",    # optional
    "contact_email": "contact@school.edu",   # optional
    "principal_name": "Jane Principal"       # optional
  }'

Response:
{
  "success": true,
  "school": {
    "name": "John Smith High School",
    "address": "123 Main Street, Springfield, IL"
  },
  "onboarding": {
    "isComplete": true
  }
}

✅ Must have school_name + school_address (others optional)
```

### Get School Setup Status
```bash
GET /api/school/setup

curl -X GET http://localhost:3000/api/school/setup \
  -H "Cookie: sessionId=<SESSION_ID>"

Response:
{
  "success": true,
  "school": {
    "name": "John Smith High School",
    "address": "123 Main Street"
  },
  "onboarding": {
    "isComplete": true,
    "completedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 📊 Session Lifecycle

### 1. User Registers
```
→ Email + Username + Password submitted
→ System creates users, schools, user_roles, sessions records
→ First user = superadmin, others = student
→ Free trial auto-assigned (14 days)
→ sessionId cookie set
→ Redirects to /dashboard
```

### 2. User Logs In Later
```
→ Identifier (username/email/phone) + password
→ System looks up user
→ Password verified
→ New session created
→ sessionId cookie set
→ Redirects to /dashboard
```

### 3. Middleware Validates Session
```
On every request:
→ sessionId cookie read
→ SELECT sessions WHERE id = $1 AND is_active = TRUE AND expires_at > NOW
→ Check if inactivity > 7 days (optional)
→ Update last_activity
→ User info attached to request
→ Route handler processes normally
```

### 4. Session Expires
```
Auto-expiry on 30 days (or 90 with stay_logged_in)
OR after 7 days of inactivity
→ Session automatically invalid
→ Next request redirects to /login
→ sessionId cookie cleared
```

### 5. User Logs Out
```
→ POST /api/auth/logout
→ System marks session as_active = FALSE
→ Session cookie deleted
→ Redirects to /login
```

---

## 🗂️ Database Tables

### New Tables Created

**sessions** - Active user sessions
```
id (UUID) | user_id | ip_address | user_agent | created_at | last_activity | 
expires_at | stay_logged_in | is_active | logged_out_at
```

**school_onboarding** - Track school setup progress
```
school_id | school_name_set | school_address_set | contact_info_set | 
location_details_set | policies_set | is_complete | completed_at
```

**user_roles** - User-school-role relationships
```
user_id | school_id | role_name | assigned_by | assigned_at | is_primary
```

**role_permissions** - RBAC permission definitions
```
role_name | permission
```

**audit_logs** - Immutable action log
```
user_id | school_id | action | entity_type | entity_id | old_values | 
new_values | ip_address | user_agent | created_at
```

### Modified Tables

**users** - Added columns
```
phone VARCHAR(20)
school_onboarded BOOLEAN DEFAULT FALSE
```

---

## 🧪 Testing the Implementation

### Start Server
```bash
cd /home/xhenvolt/projects/drais
npm run dev
# http://localhost:3000
```

### Test 1: Register First User (becomes superadmin)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.edu",
    "username": "admin",
    "password": "Admin123"
  }'

# Response should include: "role": "superadmin"
```

### Test 2: Register Second User (becomes student)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@school.edu",
    "username": "student",
    "password": "Student123"
  }'

# Response should include: "role": "student"
```

### Test 3: Login with Username
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin",
    "password": "Admin123"
  }'

# Response should include session in cookie
```

### Test 4: Setup School
```bash
SESSION_ID="<from previous response cookie>"

curl -X PATCH http://localhost:3000/api/school/setup \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionId=$SESSION_ID" \
  -d '{
    "school_name": "Springfield High",
    "school_address": "123 Main St, Springfield, IL"
  }'

# Response: "isComplete": true
```

### Test 5: Verify Audit Trail
```bash
psql "$DATABASE_URL" -c "SELECT action, user_id, entity_type, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 10;"

# Should see: user_registered, login, school_setup_completed
```

---

## 🔄 Migration from Old Auth

For existing users:

1. **Existing JWT tokens no longer work**
   - Old endpoints: `/api/auth/login` (JWT) → New endpoint: `/api/auth/login` (Session)
   - Update frontend to use new login endpoint

2. **Feature Flag (Optional)**
   - Support both old JWT and new sessions temporarily
   - Gradual migration of user base
   - Add: `USE_SESSION_AUTH=true` environment variable

3. **Password Reset**
   - Existing users can use `/api/auth/forgot-password` (if implemented)
   - OR admin can generate temporary password

4. **Role Migration**
   - Run migration script to assign roles to existing users
   - First user per school = superadmin
   - Others = student (changeable by superadmin)

---

## 🚨 Common Issues & Solutions

### Issue: "Invalid credentials" after registration
**Solution**: Check that password is 8+ characters and password_hash was stored

### Issue: Session cookie not being set
**Solution**: Ensure `secure=false` for development (localhost), `true` for HTTPS production

### Issue: Session expires too quickly
**Solution**: Session expires after 7 days of inactivity OR 30 days absolute. Check if:
- Client is making requests (updates last_activity)
- Database `expires_at` timestamp is correct

### Issue: Onboarding form still blocking dashboard
**Solution**: This is intentional in NEW design. Onboarding is non-blocking:
- Dashboard always accessible
- School setup is optional status indicator
- Remove any middleware that checks `onboarding_completed`

### Issue: User role not assigned correctly
**Solution**: Check user_roles table:
```sql
SELECT * FROM user_roles WHERE user_id = <id>;
```
First user per school should have `role_name = 'superadmin'`

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `IMPLEMENTATION_v0.0.0052_SESSION_REDESIGN.md` | Full technical documentation |
| `SESSION_AUTH_IMPLEMENTATION_SUMMARY_v0.0.0052.md` | What was changed |
| `test-session-auth-v0.0.0052.sh` | Test script (run after npm run dev) |

---

## ✅ Production Checklist

- [ ] All API endpoints tested with curl
- [ ] Database migration applied to production DB
- [ ] Frontend login/register pages updated
- [ ] Dashboard route redirects to /login if not authenticated
- [ ] School setup optional form created
- [ ] Audit logging verified in database
- [ ] Existing users migrated (roles assigned, sessions created)
- [ ] Environment variables set (NODE_ENV=production)
- [ ] HTTPS enabled (secure=true for cookies)
- [ ] Load testing on sessions table
- [ ] Rate limiting on /api/auth/login (prevent brute force)
- [ ] Email verification implemented
- [ ] Password reset flow implemented
- [ ] 2FA/MFA (optional but recommended)

---

## 🆘 Debugging

### View Active Sessions
```sql
SELECT user_id, is_active, created_at, expires_at, last_activity 
FROM sessions 
WHERE is_active = TRUE 
ORDER BY created_at DESC;
```

### View User Audit Trail
```sql
SELECT action, entity_type, created_at, ip_address 
FROM audit_logs 
WHERE user_id = <id> 
ORDER BY created_at DESC;
```

### View School Onboarding Status
```sql
SELECT so.*, s.name 
FROM school_onboarding so 
JOIN schools s ON so.school_id = s.id 
WHERE so.is_complete = FALSE;
```

### Check User Roles
```sql
SELECT ur.*, u.username, r.role_name 
FROM user_roles ur 
JOIN users u ON ur.user_id = u.id 
WHERE ur.is_primary = TRUE;
```

---

## 📞 Support

For issues or questions:

1. **Check logs**: `npm run dev` output or server logs
2. **Check database**: Verify tables exist and have data
3. **Check endpoints**: Use curl to test API responses
4. **Check migrations**: Verify `sessions`, `school_onboarding`, `user_roles` tables exist
5. **Read documentation**: See `IMPLEMENTATION_v0.0.0052_SESSION_REDESIGN.md`

---

**Version**: v0.0.0052  
**Status**: ✅ Complete & Ready to Test  
**Last Updated**: 2024-01-15  
**Next Step**: Start server with `npm run dev` and run test script
