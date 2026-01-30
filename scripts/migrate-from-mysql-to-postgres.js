#!/usr/bin/env node

/**
 * DRAIS MySQL to PostgreSQL Migration Script
 * Version: 1.0.0
 *
 * Usage:
 *   node scripts/migrate-from-mysql-to-postgres.js [--dry-run] [--user-only]
 *
 * Flags:
 *   --dry-run: Preview changes without executing
 *   --user-only: Migrate only users table (for testing)
 */

import mysql from 'mysql2/promise';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const USER_ONLY = args.includes('--user-only');

// Configuration
const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'drais',
};

const POSTGRES_CONFIG = {
  connectionString: process.env.DATABASE_URL,
};

let migrationStats = {
  tables: [],
  totalRecords: 0,
  errors: [],
};

/**
 * Connect to MySQL
 */
async function connectMySQL() {
  try {
    const connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Connected to MySQL');
    return connection;
  } catch (error) {
    console.error('❌ Failed to connect to MySQL:', error.message);
    process.exit(1);
  }
}

/**
 * Connect to PostgreSQL
 */
async function connectPostgres() {
  try {
    const pool = new Pool(POSTGRES_CONFIG);
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL');
    client.release();
    return pool;
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error.message);
    process.exit(1);
  }
}

/**
 * Migrate users table
 */
async function migrateUsers(mysqlConn, pgPool) {
  console.log('\n📋 Migrating USERS table...');

  try {
    // Get all users from MySQL
    const [users] = await mysqlConn.query(`
      SELECT *
      FROM users
      ORDER BY id
    `);

    console.log(`Found ${users.length} users to migrate`);

    if (DRY_RUN) {
      console.log('[DRY RUN] Would migrate:', users.slice(0, 3));
      return users.length;
    }

    // Migrate to PostgreSQL
    let migratedCount = 0;

    for (const user of users) {
      try {
        await pgPool.query(
          `INSERT INTO users (
            id, school_id, username, email, password_hash,
            first_name, last_name, phone, role, account_status,
            avatar_url, last_login_at, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            username = EXCLUDED.username,
            updated_at = CURRENT_TIMESTAMP`,
          [
            user.id,
            user.school_id,
            user.username || user.email,
            user.email,
            user.password_hash || user.password,
            user.first_name,
            user.last_name,
            user.phone,
            user.role || 'student',
            user.account_status || 'active',
            user.avatar_url,
            user.last_login_at,
            user.created_at,
            user.updated_at,
          ]
        );

        migratedCount++;

        if (migratedCount % 100 === 0) {
          console.log(`  ✓ Migrated ${migratedCount}/${users.length} users`);
        }
      } catch (error) {
        migrationStats.errors.push({
          table: 'users',
          id: user.id,
          error: error.message,
        });
        console.warn(`  ⚠ Failed to migrate user ${user.id}:`, error.message);
      }
    }

    migrationStats.tables.push({
      name: 'users',
      count: migratedCount,
    });

    console.log(`✅ Migrated ${migratedCount}/${users.length} users`);
    return migratedCount;
  } catch (error) {
    console.error('❌ Error migrating users:', error.message);
    migrationStats.errors.push({
      table: 'users',
      error: error.message,
    });
    return 0;
  }
}

/**
 * Migrate schools table
 */
async function migrateSchools(mysqlConn, pgPool) {
  console.log('\n📋 Migrating SCHOOLS table...');

  try {
    const [schools] = await mysqlConn.query('SELECT * FROM schools LIMIT 10000');

    console.log(`Found ${schools.length} schools to migrate`);

    if (DRY_RUN) {
      return schools.length;
    }

    let migratedCount = 0;

    for (const school of schools) {
      try {
        await pgPool.query(
          `INSERT INTO schools (
            id, name, slug, code, email, phone, website,
            address, city, state_province, postal_code, country,
            status, logo_url, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (id) DO NOTHING`,
          [
            school.id,
            school.name,
            school.slug || school.name.toLowerCase().replace(/ /g, '-'),
            school.code,
            school.email,
            school.phone,
            school.website,
            school.address,
            school.city,
            school.state_province,
            school.postal_code,
            school.country,
            school.status || 'active',
            school.logo_url,
            school.created_at,
            school.updated_at,
          ]
        );

        migratedCount++;

        if (migratedCount % 50 === 0) {
          console.log(`  ✓ Migrated ${migratedCount}/${schools.length} schools`);
        }
      } catch (error) {
        migrationStats.errors.push({
          table: 'schools',
          id: school.id,
          error: error.message,
        });
      }
    }

    migrationStats.tables.push({
      name: 'schools',
      count: migratedCount,
    });

    console.log(`✅ Migrated ${migratedCount}/${schools.length} schools`);
    return migratedCount;
  } catch (error) {
    console.error('❌ Error migrating schools:', error.message);
    migrationStats.errors.push({
      table: 'schools',
      error: error.message,
    });
    return 0;
  }
}

/**
 * Migrate classes table
 */
async function migrateClasses(mysqlConn, pgPool) {
  console.log('\n📋 Migrating CLASSES table...');

  try {
    const [classes] = await mysqlConn.query('SELECT * FROM classes LIMIT 10000');

    console.log(`Found ${classes.length} classes to migrate`);

    if (DRY_RUN) {
      return classes.length;
    }

    let migratedCount = 0;

    for (const cls of classes) {
      try {
        await pgPool.query(
          `INSERT INTO classes (
            id, school_id, name, code, level, class_teacher_id,
            max_capacity, status, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO NOTHING`,
          [
            cls.id,
            cls.school_id,
            cls.name,
            cls.code,
            cls.level,
            cls.class_teacher_id,
            cls.max_capacity,
            cls.status || 'active',
            cls.created_at,
            cls.updated_at,
          ]
        );

        migratedCount++;

        if (migratedCount % 50 === 0) {
          console.log(`  ✓ Migrated ${migratedCount}/${classes.length} classes`);
        }
      } catch (error) {
        migrationStats.errors.push({
          table: 'classes',
          id: cls.id,
          error: error.message,
        });
      }
    }

    migrationStats.tables.push({
      name: 'classes',
      count: migratedCount,
    });

    console.log(`✅ Migrated ${migratedCount}/${classes.length} classes`);
    return migratedCount;
  } catch (error) {
    console.error('❌ Error migrating classes:', error.message);
    migrationStats.errors.push({
      table: 'classes',
      error: error.message,
    });
    return 0;
  }
}

/**
 * Verify migration
 */
async function verifyMigration(mysqlConn, pgPool) {
  console.log('\n📊 Verifying migration...');

  try {
    // Check user counts
    const [mysqlUsers] = await mysqlConn.query('SELECT COUNT(*) as count FROM users');
    const pgUsers = await pgPool.query('SELECT COUNT(*) as count FROM users');

    const mysqlCount = mysqlUsers[0].count;
    const pgCount = pgUsers.rows[0].count;

    console.log(`  MySQL users: ${mysqlCount}`);
    console.log(`  PostgreSQL users: ${pgCount}`);

    if (mysqlCount === pgCount) {
      console.log('  ✅ User count matches');
    } else {
      console.warn(`  ⚠ Count mismatch: ${pgCount}/${mysqlCount}`);
    }

    // Check school counts
    const [mysqlSchools] = await mysqlConn.query('SELECT COUNT(*) as count FROM schools');
    const pgSchools = await pgPool.query('SELECT COUNT(*) as count FROM schools');

    console.log(`  MySQL schools: ${mysqlSchools[0].count}`);
    console.log(`  PostgreSQL schools: ${pgSchools.rows[0].count}`);
  } catch (error) {
    console.error('❌ Verification error:', error.message);
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting DRAIS MySQL to PostgreSQL Migration');
  console.log('================================================\n');

  if (DRY_RUN) {
    console.log('📋 DRY RUN MODE - No changes will be made\n');
  }

  const mysqlConn = await connectMySQL();
  const pgPool = await connectPostgres();

  try {
    const startTime = Date.now();

    // Migrate tables
    await migrateUsers(mysqlConn, pgPool);

    if (!USER_ONLY) {
      await migrateSchools(mysqlConn, pgPool);
      await migrateClasses(mysqlConn, pgPool);
      // Add more tables as needed
    }

    // Verify
    await verifyMigration(mysqlConn, pgPool);

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n📈 Migration Summary');
    console.log('====================');
    console.log(`Duration: ${duration}s`);
    console.log(`Tables migrated: ${migrationStats.tables.length}`);
    console.log(`Total records: ${migrationStats.tables.reduce((sum, t) => sum + t.count, 0)}`);
    console.log(`Errors: ${migrationStats.errors.length}`);

    if (migrationStats.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      migrationStats.errors.slice(0, 10).forEach((err) => {
        console.log(`  - ${err.table} ${err.id || ''}: ${err.error}`);
      });
    }

    console.log('\n✅ Migration complete!');

    if (DRY_RUN) {
      console.log('Note: This was a DRY RUN. No data was actually migrated.');
      console.log('Remove --dry-run flag to perform actual migration.');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mysqlConn.end();
    await pgPool.end();
  }
}

// Run migration
migrate().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
