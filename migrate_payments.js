const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_HExwNUY6aVP9@ep-small-sound-adgn2dmu-pooler.c-2.us-east-1.aws.neon.tech/drais?sslmode=require',
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});

async function migrate() {
  try {
    // Test connection first
    const testConn = await pool.query('SELECT NOW()');
    console.log('✓ Connected to database');
    
    console.log('\n=== DRAIS Official Payment Plans Migration ===\n');
    
    // Step 1: Show current plans
    console.log('Current payment plans:');
    const currentPlans = await pool.query('SELECT id, plan_name, price_termly, price_annual FROM payment_plans ORDER BY id');
    currentPlans.rows.forEach(p => {
      console.log(`  ${p.id}. ${p.plan_name}: ${p.price_termly || 'NULL'}/term, ${p.price_annual || 'NULL'}/year`);
    });
    
    // Step 2: Delete old plans
    console.log('\nDeleting generic/obsolete plans...');
    const deleteResult = await pool.query(`DELETE FROM payment_plans WHERE plan_code NOT IN ('free_trial', 'trial')`);
    console.log(`✓ Deleted ${deleteResult.rowCount} old plans`);
    
    // Step 3: Ensure Free Trial
    console.log('\nEnsuring Free Trial plan...');
    await pool.query(`
      INSERT INTO payment_plans (plan_name, plan_code, price_termly, price_annual, trial_period_days, is_trial, is_active)
      VALUES ('Free Trial', 'free_trial', 0, 0, 14, true, true)
      ON CONFLICT (plan_code) DO NOTHING
    `);
    console.log('✓ Free Trial plan ready');
    
    // Step 4: Insert official plans
    console.log('\nInserting official DRAIS plans...\n');
    
    const plansToInsert = [
      {
        name: 'Professional',
        code: 'professional',
        termPrice: 350000,
        yearPrice: 1050000,
        description: 'Core modules, Unlimited students, 50 staff accounts, Data export, Email support',
      },
      {
        name: 'Premium',
        code: 'premium',
        termPrice: 600000,
        yearPrice: 1800000,
        description: 'Professional + AI insights, Predictive analytics, SMS integration, 100 staff accounts, Priority support',
      },
      {
        name: 'Gold',
        code: 'gold',
        termPrice: 850000,
        yearPrice: 2550000,
        description: 'Premium + Unlimited staff, Full API access, Custom integrations, White-label options, Dedicated manager',
      },
    ];
    
    for (const plan of plansToInsert) {
      const result = await pool.query(`
        INSERT INTO payment_plans (
          plan_name, plan_code, price_termly, price_annual,
          description, trial_period_days, is_trial, is_active, sort_order
        ) VALUES ($1, $2, $3, $4, $5, 14, false, true, 10)
        ON CONFLICT (plan_code) DO UPDATE SET
          price_termly = $3,
          price_annual = $4,
          description = $5
        RETURNING id, plan_name, price_termly, price_annual
      `, [plan.name, plan.code, plan.termPrice, plan.yearPrice, plan.description]);
      
      const inserted = result.rows[0];
      console.log(`✓ ${inserted.plan_name}: UGX ${inserted.price_termly}/term (${inserted.price_annual}/year)`);
    }
    
    // Step 5: Verify
    console.log('\n=== FINAL PAYMENT PLANS ===');
    const finalPlans = await pool.query(`
      SELECT id, plan_name, plan_code, price_termly, price_annual, trial_period_days, is_trial, is_active
      FROM payment_plans
      ORDER BY sort_order, id
    `);
    
    finalPlans.rows.forEach(p => {
      console.log(`\n${p.id}. ${p.plan_name} (${p.plan_code})`);
      console.log(`   Price: UGX ${p.price_termly || 0}/term, UGX ${p.price_annual || 0}/year`);
      console.log(`   Trial: ${p.trial_period_days} days | Type: ${p.is_trial ? 'FREE TRIAL' : 'PAID'}`);
    });
    
    console.log('\n✅ Payment plans migration complete\n');
    await pool.end();
  } catch(e) {
    console.error('\n❌ ERROR:', e.message);
    await pool.end();
    process.exit(1);
  }
}

migrate();
