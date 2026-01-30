const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_HExwNUY6aVP9@ep-small-sound-adgn2dmu-pooler.c-2.us-east-1.aws.neon.tech/drais?sslmode=require&channel_binding=require'
});

async function checkDatabase() {
  try {
    // Get all tables
    const result = await pool.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname='public' 
      ORDER BY tablename
    `);
    
    console.log('📊 TABLES IN YOUR ONLINE DATABASE:\n');
    result.rows.forEach((row, idx) => {
      console.log(`${idx + 1}. ${row.tablename}`);
    });
    
    console.log(`\n✅ Total tables: ${result.rows.length}\n`);
    
    // Check critical tables
    const criticalTables = [
      'payment_plans',
      'user_trials',
      'user_payment_plans',
      'onboarding_steps',
      'user_profiles',
      'user_sessions',
      'user_people'
    ];
    
    console.log('🔍 CRITICAL TABLES STATUS:\n');
    const existingTables = result.rows.map(r => r.tablename);
    
    criticalTables.forEach(table => {
      if (existingTables.includes(table)) {
        console.log(`✅ ${table}`);
      } else {
        console.log(`❌ ${table} - MISSING`);
      }
    });
    
    // Count rows in payment_plans if it exists
    if (existingTables.includes('payment_plans')) {
      const paymentResult = await pool.query('SELECT COUNT(*) as count FROM payment_plans');
      console.log(`\n💰 payment_plans row count: ${paymentResult.rows[0].count}`);
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();
