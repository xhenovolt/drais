const { Pool } = require('pg');

const onlineUrl = 'postgresql://neondb_owner:npg_HExwNUY6aVP9@ep-small-sound-adgn2dmu-pooler.c-2.us-east-1.aws.neon.tech/drais?sslmode=require&channel_binding=require';
const localUrl = process.env.DATABASE_URL || 'postgresql://postgres:@localhost:5432/drais';

async function compareAndSync() {
  const onlinePool = new Pool({ connectionString: onlineUrl });
  const localPool = new Pool({ connectionString: localUrl });

  try {
    console.log('📊 Comparing online and offline databases...\n');
    
    // Get tables from both databases
    const onlineResult = await onlinePool.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname='public' 
      ORDER BY tablename
    `);
    const onlineTables = new Set(onlineResult.rows.map(r => r.tablename));
    
    let localResult;
    let localTables = new Set();
    
    try {
      localResult = await localPool.query(`
        SELECT tablename FROM pg_tables 
        WHERE schemaname='public' 
        ORDER BY tablename
      `);
      localTables = new Set(localResult.rows.map(r => r.tablename));
    } catch (e) {
      console.log('⚠️  Could not connect to local database, skipping local check');
    }

    console.log(`ONLINE DATABASE: ${onlineTables.size} tables`);
    console.log(`LOCAL DATABASE: ${localTables.size} tables\n`);

    // Find tables in local but not in online
    const missingInOnline = Array.from(localTables).filter(t => !onlineTables.has(t));
    
    if (missingInOnline.length > 0) {
      console.log(`❌ TABLES IN LOCAL BUT MISSING IN ONLINE (${missingInOnline.length}):\n`);
      missingInOnline.forEach(t => console.log(`  - ${t}`));
      console.log('\n⚠️  These tables need to be synced to online database!');
    } else {
      console.log('✅ All local tables exist in online database');
    }

    // Find tables in online but not in local
    const missingInLocal = Array.from(onlineTables).filter(t => !localTables.has(t));
    
    if (missingInLocal.length > 0) {
      console.log(`\n❌ TABLES IN ONLINE BUT MISSING IN LOCAL (${missingInLocal.length}):\n`);
      missingInLocal.forEach(t => console.log(`  - ${t}`));
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await onlinePool.end();
    await localPool.end();
  }
}

compareAndSync();
