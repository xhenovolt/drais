# Backend Setup Guide

## Installation

Install required backend packages:

```bash
npm install mysql2 mongodb bcryptjs jsonwebtoken zod axios nanoid dotenv
```

## MySQL Database Setup

### 1. Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE drais CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit MySQL
exit
```

### 2. Import SQL Schemas

**Automated Import (Recommended):**

```bash
cd database
./import_all_schemas.sh
```

This script will:
- Drop and recreate the `drais` database
- Import all 6 schema files in the correct order
- Verify 162 tables were created successfully

**Manual Import:**

If you prefer to import manually, schemas MUST be imported in this exact order:

```bash
cd database

# 1. Base schema (77 core tables: schools, students, staff, classes, etc.)
mysql -u root -p drais < original.sql

# 2. Schema alterations (adds multi-tenancy columns + 9 RBAC tables)
mysql -u root -p drais < database_schema_alterations_v0.1.02_FIXED.sql

# 3. Additional tables (25 tables: attendance, timetables, homework, etc.)
mysql -u root -p drais < database_schema_new_tables_v0.1.01.sql

# 4. Module-specific tables (26 tables: library, inventory, transport, etc.)
mysql -u root -p drais < database_schema_modules_complete_v0.2.00.sql

# 5. Tahfiz enhanced tables (25 tables: advanced Quran memorization features)
mysql -u root -p drais < tahfiz_module_complete.sql

# Note: database_schema_finance_module.sql is empty (finance tables are in original.sql)
```

**Schema Structure:**
- **original.sql**: Base school management system (77 tables including basic finance and tahfiz)
- **alterations**: Adds school_id, user_id, timestamps to existing tables + new RBAC tables
- **new_tables**: Additional modules (attendance, homework, announcements, etc.)
- **modules_complete**: Library, inventory, transport, health records, etc.
- **tahfiz_complete**: Enhanced Quran memorization tracking (book structures, sessions, revisions)

**Validation:**

Verify the import was successful:

```bash
cd database
./validate_schemas.sh
```

This checks for:
- ✅ No duplicate table creations
- ✅ All ALTER statements reference existing tables
- ✅ Total unique tables: 162

## Environment Configuration

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 2. Update Environment Variables

Edit `.env.local` with your configuration:

```env
# Database Configuration
DB_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password_here
MYSQL_DATABASE=drais

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
```

**⚠️ IMPORTANT:** Generate a strong JWT secret:

```bash
# Generate a random JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+256700000000",
  "role": "school_admin"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "SecurePass123!"
}
```

### Schools

#### Create School
```http
POST /api/schools/create
Content-Type: application/json

{
  "school_code": "SCH001",
  "school_name": "Demo School",
  "school_address": "123 Education Street",
  "school_city": "Kampala",
  "school_country": "Uganda",
  "school_phone": "+256700000000",
  "school_email": "info@demoschool.com",
  "owner_email": "owner@demoschool.com",
  "owner_password": "SecurePass123!",
  "owner_first_name": "Jane",
  "owner_last_name": "Smith",
  "owner_phone": "+256700000001",
  "subscription_type": "professional",
  "subscription_start_date": "2024-01-01",
  "subscription_end_date": "2024-12-31"
}
```

#### Get School by ID
```http
GET /api/schools/[school_id]
```

### Users

#### List Users
```http
GET /api/users?page=1&limit=20&school_id=xxx&role=teacher&search=john
Authorization: Bearer <token>
```

#### Create User
```http
POST /api/users
Content-Type: application/json
Authorization: Bearer <token>

{
  "school_id": "school_id_here",
  "email": "teacher@school.com",
  "password": "SecurePass123!",
  "first_name": "Mary",
  "last_name": "Johnson",
  "phone": "+256700000002",
  "role": "teacher",
  "is_active": true
}
```

## Testing the Backend

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test Database Connection

```bash
curl http://localhost:3000/api/test-db
```

Expected response:
```json
{
  "success": true,
  "data": {
    "database": "mysql",
    "connected": true,
    "testQuery": {"1": 1},
    "message": "Database connection successful"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. Test User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "first_name": "Test",
    "last_name": "User",
    "phone": "+256700000000",
    "role": "school_admin"
  }'
```

### 4. Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

Save the returned token for authenticated requests.

### 5. Test School Creation

```bash
curl -X POST http://localhost:3000/api/schools/create \
  -H "Content-Type: application/json" \
  -d '{
    "school_code": "TEST001",
    "school_name": "Test School",
    "school_city": "Kampala",
    "school_country": "Uganda",
    "owner_email": "owner@test.com",
    "owner_password": "Owner123!",
    "owner_first_name": "School",
    "owner_last_name": "Owner",
    "subscription_type": "trial"
  }'
```

### 6. Test Authenticated Endpoints

```bash
# Get users (requires authentication)
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Switching (MySQL ↔ MongoDB)

The backend supports both MySQL and MongoDB through a universal adapter.

### Switch to MongoDB

1. Update `.env.local`:
```env
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/drais
```

2. Install MongoDB (if not installed):
```bash
# Ubuntu/Debian
sudo apt install mongodb

# macOS
brew install mongodb-community
```

3. Start MongoDB:
```bash
# Ubuntu/Debian
sudo systemctl start mongodb

# macOS
brew services start mongodb-community
```

4. Restart your Next.js server:
```bash
npm run dev
```

### Switch Back to MySQL

1. Update `.env.local`:
```env
DB_TYPE=mysql
```

2. Restart your Next.js server

## User Roles

The system supports the following roles:

- `super_admin` - Full system access across all schools
- `school_admin` - Full access within their school
- `teacher` - Access to teaching-related features
- `accountant` - Access to financial features
- `librarian` - Access to library features
- `student` - Access to student portal

## API Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Security Best Practices

1. **Never commit `.env.local`** - Keep it in `.gitignore`
2. **Use strong JWT secrets** - Generate with crypto.randomBytes(64)
3. **Enable HTTPS in production** - Use SSL/TLS certificates
4. **Implement rate limiting** - Prevent brute force attacks
5. **Validate all inputs** - Use Zod schemas consistently
6. **Hash passwords** - Always use bcrypt (never store plain text)
7. **Sanitize SQL inputs** - Use parameterized queries (already implemented in db adapter)

## Troubleshooting

### Database Connection Issues

**MySQL connection refused:**
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql
```

**Authentication failed:**
```bash
# Reset MySQL root password if needed
sudo mysql -u root

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;
exit
```

### JWT Token Issues

**Token expired:**
- Login again to get a new token
- Adjust `JWT_EXPIRES_IN` in `.env.local` if needed

**Invalid token:**
- Check that `JWT_SECRET` matches between token generation and validation
- Ensure token is sent in `Authorization: Bearer <token>` header

### Schema Import Errors

**Table already exists:**
```bash
# Drop database and recreate (⚠️ WARNING: Deletes all data)
mysql -u root -p -e "DROP DATABASE drais; CREATE DATABASE drais CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Re-import schemas
mysql -u root -p drais < school.sql
# ... continue with other schemas
```

## Next Steps

1. ✅ Backend infrastructure complete
2. ✅ All core API endpoints implemented
3. ✅ Database adapter supports MySQL and MongoDB
4. 📝 Build additional module-specific endpoints (fees, attendance, etc.)
5. 📝 Add file upload support for documents/images
6. 📝 Implement email/SMS notifications
7. 📝 Add payment gateway integration (MTN MoMo, Airtel Money)
8. 📝 Create API documentation with Swagger/OpenAPI
9. 📝 Add comprehensive unit and integration tests
10. 📝 Deploy to production server

## Support

For issues or questions:
- Check troubleshooting section above
- Review API endpoint examples
- Test with curl commands
- Check server logs: `npm run dev` output
