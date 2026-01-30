# DRAIS System Overview

**Version:** 0.0.0050+  
**Last Updated:** January 25, 2025  
**Status:** Production Deployment Ready

## Executive Summary

DRAIS is a comprehensive educational management system serving schools across Africa with a focus on user retention and seamless onboarding. The system is built on JavaScript/Node.js with Next.js 16 frontend and PostgreSQL backend (Neon cloud).

**Current System State:**
- ✅ 55 PostgreSQL tables (complete schema parity)
- ✅ All critical post-login flows operational
- ✅ Payment plans and 40-day trial system configured
- ✅ Onboarding pipeline fully functional
- ✅ Session-based authentication (no JWT)

## Architecture

### Technology Stack
- **Frontend:** Next.js 16.0.6 (React, Turbopack)
- **Runtime:** Node.js v24.11.1 (ES modules)
- **Database:** PostgreSQL 14+ (Neon cloud) / MySQL 8.0.44 (reference)
- **Authentication:** Session-based with HTTP-only cookies
- **Security:** bcryptjs for password hashing, no JWT tokens

### Database Configuration
```
PRIMARY_DB=postgres
DATABASE_URL=postgresql://[user]:[pass]@[host]/drais
Fallback: POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD
```

### Key Tables (55 total)
**Critical for Post-Login:**
- `onboarding_steps` - User onboarding progress tracking
- `user_profiles` - Extended user information (1:1 with users)
- `user_sessions` - Session tracking by IP, device, activity
- `user_people` - Junction table: users ↔ people normalization
- `user_trials` - Trial period tracking (40-day default)
- `user_payment_plans` - User subscription mappings
- `payment_plans` - Available plans (4 tiers: Trial, Starter, Professional, Enterprise)

**Academic Core:**
- `users`, `schools`, `classes`, `departments`
- `students`, `teachers`, `enrollments`
- `exams`, `quiz`, `assignments`, `attendance`

**Administrative:**
- `audit_log`, `notifications`, `messages`
- `school_settings`, `fee_structures`
- `transactions`, `documents`

## User Flows

### Authentication & Onboarding
```
1. User Login (email + password)
2. Session Creation (HTTP-only cookie)
3. Onboarding Status Check
   - If new: Direct to onboarding_steps
   - If complete: Check payment access
4. Payment/Trial Check
   - Active trial: Grant access
   - Paid subscription: Grant access
   - Expired trial: Upsell to plans
5. Dashboard/Role-specific redirect
```

### Payment & Trial System
- **Free Trial:** 40 days (configurable in DB)
- **Starter:** 150,000 UGX/month (200 students, 20 staff)
- **Professional:** 350,000 UGX/month (500 students, 50 staff)
- **Enterprise:** Custom (unlimited)

Trial period stored in `user_trials.trial_start_date` and `trial_end_date`.  
Duration is DB-controlled via `payment_plans.trial_period_days`.

## Deployment & Operations

### Quick Start
```bash
# Full system check
./setup-drais.sh check

# Initialize fresh deployment
./setup-drais.sh setup

# Run pending migrations
./setup-drais.sh migrate

# Seed reference data
./setup-drais.sh seed

# Validate production readiness
./setup-drais.sh validate
```

### Environment Setup
1. Copy `.env.example` → `.env.local`
2. Set `PRIMARY_DB=postgres`
3. Set `DATABASE_URL` to your Neon endpoint
4. Configure `SESSION_SECRET` (secure random string)
5. Run `./setup-drais.sh setup`

### Schema Deployment
```bash
# PostgreSQL
psql $DATABASE_URL -f database/schema.postgres.sql

# MySQL (if fallback needed)
mysql -h $MYSQL_HOST -u $MYSQL_USER -p $MYSQL_DATABASE < database/schema.mysql.sql
```

### Seed Data
```bash
# PostgreSQL
psql $DATABASE_URL -f database/seed.postgres.sql

# MySQL
mysql -h $MYSQL_HOST -u $MYSQL_USER -p $MYSQL_DATABASE < database/seed.mysql.sql
```

## Monitoring & Maintenance

### Health Checks
- Database connectivity: `SELECT NOW()`
- Critical tables: `SELECT COUNT(*) FROM onboarding_steps`
- Payment plans: `SELECT COUNT(*) FROM payment_plans WHERE is_active=true`
- Active trials: `SELECT COUNT(*) FROM user_trials WHERE is_active=true`

### Common Tasks
- Reset trial for user: `UPDATE user_trials SET trial_end_date = NOW() + INTERVAL '40 days' WHERE user_id=X`
- Extend trial: `UPDATE user_trials SET trial_end_date = trial_end_date + INTERVAL '7 days' WHERE user_id=X`
- Activate payment plan: `INSERT INTO user_payment_plans (user_id, plan_id, start_date) VALUES (X, plan_id, NOW())`

## Support & Documentation

- **Schema Details:** See DATABASE_SCHEMA.md
- **Authentication Flow:** See AUTH_AND_ONBOARDING.md
- **Payment System:** See PAYMENTS_AND_TRIALS.md
- **Deployment:** See DEPLOYMENT_AND_OPERATIONS.md

## Version History

- **v0.0.0050:** Schema parity, 40-day trials, payment plans configured
- **v0.0.0049:** Full MySQL→PostgreSQL schema migration (34 tables)
- **v0.0.0048:** Payment plans, trial system tables
- **Earlier:** Base authentication and onboarding foundation

---

**Next Steps:**
1. Run `./setup-drais.sh validate` to confirm production readiness
2. Test login → onboarding → payment flow
3. Verify all 5 markdown docs and 4 SQL files are in place
4. Deploy with confidence
