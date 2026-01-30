import pkg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

/**
 * Create Test User in PostgreSQL
 * Prevents duplicates and ensures data integrity
 */

async function createTestUser() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const client = await pool.connect();
    console.log('🔧 Creating test user in PostgreSQL...\n');

    // Test user credentials
    const testUsername = 'test';
    const testEmail = 'test@website.tld';
    const testPassword = 'test123456';
    const testRole = 'student';

    // Get default school
    console.log('1️⃣  Getting school ID...');
    const schoolResult = await client.query(`
      SELECT id FROM schools WHERE status = 'active' LIMIT 1;
    `);

    if (schoolResult.rows.length === 0) {
      throw new Error('No active school found. Run setup-postgres.js first.');
    }

    const schoolId = schoolResult.rows[0].id;
    console.log(`  ✓ School ID: ${schoolId}`);

    // Check if test user exists
    console.log('\n2️⃣  Checking if test user exists...');
    const existingUser = await client.query(`
      SELECT id, username, email FROM users 
      WHERE (username = $1 OR email = $2) 
      AND school_id = $3;
    `, [testUsername, testEmail, schoolId]);

    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      console.log(`  ⚠️  User already exists: ${user.username} (${user.email})`);
      console.log(`  ID: ${user.id}`);
      
      // Check if person exists
      const personCheck = await client.query(`
        SELECT id, first_name, last_name FROM persons WHERE email = $1;
      `, [testEmail]);

      if (personCheck.rows.length === 0) {
        console.log('\n  Creating associated person record...');
        const personResult = await client.query(`
          INSERT INTO persons (
            school_id, first_name, last_name, email, phone
          ) VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (email, school_id) DO NOTHING
          RETURNING id;
        `, [schoolId, 'Test', 'User', testEmail, '+1234567890']);

        if (personResult.rows.length > 0) {
          console.log(`  ✓ Person created: ID ${personResult.rows[0].id}`);
        }
      }

      client.release();
      process.exit(0);
    }

    console.log('  ✓ Test user does not exist');

    // Create person first
    console.log('\n3️⃣  Creating person record...');
    const personResult = await client.query(`
      INSERT INTO persons (
        school_id, first_name, last_name, email, phone
      ) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email, school_id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
      RETURNING id;
    `, [schoolId, 'Test', 'User', testEmail, '+1234567890']);

    const personId = personResult.rows[0].id;
    console.log(`  ✓ Person created: ID ${personId}`);

    // Hash password
    console.log('\n4️⃣  Hashing password...');
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
    const hashedPassword = await bcrypt.hash(testPassword, saltRounds);
    console.log('  ✓ Password hashed securely');

    // Insert user
    console.log('\n5️⃣  Creating user...');
    const userResult = await client.query(`
      INSERT INTO users (
        school_id, person_id, username, password_hash, role, email, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, username, email, role, status, created_at;
    `, [schoolId, personId, testUsername, hashedPassword, testRole, testEmail, 'active']);

    const user = userResult.rows[0];
    console.log(`  ✓ User created successfully!`);
    console.log(`\n📊 Test User Details:`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Username: ${user.username}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Status: ${user.status}`);
    console.log(`  Created: ${user.created_at}`);

    // Verify user can be retrieved
    console.log('\n6️⃣  Verifying user retrieval...');
    const verifyResult = await client.query(`
      SELECT id, username, email, role, status FROM users WHERE id = $1;
    `, [user.id]);

    if (verifyResult.rows.length > 0) {
      console.log('  ✓ User verified in database');
    } else {
      throw new Error('User creation verification failed');
    }

    // Test password verification
    console.log('\n7️⃣  Testing password verification...');
    const passwordMatch = await bcrypt.compare(testPassword, hashedPassword);
    if (passwordMatch) {
      console.log('  ✓ Password hash verification works');
    } else {
      throw new Error('Password verification failed');
    }

    console.log('\n✅ Test user creation complete!');
    console.log('\n🔐 Login Credentials for Testing:');
    console.log(`  Username: ${testUsername}`);
    console.log(`  Email: ${testEmail}`);
    console.log(`  Password: ${testPassword}`);

    client.release();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createTestUser();
