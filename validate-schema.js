import db from './src/lib/db/index.js';

/**
 * Schema Validation Script
 * Inspects PostgreSQL database and ensures all required tables exist
 */

async function inspectSchema() {
  try {
    console.log('🔍 Inspecting PostgreSQL Schema...\n');

    // Get all tables in the database
    const tableResult = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('📋 Tables Found:');
    const tables = tableResult.map(row => row.table_name);
    tables.forEach(t => console.log(`  - ${t}`));

    // Critical tables that must exist
    const criticalTables = ['users', 'schools', 'sessions', 'persons'];
    console.log('\n✅ Checking Critical Tables:');
    
    for (const table of criticalTables) {
      const exists = tables.includes(table);
      console.log(`  ${exists ? '✓' : '✗'} ${table}`);
      
      if (exists) {
        // Get column info
        const columnResult = await db.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = $1
          ORDER BY ordinal_position;
        `, [table]);
        
        console.log(`    Columns:`);
        columnResult.forEach(col => {
          const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
          const def = col.column_default ? ` DEFAULT ${col.column_default}` : '';
          console.log(`      - ${col.column_name}: ${col.data_type} ${nullable}${def}`);
        });
      }
    }

    // Check users table structure specifically
    console.log('\n🔐 Users Table Structure:');
    const usersColumns = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    usersColumns.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });

    // Check for roles ENUM
    console.log('\n🎭 Checking Role Enum:');
    try {
      const enumResult = await db.query(`
        SELECT e.enumlabel
        FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = 'role_enum'
        ORDER BY e.enumsortorder;
      `);
      
      if (enumResult.length > 0) {
        console.log('  Valid roles:');
        enumResult.forEach(row => console.log(`    - ${row.enumlabel}`));
      } else {
        console.log('  ⚠️  role_enum not found');
      }
    } catch (error) {
      console.log(`  ⚠️  Error checking enum: ${error.message}`);
    }

    // Count existing users
    console.log('\n👥 User Statistics:');
    const userCount = await db.query('SELECT COUNT(*) as count FROM users;');
    console.log(`  Total users: ${userCount[0]?.count || 0}`);

    // List existing users (if any)
    if (userCount[0]?.count > 0) {
      const users = await db.query('SELECT id, username, email, role, created_at FROM users;');
      console.log('  Existing users:');
      users.forEach(user => {
        console.log(`    - ${user.username} (${user.email}) - role: ${user.role}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Schema inspection failed:', error.message);
    process.exit(1);
  }
}

inspectSchema();
