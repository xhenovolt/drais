/**
 * Apply migration to add onboarding_completed columns
 * Run with: node apply-migration.js
 */

import db from './src/lib/db/index.js';

async function applyMigration() {
  try {
    console.log('🔄 Applying migration: Add onboarding_completed to users table...');

    // Add columns if they don't exist
    await db.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP;
    `);

    console.log('✅ Columns added to users table');

    // Create index for efficient queries
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_users_onboarding_completed 
        ON users(onboarding_completed, school_id);
    `);

    console.log('✅ Index created');

    // Verify columns exist
    const result = await db.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='users' AND column_name IN ('onboarding_completed', 'onboarding_completed_at')
      ORDER BY column_name;
    `);

    console.log('✅ Migration complete! Verified columns:');
    result.forEach(row => console.log(`   - ${row.column_name}`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

applyMigration();
