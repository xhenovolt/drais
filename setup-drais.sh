#!/bin/bash

################################################################################
# DRAIS Master Setup & Diagnostic Script v0.0.0050+
# 
# Purpose: Single-command comprehensive system diagnosis and setup
# Usage: ./setup-drais.sh [command]
# 
# Commands:
#   check     - Run full system diagnostic (default)
#   setup     - Initialize database and seed data
#   migrate   - Run pending migrations
#   seed      - Seed reference data
#   validate  - Validate production readiness
#   reset     - Reset database (WARNING: destructive)
#   help      - Show this help
#
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATABASE_DIR="$SCRIPT_DIR/database"
ENV_FILE="$SCRIPT_DIR/.env.local"
MIGRATION_DIR="$DATABASE_DIR"

# Load environment
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}❌ ERROR: .env.local not found at $ENV_FILE${NC}"
  exit 1
fi
source "$ENV_FILE"

################################################################################
# HELPER FUNCTIONS
################################################################################

log_header() {
  echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
}

log_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
  echo -e "${RED}❌ $1${NC}"
}

log_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

log_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

# Test database connection
test_db_connection() {
  if [ "$PRIMARY_DB" = "postgres" ]; then
    if psql "$DATABASE_URL" -c "SELECT NOW();" &>/dev/null; then
      return 0
    else
      return 1
    fi
  elif [ "$PRIMARY_DB" = "mysql" ]; then
    mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} -e "SELECT NOW();" &>/dev/null
    return $?
  fi
  return 1
}

# Count tables
count_tables() {
  if [ "$PRIMARY_DB" = "postgres" ]; then
    psql "$DATABASE_URL" -tA -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';"
  elif [ "$PRIMARY_DB" = "mysql" ]; then
    mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} "$MYSQL_DATABASE" -se "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=DATABASE();"
  fi
}

################################################################################
# DIAGNOSTIC CHECKS
################################################################################

check_environment() {
  log_header "📋 ENVIRONMENT CHECK"
  
  echo "Primary Database: ${PRIMARY_DB}"
  echo "Database URL: ${DATABASE_URL:0:50}..."
  
  if [ "$PRIMARY_DB" = "postgres" ]; then
    echo "PostgreSQL Host: ${POSTGRES_HOST:-via CONNECTION STRING}"
    echo "PostgreSQL Database: ${POSTGRES_DATABASE:-via CONNECTION STRING}"
  elif [ "$PRIMARY_DB" = "mysql" ]; then
    echo "MySQL Host: $MYSQL_HOST:$MYSQL_PORT"
    echo "MySQL Database: $MYSQL_DATABASE"
  fi
  
  echo "Node Environment: ${NODE_ENV}"
  echo "Session Timeout: ${SESSION_TIMEOUT}ms"
}

check_database_connection() {
  log_header "🔌 DATABASE CONNECTION CHECK"
  
  if test_db_connection; then
    log_success "Connected to ${PRIMARY_DB} successfully"
    
    if [ "$PRIMARY_DB" = "postgres" ]; then
      psql "$DATABASE_URL" -c "SELECT current_database(), current_user, inet_server_addr();"
    fi
    return 0
  else
    log_error "Failed to connect to ${PRIMARY_DB}"
    log_info "Check DATABASE_URL and credentials in .env.local"
    return 1
  fi
}

check_schema_parity() {
  log_header "📊 SCHEMA PARITY CHECK"
  
  TABLE_COUNT=$(count_tables)
  log_info "Total tables: $TABLE_COUNT"
  
  # Check critical tables
  local CRITICAL_TABLES=("onboarding_steps" "user_profiles" "user_trials" "user_payment_plans" "payment_plans")
  local MISSING=0
  
  if [ "$PRIMARY_DB" = "postgres" ]; then
    for table in "${CRITICAL_TABLES[@]}"; do
      if psql "$DATABASE_URL" -c "SELECT 1 FROM $table LIMIT 1;" &>/dev/null; then
        log_success "✓ $table"
      else
        log_error "✗ $table (MISSING)"
        ((MISSING++))
      fi
    done
  elif [ "$PRIMARY_DB" = "mysql" ]; then
    for table in "${CRITICAL_TABLES[@]}"; do
      if mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} "$MYSQL_DATABASE" -e "SELECT 1 FROM $table LIMIT 1;" &>/dev/null; then
        log_success "✓ $table"
      else
        log_error "✗ $table (MISSING)"
        ((MISSING++))
      fi
    done
  fi
  
  if [ $MISSING -eq 0 ]; then
    log_success "All critical tables present"
    return 0
  else
    log_error "$MISSING critical tables missing"
    return 1
  fi
}

check_reference_data() {
  log_header "📚 REFERENCE DATA CHECK"
  
  if [ "$PRIMARY_DB" = "postgres" ]; then
    PLAN_COUNT=$(psql "$DATABASE_URL" -tA -c "SELECT COUNT(*) FROM payment_plans;")
    TRIAL_COUNT=$(psql "$DATABASE_URL" -tA -c "SELECT COUNT(*) FROM user_trials;")
  elif [ "$PRIMARY_DB" = "mysql" ]; then
    PLAN_COUNT=$(mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} "$MYSQL_DATABASE" -se "SELECT COUNT(*) FROM payment_plans;")
    TRIAL_COUNT=$(mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} "$MYSQL_DATABASE" -se "SELECT COUNT(*) FROM user_trials;")
  fi
  
  log_info "Payment Plans: $PLAN_COUNT"
  log_info "Active Trials: $TRIAL_COUNT"
  
  if [ "$PLAN_COUNT" -ge 4 ]; then
    log_success "Reference plans configured"
  else
    log_warning "Only $PLAN_COUNT plans found (expected 4)"
  fi
}

################################################################################
# SETUP & MIGRATION FUNCTIONS
################################################################################

run_migrations() {
  log_header "🔄 RUNNING MIGRATIONS"
  
  local migrations=(
    "$MIGRATION_DIR/migration_v0.0.0048_missing_trial_payment_tables.sql"
    "$MIGRATION_DIR/migration_v0.0.0049_schema_parity.sql"
  )
  
  for migration in "${migrations[@]}"; do
    if [ -f "$migration" ]; then
      log_info "Running: $(basename $migration)"
      
      if [ "$PRIMARY_DB" = "postgres" ]; then
        psql "$DATABASE_URL" -f "$migration" &>/dev/null
      elif [ "$PRIMARY_DB" = "mysql" ]; then
        mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} "$MYSQL_DATABASE" < "$migration" &>/dev/null
      fi
      
      if [ $? -eq 0 ]; then
        log_success "$(basename $migration) completed"
      else
        log_error "$(basename $migration) failed"
        return 1
      fi
    fi
  done
}

seed_data() {
  log_header "🌱 SEEDING REFERENCE DATA"
  
  local seed_file="$MIGRATION_DIR/seed.${PRIMARY_DB}.sql"
  
  if [ -f "$seed_file" ]; then
    log_info "Seeding from: $(basename $seed_file)"
    
    if [ "$PRIMARY_DB" = "postgres" ]; then
      psql "$DATABASE_URL" -f "$seed_file"
    elif [ "$PRIMARY_DB" = "mysql" ]; then
      mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} "$MYSQL_DATABASE" < "$seed_file"
    fi
    
    if [ $? -eq 0 ]; then
      log_success "Seed data applied successfully"
      return 0
    else
      log_error "Seed data application failed"
      return 1
    fi
  else
    log_warning "Seed file not found: $seed_file"
    return 1
  fi
}

################################################################################
# VALIDATION & RESET
################################################################################

validate_production_readiness() {
  log_header "✅ PRODUCTION READINESS VALIDATION"
  
  local failed=0
  
  # Check 1: Database connection
  log_info "Checking database connection..."
  if test_db_connection; then
    log_success "Database connected"
  else
    log_error "Database connection failed"
    ((failed++))
  fi
  
  # Check 2: Critical tables
  log_info "Checking critical tables..."
  if check_schema_parity | grep -q "✓.*user_profiles"; then
    log_success "All critical tables present"
  else
    log_error "Missing critical tables"
    ((failed++))
  fi
  
  # Check 3: Payment plans
  log_info "Checking payment plans..."
  if [ "$PRIMARY_DB" = "postgres" ]; then
    if psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM payment_plans WHERE is_active=true;" | grep -q "4"; then
      log_success "Payment plans configured (4 active)"
    else
      log_warning "Payment plans may not be fully configured"
    fi
  fi
  
  # Check 4: Trial system
  log_info "Checking trial system..."
  if [ "$PRIMARY_DB" = "postgres" ]; then
    TRIAL_DAYS=$(psql "$DATABASE_URL" -tA -c "SELECT trial_period_days FROM payment_plans WHERE plan_code='trial';")
    if [ "$TRIAL_DAYS" = "40" ]; then
      log_success "Trial system configured (40-day default)"
    else
      log_warning "Trial period is $TRIAL_DAYS days (expected 40)"
    fi
  fi
  
  if [ $failed -eq 0 ]; then
    log_success "✅ System is PRODUCTION READY"
    return 0
  else
    log_error "❌ $failed checks failed - system NOT production ready"
    return 1
  fi
}

reset_database() {
  log_header "⚠️  DATABASE RESET (DESTRUCTIVE)"
  
  echo -e "${RED}WARNING: This will drop and recreate the database.${NC}"
  read -p "Type 'RESET' to confirm: " confirm
  
  if [ "$confirm" != "RESET" ]; then
    log_info "Reset cancelled"
    return 0
  fi
  
  if [ "$PRIMARY_DB" = "postgres" ]; then
    log_info "Dropping and recreating PostgreSQL database..."
    psql "$DATABASE_URL" -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"
  elif [ "$PRIMARY_DB" = "mysql" ]; then
    log_info "Dropping and recreating MySQL database..."
    mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} -e "DROP DATABASE IF EXISTS \`$MYSQL_DATABASE\`; CREATE DATABASE \`$MYSQL_DATABASE\`;"
  fi
  
  log_success "Database reset complete - run 'setup-drais.sh setup' to initialize"
}

################################################################################
# MAIN COMMAND DISPATCHER
################################################################################

show_help() {
  cat << EOF
DRAIS Master Setup & Diagnostic Script v0.0.0050+

USAGE:
  ./setup-drais.sh [COMMAND]

COMMANDS:
  check     - Run full system diagnostic (default)
  setup     - Initialize database and seed data
  migrate   - Run pending migrations
  seed      - Seed reference data only
  validate  - Validate production readiness
  reset     - Reset database (WARNING: destructive)
  help      - Show this help message

EXAMPLES:
  ./setup-drais.sh check          # Full diagnostic
  ./setup-drais.sh setup          # Initialize fresh system
  ./setup-drais.sh validate       # Check if production-ready
  ./setup-drais.sh migrate        # Run all pending migrations

EOF
}

main() {
  local command="${1:-check}"
  
  case "$command" in
    check)
      check_environment
      check_database_connection && check_schema_parity && check_reference_data
      ;;
    setup)
      check_database_connection && run_migrations && seed_data && log_success "Setup complete"
      ;;
    migrate)
      check_database_connection && run_migrations
      ;;
    seed)
      check_database_connection && seed_data
      ;;
    validate)
      check_database_connection && validate_production_readiness
      ;;
    reset)
      reset_database
      ;;
    help)
      show_help
      ;;
    *)
      log_error "Unknown command: $command"
      echo "Run './setup-drais.sh help' for usage information"
      exit 1
      ;;
  esac
}

# Run main
main "$@"
