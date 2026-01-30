#!/bin/bash

# DRAIS v0.0.0050 - Setup and Testing Script
# Complete walkthrough for implementing the new database and auth system
#
# Run this script step by step or copy commands manually
# chmod +x setup-v0.0.0050.sh
# ./setup-v0.0.0050.sh

set -e  # Exit on error

echo "════════════════════════════════════════════════════════"
echo "  DRAIS v0.0.0050 - Database & Auth Refactor"
echo "  Setup & Testing Guide"
echo "════════════════════════════════════════════════════════"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the DRAIS project root directory"
    exit 1
fi

echo "📁 Project Root: $(pwd)"
echo ""

# Step 1: Install dependencies
echo "════════════════════════════════════════════════════════"
echo "STEP 1: Install Dependencies"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Running: npm install"
echo ""
npm install
echo "✅ Dependencies installed"
echo ""

# Step 2: Check Node version
echo "════════════════════════════════════════════════════════"
echo "STEP 2: Verify Environment"
echo "════════════════════════════════════════════════════════"
echo ""
node_version=$(node --version)
npm_version=$(npm --version)
echo "Node.js: $node_version"
echo "npm: $npm_version"
echo ""

# Step 3: Check new files exist
echo "════════════════════════════════════════════════════════"
echo "STEP 3: Verify New Files"
echo "════════════════════════════════════════════════════════"
echo ""

files=(
    "src/lib/db/config.js"
    "src/lib/db/postgres.js"
    "src/lib/db/index-new.js"
    "src/lib/auth/session.js"
    "src/app/api/v2/auth/login/route.js"
    "src/app/api/v2/auth/logout/route.js"
    "src/app/api/v2/auth/me/route.js"
    "src/app/api/v2/test-db/route.js"
    "scripts/migrate-to-postgres.js"
    "scripts/seed-postgres-data.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (MISSING)"
    fi
done
echo ""

# Step 4: Display current configuration
echo "════════════════════════════════════════════════════════"
echo "STEP 4: Current Configuration"
echo "════════════════════════════════════════════════════════"
echo ""

if [ -f ".env.local" ]; then
    echo "Current PRIMARY_DB setting:"
    grep "PRIMARY_DB=" .env.local || echo "⚠️  PRIMARY_DB not set"
    echo ""
fi

echo "Current database type support:"
grep "DB_TYPE=" .env.local 2>/dev/null || echo "ℹ️  Using PRIMARY_DB system (new)"
echo ""

# Step 5: Offer configuration options
echo "════════════════════════════════════════════════════════"
echo "STEP 5: Configure Database"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Which database would you like to use?"
echo "1) MySQL (default, no migration needed)"
echo "2) PostgreSQL (local, requires migration)"
echo "3) PostgreSQL Neon (cloud, requires migration)"
echo "4) MongoDB (no migration needed)"
echo "5) Skip configuration (use current .env.local)"
echo ""
read -p "Enter choice (1-5): " db_choice

case $db_choice in
    1)
        echo ""
        echo "📋 MySQL Configuration:"
        echo ""
        echo "Add to .env.local:"
        echo "PRIMARY_DB=mysql"
        echo "MYSQL_HOST=localhost"
        echo "MYSQL_PORT=3306"
        echo "MYSQL_USER=root"
        echo "MYSQL_PASSWORD=<your_password>"
        echo "MYSQL_DATABASE=drais"
        echo ""
        echo "No migration needed for MySQL!"
        ;;
    2)
        echo ""
        echo "🐘 PostgreSQL Local Configuration:"
        echo ""
        echo "First, ensure PostgreSQL is installed and running:"
        echo ""
        echo "macOS: brew install postgresql@15 && brew services start postgresql@15"
        echo "Linux: sudo apt install postgresql && sudo service postgresql start"
        echo ""
        echo "Then create database:"
        echo "psql -U postgres"
        echo "CREATE DATABASE drais;"
        echo "\\q"
        echo ""
        echo "Add to .env.local:"
        echo "PRIMARY_DB=postgres"
        echo "POSTGRES_HOST=localhost"
        echo "POSTGRES_PORT=5432"
        echo "POSTGRES_USER=postgres"
        echo "POSTGRES_PASSWORD=<your_password>"
        echo "POSTGRES_DATABASE=drais"
        echo ""
        echo "Then run: npm run migrate:postgres"
        ;;
    3)
        echo ""
        echo "🌐 PostgreSQL Neon Configuration:"
        echo ""
        echo "1. Go to https://neon.tech"
        echo "2. Create a project"
        echo "3. Copy the connection string"
        echo ""
        echo "Add to .env.local:"
        echo "PRIMARY_DB=postgres"
        echo "DATABASE_URL=postgresql://user:password@host.neon.tech:5432/database"
        echo ""
        echo "Then run: npm run migrate:postgres"
        ;;
    4)
        echo ""
        echo "🍃 MongoDB Configuration:"
        echo ""
        echo "Add to .env.local:"
        echo "PRIMARY_DB=mongodb"
        echo "MONGODB_URI=mongodb://localhost:27017/drais"
        echo "MONGODB_DATABASE=drais"
        echo ""
        echo "No migration needed for MongoDB!"
        ;;
    5)
        echo "⏭️  Skipping configuration"
        ;;
esac

echo ""
echo "════════════════════════════════════════════════════════"
echo "STEP 6: Next Steps"
echo "════════════════════════════════════════════════════════"
echo ""

case $db_choice in
    1|4)
        echo "For your selected database, run:"
        echo ""
        echo "  npm run dev"
        echo ""
        echo "Then test in another terminal:"
        echo ""
        echo "  curl http://localhost:3000/api/v2/test-db"
        ;;
    2|3)
        echo "For PostgreSQL, complete these steps:"
        echo ""
        echo "1. Edit .env.local with your PostgreSQL credentials"
        echo ""
        echo "2. Run migration:"
        echo "   npm run migrate:postgres"
        echo ""
        echo "3. (Optional) Seed test data:"
        echo "   node scripts/seed-postgres-data.js"
        echo ""
        echo "4. Start development server:"
        echo "   npm run dev"
        echo ""
        echo "5. Test in another terminal:"
        echo "   curl http://localhost:3000/api/v2/test-db"
        ;;
esac

echo ""
echo "════════════════════════════════════════════════════════"
echo "Documentation Files"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📖 Read these for complete information:"
echo ""
echo "  • IMPLEMENTATION_v0.0.0050_DATABASE_AUTH.md"
echo "    Complete implementation guide with examples"
echo ""
echo "  • QUICK_REFERENCE_v0.0.0050.md"
echo "    Quick start reference card"
echo ""
echo "  • DEPLOYMENT_v0.0.0050.md"
echo "    Deployment and migration guide"
echo ""
echo "  • SUMMARY_v0.0.0050.md"
echo "    Overview of all changes"
echo ""

echo "════════════════════════════════════════════════════════"
echo "Testing Authentication Endpoints"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Once your server is running (npm run dev):"
echo ""
echo "1. Test database connection:"
echo "   curl http://localhost:3000/api/v2/test-db"
echo ""
echo "2. Login:"
echo "   curl -X POST http://localhost:3000/api/v2/auth/login \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"email\":\"admin@testacademy.com\",\"password\":\"TestPassword@123\"}' \\"
echo "     -c cookies.txt"
echo ""
echo "3. Get current user:"
echo "   curl http://localhost:3000/api/v2/auth/me \\"
echo "     -b cookies.txt"
echo ""
echo "4. Logout:"
echo "   curl -X POST http://localhost:3000/api/v2/auth/logout \\"
echo "     -b cookies.txt"
echo ""

echo "════════════════════════════════════════════════════════"
echo "✅ Setup Complete!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "You now have:"
echo "✅ Multi-database support (MySQL, PostgreSQL, MongoDB)"
echo "✅ Session-based authentication (replaces JWT)"
echo "✅ PostgreSQL Neon cloud support"
echo "✅ Offline mode capability"
echo "✅ Complete documentation"
echo ""
echo "Start developing with: npm run dev"
echo ""
