import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

/**
 * Direct PostgreSQL Schema Validation
 * Uses pg library directly to inspect the schema
 */

async function validatePostgresSchema() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL\n');

    // Get all tables
    const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    const tables = tablesResult.rows.map(row => row.tablename);
    console.log('📋 Tables Found:', tables.length);
    tables.forEach(t => console.log(`  - ${t}`));

    // Critical tables
    const criticalTables = ['users', 'schools', 'sessions', 'persons'];
    console.log('\n✅ Critical Tables Check:');
    
    for (const table of criticalTables) {
      const exists = tables.includes(table);
      console.log(`  ${exists ? '✓' : '✗'} ${table}`);
      
      if (exists) {
        const columnResult = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = $1
          ORDER BY ordinal_position;
        `, [table]);
        
        columnResult.rows.forEach(col => {
          const nullable = col.is_nullable === 'YES' ? '' : ' NOT NULL';
          const def = col.column_default ? ` (${col.column_default})` : '';
          console.log(`    - ${col.column_name}: ${col.data_type}${nullable}${def}`);
        });
      }
    }

    // Check users table specifically
    if (tables.includes('users')) {
      console.log('\n🔐 Users Table Structure:');
      const usersResult = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);
      
      usersResult.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
    }

    // Check for role_enum type
    console.log('\n🎭 Checking Role ENUM:');
    const enumResult = await client.query(`
      SELECT e.enumlabel
      FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'role_enum'
      ORDER BY e.enumsortorder;
    `);
    
    if (enumResult.rows.length > 0) {
      console.log('  Valid roles:');
      enumResult.rows.forEach(row => console.log(`    - ${row.enumlabel}`));
    } else {
      console.log('  ⚠️  role_enum not found');
    }

    // Count users
    console.log('\n👥 User Statistics:');
    const userCountResult = await client.query('SELECT COUNT(*) as count FROM users;');
    const userCount = parseInt(userCountResult.rows[0].count);
    console.log(`  Total users: ${userCount}`);

    if (userCount > 0) {
      const usersResult = await client.query(
        'SELECT id, username, email, role FROM users ORDER BY created_at DESC LIMIT 10;'
      );
      console.log('  Recent users:');
      usersResult.rows.forEach(user => {
        console.log(`    - ${user.username} (${user.email}) - role: ${user.role}`);
      });
    }

    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

validatePostgresSchema();
