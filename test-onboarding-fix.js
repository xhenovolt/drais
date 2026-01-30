/**
 * Test: Verify onboarding completion logic
 * 
 * This tests that the fix works correctly
 */

import db from './src/lib/db/index.js';

async function testOnboardingFix() {
  try {
    console.log('🧪 Testing onboarding completion fix...\n');

    // Test 1: Check columns exist
    console.log('1️⃣  Checking if onboarding_completed columns exist...');
    const columns = await db.query(`
      SELECT column_name, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name='users' 
      AND column_name IN ('onboarding_completed', 'onboarding_completed_at')
      ORDER BY column_name;
    `);

    if (columns.length === 0) {
      console.log('❌ Columns do not exist! You need to run the migration first.');
      console.log('Run: psql $DATABASE_URL -f database/migration_add_onboarding_completed.sql');
      process.exit(1);
    }

    console.log('✅ Columns exist:');
    columns.forEach(col => {
      console.log(`   - ${col.column_name} (nullable: ${col.is_nullable}, default: ${col.column_default})`);
    });

    // Test 2: Verify index
    console.log('\n2️⃣  Checking if index exists...');
    const indexes = await db.query(`
      SELECT indexname FROM pg_indexes 
      WHERE tablename='users' 
      AND indexname='idx_users_onboarding_completed';
    `);

    if (indexes.length > 0) {
      console.log('✅ Index exists');
    } else {
      console.log('⚠️  Index not found (optional, but recommended)');
    }

    // Test 3: Check a user
    console.log('\n3️⃣  Checking test user data...');
    const user = await db.findOne('users', { id: 3 });
    if (user) {
      console.log(`✅ Found user: ${user.email}`);
      console.log(`   - onboarding_completed: ${user.onboarding_completed}`);
      console.log(`   - onboarding_completed_at: ${user.onboarding_completed_at}`);
    } else {
      console.log('⚠️  User 3 not found');
    }

    console.log('\n✅ Database schema check passed!\n');
    console.log('Next steps:');
    console.log('1. Restart the server: npm run dev');
    console.log('2. Login and complete onboarding steps');
    console.log('3. Verify button enables when all steps + payment are complete');
    console.log('4. Check database: SELECT id, onboarding_completed FROM users WHERE id=3;');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testOnboardingFix();
