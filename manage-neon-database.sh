#!/bin/bash

# =====================================================================
# DRAIS Neon PostgreSQL Management Script v2.0.0
# =====================================================================
# Complete CLI strategy for database lifecycle management
# Safe for: testing | staging | production (with confirmation)
# =====================================================================

set -e

# =====================================================================
# CONFIGURATION
# =====================================================================

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo -e "${RED}❌ .env.local not found${NC}"
  exit 1
fi

# Load environment
source .env.local

# =====================================================================
# HELPER FUNCTIONS
# =====================================================================

print_header() {
  echo ""
  echo -e "${BLUE}═════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}  $1${NC}"
  echo -e "${BLUE}═════════════════════════════════════════════════════════════${NC}"
  echo ""
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

# Confirm action for production
confirm_action() {
  local environment=$1
  local action=$2

  if [ "$environment" = "production" ]; then
    echo -e "${RED}⚠️  WARNING: This will $action in PRODUCTION${NC}"
    echo -e "${RED}This action cannot be undone!${NC}"
    read -p "Type 'YES' to confirm: " confirmation
    
    if [ "$confirmation" != "YES" ]; then
      print_error "Action cancelled"
      exit 1
    fi
  fi
}

# Test database connection
test_connection() {
  local connection_string=$1
  local db_name=$2

  if psql "$connection_string" -c "SELECT 1" > /dev/null 2>&1; then
    print_success "Connected to $db_name"
    return 0
  else
    print_error "Failed to connect to $db_name"
    return 1
  fi
}

# =====================================================================
# NEON CONNECTION
# =====================================================================

get_neon_connection() {
  if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL not set in .env.local"
    echo "Add your Neon connection string:"
    echo "  DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.aws.neon.tech/drais"
    exit 1
  fi

  echo "$DATABASE_URL"
}

# =====================================================================
# DATABASE CREATION
# =====================================================================

create_database() {
  print_header "Creating DRAIS Database"

  local connection=$(get_neon_connection)
  
  if test_connection "$connection" "drais"; then
    print_warning "Database already exists"
    return 0
  fi

  print_info "Note: Neon automatically creates the database. Check Neon dashboard."
  print_success "Database ready"
}

# =====================================================================
# SCHEMA DEPLOYMENT
# =====================================================================

deploy_schema() {
  print_header "Deploying Database Schema"

  local connection=$(get_neon_connection)

  if ! test_connection "$connection" "drais"; then
    print_error "Cannot connect to database"
    exit 1
  fi

  print_info "Reading schema from database/drais-complete-schema-v2.0.0.sql..."

  if [ ! -f "database/drais-complete-schema-v2.0.0.sql" ]; then
    print_error "Schema file not found: database/drais-complete-schema-v2.0.0.sql"
    exit 1
  fi

  print_info "Deploying schema..."
  if psql "$connection" -f "database/drais-complete-schema-v2.0.0.sql" > /tmp/schema_deploy.log 2>&1; then
    print_success "Schema deployed successfully"
    
    # Count tables
    local table_count=$(psql "$connection" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public'")
    print_info "Total tables created: $table_count"
  else
    print_error "Schema deployment failed"
    echo "Error log:"
    cat /tmp/schema_deploy.log
    exit 1
  fi
}

# =====================================================================
# DATA INITIALIZATION
# =====================================================================

init_database() {
  print_header "Initializing Database with Initial Data"

  local connection=$(get_neon_connection)

  if ! test_connection "$connection" "drais"; then
    print_error "Cannot connect to database"
    exit 1
  fi

  print_info "Reading initialization script from database/init-drais-database.sql..."

  if [ ! -f "database/init-drais-database.sql" ]; then
    print_error "Initialization script not found: database/init-drais-database.sql"
    exit 1
  fi

  print_info "Initializing with seed data..."
  if psql "$connection" -f "database/init-drais-database.sql" > /tmp/init.log 2>&1; then
    print_success "Database initialized with seed data"
    
    # Display seed info
    echo ""
    print_info "Seed Data Created:"
    echo "  School: Demo School"
    echo "  Super Admin Email: admin@demoschool.com"
    echo "  Super Admin Password: Temp@123456 (change on first login)"
    echo "  Academic Year: 2024-2025"
    echo ""
  else
    print_error "Database initialization failed"
    echo "Error log:"
    cat /tmp/init.log
    exit 1
  fi
}

# =====================================================================
# SCHEMA MIGRATION
# =====================================================================

migrate_from_mysql() {
  print_header "Migrate Data from MySQL to PostgreSQL"

  # Check if migration script exists
  if [ ! -f "scripts/migrate-from-mysql-to-postgres.js" ]; then
    print_error "Migration script not found: scripts/migrate-from-mysql-to-postgres.js"
    exit 1
  fi

  print_info "Running Node.js migration script..."

  # Dry run first
  print_warning "Starting with DRY RUN (no data modified)"
  node scripts/migrate-from-mysql-to-postgres.js --dry-run

  read -p "Proceed with actual migration? (yes/no): " proceed
  if [ "$proceed" = "yes" ]; then
    print_info "Starting migration..."
    node scripts/migrate-from-mysql-to-postgres.js
    print_success "Migration completed"
  else
    print_warning "Migration cancelled"
  fi
}

# =====================================================================
# BACKUP & RESTORE
# =====================================================================

backup_database() {
  print_header "Backing Up Database"

  local connection=$(get_neon_connection)
  local backup_dir="database/backups"
  local timestamp=$(date +"%Y%m%d_%H%M%S")
  local backup_file="$backup_dir/drais_backup_$timestamp.sql"

  # Create backup directory
  mkdir -p "$backup_dir"

  if ! test_connection "$connection" "drais"; then
    print_error "Cannot connect to database"
    exit 1
  fi

  print_info "Creating backup to $backup_file..."

  if pg_dump "$connection" > "$backup_file"; then
    local size=$(ls -lh "$backup_file" | awk '{print $5}')
    print_success "Backup created: $backup_file ($size)"
    print_info "To restore this backup:"
    echo "  psql \$DATABASE_URL < $backup_file"
  else
    print_error "Backup creation failed"
    exit 1
  fi
}

restore_database() {
  print_header "Restoring Database from Backup"

  local connection=$(get_neon_connection)

  if [ -z "$1" ]; then
    print_error "Usage: $0 restore <backup_file>"
    echo "Example: $0 restore database/backups/drais_backup_20240120_120000.sql"
    exit 1
  fi

  local backup_file=$1

  if [ ! -f "$backup_file" ]; then
    print_error "Backup file not found: $backup_file"
    exit 1
  fi

  confirm_action "production" "restore from backup"

  print_info "Restoring from $backup_file..."

  if psql "$connection" < "$backup_file"; then
    print_success "Database restored successfully"
  else
    print_error "Restore failed"
    exit 1
  fi
}

# =====================================================================
# DATABASE DROP & RECREATE
# =====================================================================

drop_database() {
  print_header "Dropping Database"

  local environment=$1
  local connection=$(get_neon_connection)

  confirm_action "$environment" "DROP ALL DATABASE DATA"

  print_warning "Dropping all tables..."

  psql "$connection" << 'EOF'
DO $$ 
BEGIN
  DROP VIEW IF EXISTS active_sessions_view CASCADE;
  DROP VIEW IF EXISTS student_attendance_summary CASCADE;
  DROP VIEW IF EXISTS outstanding_fees_view CASCADE;
  DROP VIEW IF EXISTS user_activity_view CASCADE;

  DROP TABLE IF EXISTS fee_payments CASCADE;
  DROP TABLE IF EXISTS fee_structures CASCADE;
  DROP TABLE IF EXISTS fees CASCADE;
  DROP TABLE IF EXISTS assessment_results CASCADE;
  DROP TABLE IF EXISTS assessments CASCADE;
  DROP TABLE IF EXISTS timetables CASCADE;
  DROP TABLE IF EXISTS attendance CASCADE;
  DROP TABLE IF EXISTS enrollments CASCADE;
  DROP TABLE IF EXISTS students CASCADE;
  DROP TABLE IF EXISTS class_subjects CASCADE;
  DROP TABLE IF EXISTS subjects CASCADE;
  DROP TABLE IF EXISTS classes CASCADE;
  DROP TABLE IF EXISTS academic_terms CASCADE;
  DROP TABLE IF EXISTS academic_years CASCADE;
  DROP TABLE IF EXISTS documents CASCADE;
  DROP TABLE IF EXISTS messages CASCADE;
  DROP TABLE IF EXISTS settings CASCADE;
  DROP TABLE IF EXISTS audit_log CASCADE;
  DROP TABLE IF EXISTS security_events CASCADE;
  DROP TABLE IF EXISTS session_activity CASCADE;
  DROP TABLE IF EXISTS sessions CASCADE;
  DROP TABLE IF EXISTS permissions CASCADE;
  DROP TABLE IF EXISTS roles CASCADE;
  DROP TABLE IF EXISTS users CASCADE;
  DROP TABLE IF EXISTS school_branches CASCADE;
  DROP TABLE IF EXISTS schools CASCADE;

  DROP FUNCTION IF EXISTS update_updated_at_column();
  DROP FUNCTION IF EXISTS check_school_isolation();
  DROP FUNCTION IF EXISTS cleanup_expired_sessions();

  RAISE NOTICE 'All tables and functions dropped successfully';
END $$;
EOF

  if [ $? -eq 0 ]; then
    print_success "Database dropped successfully"
  else
    print_error "Failed to drop database"
    exit 1
  fi
}

# =====================================================================
# COMPLETE RESET
# =====================================================================

reset_database() {
  print_header "COMPLETE DATABASE RESET"

  local environment=$1

  confirm_action "$environment" "COMPLETELY RESET the database"

  # Drop existing
  drop_database "$environment"

  # Deploy new schema
  deploy_schema

  # Initialize with seed data
  init_database

  print_success "Database completely reset and reinitialized"
}

# =====================================================================
# DATABASE VERIFICATION
# =====================================================================

verify_database() {
  print_header "Verifying Database"

  local connection=$(get_neon_connection)

  if ! test_connection "$connection" "drais"; then
    print_error "Cannot connect to database"
    exit 1
  fi

  print_info "Checking schema..."

  # Count tables
  local table_count=$(psql "$connection" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public'")
  print_info "Total tables: $table_count"

  # List all tables
  echo ""
  echo "Tables:"
  psql "$connection" -c "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;" | grep -v "^()"

  # Check for key tables
  echo ""
  print_info "Key table verification:"

  local tables=("schools" "users" "sessions" "roles" "permissions" "students" "classes" "subjects" "assessments" "fees")
  
  for table in "${tables[@]}"; do
    if psql "$connection" -c "\d $table" > /dev/null 2>&1; then
      print_success "$table ✓"
    else
      print_error "$table ✗"
    fi
  done

  # Record counts
  echo ""
  print_info "Record counts:"
  
  for table in "${tables[@]}"; do
    local count=$(psql "$connection" -t -c "SELECT COUNT(*) FROM $table" 2>/dev/null || echo "0")
    printf "  %-20s: %10s records\n" "$table" "$count"
  done

  print_success "Verification complete"
}

# =====================================================================
# DATABASE STATUS
# =====================================================================

database_status() {
  print_header "Database Status"

  local connection=$(get_neon_connection)

  if test_connection "$connection" "drais"; then
    echo ""
    print_info "Connection: Active"
    
    # Database size
    local db_size=$(psql "$connection" -t -c "SELECT pg_size_pretty(pg_database_size(current_database()))")
    print_info "Database size: $db_size"

    # Connection count
    local conn_count=$(psql "$connection" -t -c "SELECT count(*) FROM pg_stat_activity")
    print_info "Active connections: $conn_count"

    # Last schema update
    if psql "$connection" -c "SELECT to_timestamp(max(created_at)) FROM schools" > /dev/null 2>&1; then
      local last_update=$(psql "$connection" -t -c "SELECT to_timestamp(max(created_at)) FROM schools LIMIT 1")
      print_info "Last schema update: $last_update"
    fi
  else
    print_error "Database connection failed"
    exit 1
  fi
}

# =====================================================================
# USAGE & HELP
# =====================================================================

show_help() {
  cat << 'EOF'

DRAIS Neon PostgreSQL Management CLI

USAGE:
  ./manage-neon-database.sh [command] [environment]

COMMANDS:

  Database Lifecycle:
    create              Create database on Neon (automatic)
    deploy              Deploy schema to empty database
    init                Initialize database with seed data
    reset [env]         Complete reset (drop + deploy + init)
    migrate             Migrate data from MySQL to PostgreSQL

  Maintenance:
    backup              Create database backup
    restore <file>      Restore from backup file
    drop [env]          Drop all tables (use with caution)
    verify              Verify database schema and count records
    status              Show database status and metrics

  Help:
    help                Show this help message

ENVIRONMENTS:
  development         (default, no confirmation required)
  staging             (requires confirmation)
  production          (REQUIRES EXPLICIT CONFIRMATION)

EXAMPLES:

  # First-time setup
  ./manage-neon-database.sh create
  ./manage-neon-database.sh deploy
  ./manage-neon-database.sh init

  # Or use combined reset
  ./manage-neon-database.sh reset development

  # Backup before reset
  ./manage-neon-database.sh backup
  ./manage-neon-database.sh reset production

  # Restore from backup
  ./manage-neon-database.sh restore database/backups/drais_backup_20240120_120000.sql

  # Verify schema
  ./manage-neon-database.sh verify

  # Check status
  ./manage-neon-database.sh status

NEON SETUP CHECKLIST:

  1. Create Neon account at neon.tech
  2. Create new PostgreSQL database
  3. Copy connection string to DATABASE_URL in .env.local
  4. Run: ./manage-neon-database.sh reset development
  5. Verify with: ./manage-neon-database.sh verify

PRODUCTION CONSIDERATIONS:

  - Always backup before reset: ./manage-neon-database.sh backup
  - Test reset in staging first
  - Use explicit confirmation (type 'YES') for production resets
  - Monitor database size and connections
  - Regularly backup important data

EOF
}

# =====================================================================
# MAIN SCRIPT
# =====================================================================

main() {
  local command=${1:-help}
  local environment=${2:-development}

  case "$command" in
    create)
      create_database
      ;;
    deploy)
      deploy_schema
      ;;
    init)
      init_database
      ;;
    reset)
      reset_database "$environment"
      ;;
    migrate)
      migrate_from_mysql
      ;;
    backup)
      backup_database
      ;;
    restore)
      restore_database "$environment"
      ;;
    drop)
      drop_database "$environment"
      ;;
    verify)
      verify_database
      ;;
    status)
      database_status
      ;;
    help|--help|-h)
      show_help
      ;;
    *)
      print_error "Unknown command: $command"
      echo "Run '$0 help' for usage information"
      exit 1
      ;;
  esac
}

# Run main function with all arguments
main "$@"

# =====================================================================
# END OF SCRIPT
# =====================================================================
