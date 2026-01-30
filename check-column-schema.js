const { Pool } = require('pg');

const onlineUrl = 'postgresql://neondb_owner:npg_HExwNUY6aVP9@ep-small-sound-adgn2dmu-pooler.c-2.us-east-1.aws.neon.tech/drais?sslmode=require&channel_binding=require';

async function checkTables() {
  const pool = new Pool({ connectionString: onlineUrl });

  try {
    // Check user_trials columns
    console.log('\n=== USER_TRIALS COLUMNS ===\n');
    const trialsResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name='user_trials' 
      ORDER BY ordinal_position
    `);
    trialsResult.rows.forEach(r => console.log(`${r.column_name}: ${r.data_type}`));

    // Check user_payment_plans columns
    console.log('\n=== USER_PAYMENT_PLANS COLUMNS ===\n');
    const paymentPlanResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name='user_payment_plans' 
      ORDER BY ordinal_position
    `);
    paymentPlanResult.rows.forEach(r => console.log(`${r.column_name}: ${r.data_type}`));

    // Check payment_plans columns
    console.log('\n=== PAYMENT_PLANS COLUMNS ===\n');
    const plansResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name='payment_plans' 
      ORDER BY ordinal_position
    `);
    plansResult.rows.forEach(r => console.log(`${r.column_name}: ${r.data_type}`));

  } catch (error) {
    console.error('ERROR:', error.message);
  } finally {
    await pool.end();
  }
}

checkTables();
