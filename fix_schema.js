const { Pool } = require('pg');
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_HExwNUY6aVP9@ep-small-sound-adgn2dmu-pooler.c-2.us-east-1.aws.neon.tech/drais?sslmode=require&channel_binding=require' 
});

(async () => {
  try {
    console.log('Adding start_date column to user_trials...');
    await pool.query(`
      ALTER TABLE user_trials 
      ADD COLUMN IF NOT EXISTS start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    console.log('✓ start_date column added');
    
    console.log('Adding end_date column to user_trials...');
    await pool.query(`
      ALTER TABLE user_trials 
      ADD COLUMN IF NOT EXISTS end_date TIMESTAMP
    `);
    console.log('✓ end_date column added');
    
    console.log('\nVerifying user_trials schema:');
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name='user_trials' 
      ORDER BY ordinal_position
    `);
    
    result.rows.forEach(r => {
      console.log(`  ${r.column_name}: ${r.data_type}`);
    });
    
    console.log('\n✓ Schema update complete');
    await pool.end();
  } catch(e) {
    console.error('ERROR:', e.message);
    await pool.end();
    process.exit(1);
  }
})();
