# DRAIS Authentication System Documentation

**Version:** 0.0.0042  
**Date:** December 6, 2025

## Overview

DRAIS now features a complete JWT-based authentication system with:

- ✅ Access & Refresh tokens (15m / 7d)
- ✅ HttpOnly secure cookies
- ✅ Role-based access control (RBAC)
- ✅ Database-agnostic design (MySQL ↔ MongoDB switchable)
- ✅ Automatic token refresh
- ✅ Frontend auth context & hooks
- ✅ Route protection middleware

---

## Architecture

### Backend Stack
- **JWT**: jsonwebtoken (access & refresh tokens)
- **Password Hashing**: bcryptjs (10 salt rounds)
- **Cookies**: cookie-parser (HttpOnly, Secure, SameSite)
- **Database**: Universal adapter (MySQL/MongoDB)

### Frontend Stack
- **API Client**: axios with interceptors
- **Auth Context**: React Context API
- **Route Protection**: Next.js middleware
- **State Management**: localStorage + React state

---

## Environment Variables

Generated secure secrets are in `.env`:

```env
# JWT Secrets (auto-generated)
JWT_ACCESS_SECRET=<64-char cryptographic secret>
JWT_REFRESH_SECRET=<64-char cryptographic secret>
SESSION_SECRET=<48-char cryptographic secret>

# Token Expiry
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

# Password Hashing
BCRYPT_SALT_ROUNDS=10

# Database (switchable)
DB_TYPE=mysql  # or mongodb
```

**⚠️ Never commit `.env` to version control!**

---

## API Endpoints

### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "role": "client",
  "school_id": null
}
```

**Validation:**
- Email must be valid format
- Password: min 8 chars, 1 uppercase, 1 number
- Role: `super_admin`, `school_admin`, `admin`, `teacher`, `staff`, `student`, `parent`, `client`

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "client",
      "school_id": null,
      "name": "John Doe"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": "15m"
    }
  }
}
```

**Sets Cookies:**
- `accessToken` (HttpOnly, 15 min)
- `refreshToken` (HttpOnly, 7 days)

---

### 2. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",  // or username
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "tokens": { ... }
  }
}
```

**Updates:**
- `last_login` timestamp in database
- Sets HttpOnly cookies

---

### 3. Refresh Token
**POST** `/api/auth/refresh`

**Cookies Required:**
- `refreshToken`

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "new_token...",
      "refreshToken": "new_refresh_token...",
      "expiresIn": "15m"
    }
  }
}
```

**Features:**
- Token rotation (issues new refresh token)
- Updates cookies automatically

---

### 4. Logout
**POST** `/api/auth/logout`

**Cookies Required:**
- `refreshToken` (for invalidation)

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Actions:**
- Invalidates refresh token in database
- Clears all auth cookies

---

## Frontend Usage

### 1. Login Page

```javascript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (formData) => {
    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      router.push('/dashboard');
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 2. Protected Pages

```javascript
'use client';

import { useRequireAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, loading } = useRequireAuth();

  if (loading) return <div>Loading...</div>;

  return <div>Welcome {user.name}!</div>;
}
```

### 3. Role-Based Pages

```javascript
'use client';

import { useRequireRole } from '@/contexts/AuthContext';

export default function AdminPage() {
  const { user, loading } = useRequireRole(['admin', 'super_admin']);

  if (loading) return <div>Loading...</div>;

  return <div>Admin Panel</div>;
}
```

### 4. Manual API Calls

```javascript
import { api, handleApiError } from '@/lib/api/client';

// Login
const response = await api.auth.login({ email, password });

// Register
const response = await api.auth.register(userData);

// Get user profile (protected)
try {
  const response = await api.users.getProfile();
  console.log(response.data);
} catch (error) {
  const err = handleApiError(error);
  console.error(err.message);
}
```

---

## Protecting API Routes

### Method 1: Using Middleware

```javascript
import { authMiddleware, adminOnly } from '@/lib/middleware/auth.middleware';

// Any authenticated user
export const GET = authMiddleware(async (request, context, user) => {
  return NextResponse.json({ message: `Hello ${user.username}` });
});

// Admin only
export const DELETE = adminOnly(async (request, context, user) => {
  // Only admins can access
  return NextResponse.json({ message: 'Deleted' });
});
```

### Method 2: Manual Protection

```javascript
import { requireAuth, requireRole } from '@/lib/auth/jwt-enhanced';

export async function GET(request) {
  try {
    const user = await requireAuth(request);
    requireRole(user, ['admin', 'teacher']);

    return NextResponse.json({ data: 'Protected data' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
```

---

## Route Protection (Next.js Middleware)

File: `middleware.js`

### Public Routes (no auth required)
- `/`, `/features`, `/pricing`, `/contact`, `/blog`, etc.

### Auth Routes (redirect if logged in)
- `/auth/login`, `/auth/register`

### Protected Routes (require auth)
- `/dashboard`, `/students`, `/classes`, etc.

### Role-Based Routes

| Route | Allowed Roles |
|-------|---------------|
| `/settings`, `/roles`, `/audit-logs` | admin, school_admin, super_admin |
| `/teacher/*`, `/ai-teacher/*` | teacher+ |
| `/staff/*`, `/attendance` | staff+ |

---

## Database Compatibility

### MySQL
```env
DB_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_DATABASE=drais
```

**Tables Used:**
- `users` - User accounts
- `refresh_tokens` - Token storage (optional)

### MongoDB
```env
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/drais
```

**Collections Used:**
- `users`
- `refresh_tokens`

**Switching:** Just change `DB_TYPE` in `.env` - code is database-agnostic!

---

## Security Features

### 1. Password Security
- ✅ bcrypt hashing (10 rounds)
- ✅ Minimum 8 characters
- ✅ Requires uppercase + number
- ✅ Never stored in plain text

### 2. Token Security
- ✅ Separate access & refresh tokens
- ✅ Short-lived access (15 min)
- ✅ Long-lived refresh (7 days)
- ✅ Cryptographically strong secrets (64 bytes)
- ✅ Token rotation on refresh

### 3. Cookie Security
- ✅ HttpOnly (no JavaScript access)
- ✅ Secure in production (HTTPS only)
- ✅ SameSite=lax (CSRF protection)
- ✅ Path=/ (site-wide)

### 4. Input Validation
- ✅ Email format validation
- ✅ Password strength validation
- ✅ Role validation
- ✅ SQL injection protection (parameterized queries)

---

## Testing

### Run Automated Tests

```bash
cd /home/xhenvolt/projects/drais
chmod +x tests/test-auth.sh
./tests/test-auth.sh
```

**Tests:**
1. ✅ Database connection
2. ✅ User registration
3. ✅ Duplicate prevention
4. ✅ Login (correct password)
5. ✅ Login (wrong password)
6. ✅ Token refresh
7. ✅ Logout
8. ✅ Protected route access

### Manual Testing

```bash
# Start dev server
npm run dev

# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"Test123!","name":"Test User"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Test refresh (using cookies)
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt

# Test logout
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

---

## Troubleshooting

### Issue: "Authentication required"
**Solution:** Check if access token cookie is set and not expired

### Issue: "Invalid or expired token"
**Solution:** Token might be expired. Try refreshing or logging in again

### Issue: "Access denied" (403)
**Solution:** User doesn't have required role. Check role-based permissions

### Issue: Database connection error
**Solution:** Verify `DB_TYPE` in `.env` and database credentials

### Issue: Tokens not refreshing
**Solution:** Check `refresh_tokens` table exists or token storage is working

---

## Migration Guide

### From Old JWT System

**Old system used:**
- Single JWT_SECRET
- Simple token generation
- No refresh tokens

**New system requires:**
1. Run `node scripts/generate-jwt-secrets.js`
2. Update API calls to use new endpoints
3. Update frontend to use AuthContext
4. Add middleware to protected routes

### Code Changes

**Before:**
```javascript
import { generateToken } from '@/lib/auth/jwt';
const token = generateToken({ userId, email, role });
```

**After:**
```javascript
import { generateTokens } from '@/lib/auth/jwt-enhanced';
const { accessToken, refreshToken } = generateTokens(user);
```

---

## Next Steps

1. **Add Two-Factor Authentication (2FA)**
   - TOTP support
   - SMS verification

2. **Social Login**
   - Google OAuth
   - GitHub OAuth

3. **Password Reset Flow**
   - Email verification
   - Secure reset tokens

4. **Session Management**
   - Active sessions list
   - Logout from all devices

5. **Audit Logging**
   - Track login attempts
   - Failed auth attempts
   - IP tracking

---

## Support

**Documentation:** `/docs/auth`  
**API Tests:** `tests/test-auth.sh`  
**Backend Setup:** `BACKEND_SETUP.md`

**Created:** December 6, 2025  
**Version:** 0.0.0042
