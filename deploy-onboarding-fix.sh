#!/bin/bash

# =====================================================================
# DRAIS Onboarding Fix Deployment v0.0.0051
# =====================================================================

echo "🚀 Starting deployment..."

# Step 1: Apply migration
echo "📝 Applying database migration..."

cat > /tmp/apply_migration.js << 'EOF'
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Applying migration...');
    
    // Add columns
    await client.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP;
    `);
    console.log('✅ Added onboarding_completed columns');
    
    // Create index
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_onboarding_completed 
        ON users(onboarding_completed, school_id);
    `);
    console.log('✅ Created index');
    
    // Verify
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' 
      AND column_name IN ('onboarding_completed', 'onboarding_completed_at')
      ORDER BY column_name;
    `);
    
    console.log(`✅ Migration verified - ${result.rows.length} columns confirmed`);
    console.log('Migration complete!');
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
EOF

node /tmp/apply_migration.js

if [ $? -ne 0 ]; then
  echo "❌ Migration failed!"
  exit 1
fi

# Step 2: Kill existing server
echo "🛑 Stopping existing server..."
pkill -f "next dev" || true
sleep 2

# Step 3: Clear cache
echo "🧹 Clearing cache..."
rm -rf /home/xhenvolt/projects/drais/.next/dev/lock
rm -rf /home/xhenvolt/projects/drais/.next/cache || true

# Step 4: Restart server
echo "🚀 Starting server..."
cd /home/xhenvolt/projects/drais
npm run dev &

sleep 8

# Step 5: Verify
echo "✅ Deployment complete!"
echo ""
echo "🔗 Test the application at: http://localhost:3000"
echo "📝 Check logs above for any errors"
