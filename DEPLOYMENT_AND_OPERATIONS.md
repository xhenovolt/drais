# DEPLOYMENT & OPERATIONS

**Version:** 0.0.0050+  
**Last Updated:** January 25, 2025  
**Status:** Production-ready deployment procedures

## Quick Start Deployment

### 1. Prerequisites
- Node.js v24.11.1+
- PostgreSQL 14+ (Neon cloud) or MySQL 8.0+
- Git repository cloned
- `.env.local` file configured

### 2. Environment Setup
```bash
# Copy template
cp .env.example .env.local

# Edit .env.local with your values:
PRIMARY_DB=postgres
DATABASE_URL=postgresql://user:password@host/drais?sslmode=require

# For MySQL fallback:
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=drais

# Session security
SESSION_SECRET=$(openssl rand -base64 32)  # Generate secure random
NODE_ENV=production  # or development for dev
```

### 3. Database Initialization
```bash
# Full system check
./setup-drais.sh check

# Initialize database (creates all tables, seeds data)
./setup-drais.sh setup

# Validate production readiness
./setup-drais.sh validate
```

### 4. Application Start
```bash
# Install dependencies
npm install

# Build (Next.js)
npm run build

# Production server
npm start

# Or development with watch
npm run dev
```

### 5. Verify Deployment
```bash
# Application should be running on http://localhost:3000
curl http://localhost:3000/api/health

# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"password"}'
```

## Deployment Checklist

### Pre-Deployment
- [ ] Code committed and tested locally
- [ ] All environment variables set in .env.local
- [ ] Database backups created: `./setup-drais.sh backup`
- [ ] Node.js version verified: `node --version` (should be v24.11.1+)
- [ ] npm dependencies up to date: `npm update`

### Database Preparation
- [ ] Run migrations: `./setup-drais.sh migrate`
- [ ] Seed reference data: `./setup-drais.sh seed`
- [ ] Verify critical tables: `./setup-drais.sh check`
- [ ] Test connectivity: `psql "$DATABASE_URL" -c "SELECT NOW();"`

### Application Deployment
- [ ] Build application: `npm run build`
- [ ] Start server: `npm start`
- [ ] Check logs: `tail -f logs/error.log`
- [ ] Test health endpoint: `curl http://localhost:3000/api/health`
- [ ] Test login endpoint: `curl -X POST http://localhost:3000/api/auth/login`

### Post-Deployment Verification
- [ ] Login works: Test user account
- [ ] Onboarding accessible: `/onboarding` page loads
- [ ] Payment plans display: Check `/upgrade` page
- [ ] Trial active: Verify 40-day trial for new user
- [ ] Dashboard loads: After onboarding completion

### Monitoring (First 24 Hours)
- [ ] Check error logs for exceptions
- [ ] Monitor database queries for slow performance
- [ ] Verify session creation and cleanup
- [ ] Test logout and session invalidation
- [ ] Monitor user registrations and onboarding completions

## Database Migrations

### Running Migrations
Migrations are idempotent and safe to re-run:

```bash
# Automatic (via setup script)
./setup-drais.sh migrate

# Manual (PostgreSQL)
psql "$DATABASE_URL" -f database/schema.postgres.sql

# Manual (MySQL)
mysql -h $MYSQL_HOST -u $MYSQL_USER -p $MYSQL_DATABASE < database/schema.mysql.sql
```

### Migration Files
Located in `/database/`:
1. **migration_v0.0.0048_missing_trial_payment_tables.sql** (200 lines)
   - Creates payment_plans, user_trials, user_payment_plans
   - Inserts 4 default payment plans
   
2. **migration_v0.0.0049_schema_parity.sql** (905 lines)
   - Creates 34 supporting tables
   - Adds 50+ indexes
   - Configures foreign key constraints

### Custom Migrations
To add new migrations:
1. Create file: `migration_vX.Y.Z_description.sql`
2. Use idempotent syntax: `CREATE TABLE IF NOT EXISTS ...`
3. Add to `/database/` directory
4. Update `setup-drais.sh` to include in migration loop

## Database Seeding

### Reference Data
Seed files populate payment plans and trial defaults:

```bash
# PostgreSQL
psql "$DATABASE_URL" -f database/seed.postgres.sql

# MySQL
mysql -h $MYSQL_HOST -u $MYSQL_USER -p $MYSQL_DATABASE < database/seed.mysql.sql
```

### Manual Seeding
```sql
-- PostgreSQL: Update trial duration
UPDATE payment_plans SET trial_period_days = 40 WHERE plan_code = 'trial';

-- MySQL: Same syntax
UPDATE payment_plans SET trial_period_days = 40 WHERE plan_code = 'trial';
```

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `PRIMARY_DB` | postgres | Database engine: postgres or mysql |
| `DATABASE_URL` | - | Full PostgreSQL connection string (required) |
| `POSTGRES_HOST` | localhost | PostgreSQL host (if not using connection string) |
| `POSTGRES_PORT` | 5432 | PostgreSQL port |
| `POSTGRES_USER` | postgres | PostgreSQL user |
| `POSTGRES_PASSWORD` | - | PostgreSQL password |
| `POSTGRES_DATABASE` | drais | PostgreSQL database name |
| `MYSQL_HOST` | localhost | MySQL host |
| `MYSQL_PORT` | 3306 | MySQL port |
| `MYSQL_USER` | root | MySQL user |
| `MYSQL_PASSWORD` | - | MySQL password |
| `MYSQL_DATABASE` | drais | MySQL database name |
| `SESSION_SECRET` | - | Secure random string for session signing |
| `SESSION_TIMEOUT` | 86400000 | Session timeout in milliseconds (24 hours) |
| `NODE_ENV` | development | Environment: development or production |
| `NEXT_PUBLIC_BASE_URL` | http://localhost:3000 | Public application URL |

## Operations & Maintenance

### Daily Checks
```bash
# System health
./setup-drais.sh check

# Check error logs
tail -f logs/error.log

# Database size
psql "$DATABASE_URL" -c "SELECT pg_size_pretty(pg_database_size(current_database()));"
```

### Weekly Tasks
```bash
# Backup database
pg_dump "$DATABASE_URL" > backups/drais_$(date +%Y%m%d).sql

# Check expired sessions
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM user_sessions WHERE expires_at < NOW();"

# Check expired trials
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM user_trials WHERE trial_end_date < NOW() AND is_active = true;"
```

### Monthly Tasks
```bash
# Update expired trials
psql "$DATABASE_URL" -c "UPDATE user_trials SET is_active = false WHERE trial_end_date < CURRENT_DATE AND is_active = true;"

# Delete expired sessions
psql "$DATABASE_URL" -c "DELETE FROM user_sessions WHERE expires_at < NOW() - INTERVAL '7 days';"

# Audit payment data (check for inconsistencies)
psql "$DATABASE_URL" << 'EOF'
-- Find users with multiple active plans (shouldn't happen)
SELECT u.id, COUNT(upp.id) as plan_count
FROM users u
LEFT JOIN user_payment_plans upp ON u.id = upp.user_id AND upp.is_active = true
GROUP BY u.id
HAVING COUNT(upp.id) > 1;
EOF
```

## Backup & Recovery

### Automatic Backups
```bash
# Create daily backup script (crontab)
0 2 * * * pg_dump "$DATABASE_URL" > /backups/drais_$(date +\%Y\%m\%d).sql

# Compress old backups
0 3 * * * gzip /backups/drais_*.sql
```

### Manual Backup
```bash
# Full backup
pg_dump "$DATABASE_URL" > drais_backup.sql

# Compressed backup
pg_dump "$DATABASE_URL" | gzip > drais_backup.sql.gz

# Specific tables
pg_dump "$DATABASE_URL" -t users -t user_trials -t payment_plans > payment_backup.sql
```

### Restore from Backup
```bash
# Full restore
psql "$DATABASE_URL" < drais_backup.sql

# From compressed backup
gunzip -c drais_backup.sql.gz | psql "$DATABASE_URL"

# Drop existing database first (CAUTION!)
psql "$DATABASE_URL" -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"
```

## Troubleshooting

### "Cannot connect to database"
**Check:**
```bash
# Verify environment variables
echo $DATABASE_URL

# Test connectivity
psql "$DATABASE_URL" -c "SELECT NOW();"

# Check PostgreSQL is running (if local)
pg_isready -h localhost -p 5432
```

### "Relation does not exist" errors
**Solutions:**
```bash
# Run migrations
./setup-drais.sh migrate

# Verify tables exist
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';"

# List missing tables
psql "$DATABASE_URL" -c "
  SELECT table_name FROM information_schema.tables 
  WHERE table_name IN ('onboarding_steps', 'user_profiles', 'user_trials', 'payment_plans')
  ORDER BY table_name;
"
```

### "Session expired" immediately after login
**Check:**
```bash
# Verify SESSION_TIMEOUT setting
grep SESSION_TIMEOUT .env.local

# Check session table
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM user_sessions WHERE expires_at > NOW();"

# Increase timeout if too short
# Edit .env.local: SESSION_TIMEOUT=604800000  # 7 days
```

### Slow database queries
**Diagnose:**
```bash
# Enable query logging
psql "$DATABASE_URL" << 'EOF'
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- 1 second
SELECT pg_reload_conf();
EOF

# View slow queries
tail -f /var/log/postgresql/postgresql.log | grep duration
```

## Scaling & Performance

### Connection Pooling
Default pool settings in `.env.local`:
```
POSTGRES_POOL_MAX=20           # Maximum connections
POSTGRES_IDLE_TIMEOUT=30000    # Milliseconds before idle connection closes
POSTGRES_CONNECTION_TIMEOUT=10000  # Connection timeout
```

### Index Optimization
All critical indexes already created (50+), covering:
- User lookups (email, id, school_id)
- Onboarding queries (user_id, status)
- Trial/payment queries (is_active, dates)
- Foreign key columns

### Read Replicas
For high-traffic deployments, consider:
- PostgreSQL read-only replicas
- Connection pooling (PgBouncer)
- Query caching layer (Redis)

## Version Management

### Current Version
```bash
# Check package.json
grep '"version"' package.json

# Output: "version": "0.0.0050"
```

### Semantic Versioning
Format: `MAJOR.MINOR.PATCH`
- `MAJOR`: Breaking changes (authentication rewrites, schema reshuffles)
- `MINOR`: New features (new payment plan, new report type)
- `PATCH`: Bug fixes and improvements

### Version Bumping
```bash
# Manual bump
npm version patch    # 0.0.0050 → 0.0.0051
npm version minor    # 0.0.0050 → 0.1.0
npm version major    # 0.0.0050 → 1.0.0

# Update all references
grep -r "0.0.0050" . --exclude-dir=node_modules --exclude-dir=.git

# Update documentation
sed -i 's/0.0.0050/0.0.0051/g' *.md
```

## Support & Documentation

**Key Files:**
- `SYSTEM_OVERVIEW.md` - Architecture and high-level design
- `DATABASE_SCHEMA.md` - Table structures and schema details
- `AUTH_AND_ONBOARDING.md` - Authentication and user onboarding
- `PAYMENTS_AND_TRIALS.md` - Payment system and trial logic
- `setup-drais.sh` - Master setup and diagnostic script

**Getting Help:**
1. Check documentation files first (above)
2. Review error logs: `tail -f logs/error.log`
3. Run diagnostics: `./setup-drais.sh check`
4. Check database: `psql "$DATABASE_URL"` for manual queries

---

**Last Updated:** January 25, 2025  
**Next Review:** Before next major deployment
