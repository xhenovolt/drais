/**
 * Students Module Database Schema Migration
 * DRAIS v0.0.0300 - Production Implementation
 * 
 * Creates all tables required for the Students Module:
 * - students (core table - extend if exists)
 * - classes (academic classes)
 * - student_admissions (admission tracking)
 * - student_promotions (promotion history)
 * - student_discipline (disciplinary records)
 * - student_suspensions (suspension records)
 * - student_transactions (pocket money ledger)
 * - student_audit_log (audit trail)
 * - student_id_cards (ID card generation)
 * - import_logs (bulk import tracking)
 * 
 * All tables are school-scoped with school_id
 */

const { getPool } = require('../src/lib/db/postgres');

async function createStudentsSchema() {
  const pool = await getPool();
  const client = await pool.connect();

  try {
    console.log('🔧 Creating Students Module Schema...\n');

    // 1. Verify schools table exists
    console.log('1️⃣  Verifying schools table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE,
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(100),
        website VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('  ✓ Schools table ready\n');

    // 2. Create/extend students table
    console.log('2️⃣  Creating students table...');
    
    // First check if table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'students'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      // Create new table
      await client.query(`
        CREATE TABLE students (
          id BIGSERIAL PRIMARY KEY,
          school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
          admission_number VARCHAR(100) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          middle_name VARCHAR(100),
          last_name VARCHAR(100) NOT NULL,
          gender VARCHAR(20),
          date_of_birth DATE,
          class_id BIGINT,
          stream_id BIGINT,
          status VARCHAR(50) DEFAULT 'active',
          enrollment_date DATE DEFAULT CURRENT_DATE,
          guardian_name VARCHAR(255),
          guardian_phone VARCHAR(20),
          guardian_email VARCHAR(100),
          address TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP DEFAULT NULL,
          
          UNIQUE(school_id, admission_number),
          INDEX idx_students_school (school_id),
          INDEX idx_students_status (status),
          INDEX idx_students_class (class_id),
          INDEX idx_students_admission_no (admission_number)
        );
      `);
    } else {
      // Table exists - add missing columns safely
      const columnsResult = await client.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'students'
      `);
      const columns = columnsResult.rows.map(r => r.column_name);

      // Add columns that don't exist
      const columnsToAdd = {
        school_id: 'BIGINT NOT NULL DEFAULT 1',
        middle_name: 'VARCHAR(100)',
        stream_id: 'BIGINT',
        guardian_name: 'VARCHAR(255)',
        guardian_phone: 'VARCHAR(20)',
        guardian_email: 'VARCHAR(100)',
        address: 'TEXT',
        deleted_at: 'TIMESTAMP DEFAULT NULL'
      };

      for (const [col, type] of Object.entries(columnsToAdd)) {
        if (!columns.includes(col)) {
          try {
            await client.query(`ALTER TABLE students ADD COLUMN ${col} ${type};`);
            console.log(`  ✓ Added column: ${col}`);
          } catch (err) {
            if (!err.message.includes('already exists')) {
              console.log(`  ⚠️  Column ${col}: ${err.message}`);
            }
          }
        }
      }

      // Add unique constraint if not exists
      try {
        await client.query(`
          ALTER TABLE students 
          ADD CONSTRAINT unique_admission_per_school 
          UNIQUE(school_id, admission_number);
        `);
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.log(`  ℹ️  Unique constraint: ${err.message}`);
        }
      }
    }
    console.log('  ✓ Students table ready\n');

    // 3. Create classes table
    console.log('3️⃣  Creating classes table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS classes (
        id BIGSERIAL PRIMARY KEY,
        school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        level VARCHAR(50),
        stream VARCHAR(50),
        capacity INT DEFAULT 40,
        class_teacher_id BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP DEFAULT NULL,
        
        UNIQUE(school_id, name),
        INDEX idx_classes_school (school_id)
      );
    `);
    console.log('  ✓ Classes table ready\n');

    // 4. Create student_admissions table
    console.log('4️⃣  Creating student_admissions table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_admissions (
        id BIGSERIAL PRIMARY KEY,
        school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        admission_number VARCHAR(100) NOT NULL,
        admission_date DATE NOT NULL,
        admission_type VARCHAR(50) DEFAULT 'regular',
        previous_school VARCHAR(255),
        remarks TEXT,
        admitted_by BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        UNIQUE(student_id),
        INDEX idx_admissions_school (school_id),
        INDEX idx_admissions_admission_no (admission_number)
      );
    `);
    console.log('  ✓ Student Admissions table ready\n');

    // 5. Create student_promotions table
    console.log('5️⃣  Creating student_promotions table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_promotions (
        id BIGSERIAL PRIMARY KEY,
        school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        from_class_id BIGINT REFERENCES classes(id),
        to_class_id BIGINT NOT NULL REFERENCES classes(id),
        promotion_date DATE NOT NULL,
        academic_year VARCHAR(20),
        promotion_reason VARCHAR(255),
        promoted_by BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_promotions_school (school_id),
        INDEX idx_promotions_student (student_id)
      );
    `);
    console.log('  ✓ Student Promotions table ready\n');

    // 6. Create student_discipline table
    console.log('6️⃣  Creating student_discipline table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_discipline (
        id BIGSERIAL PRIMARY KEY,
        school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        incident_type VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        incident_date DATE NOT NULL,
        action_taken VARCHAR(255),
        responsible_staff_id BIGINT,
        severity VARCHAR(50) DEFAULT 'minor',
        is_resolved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_discipline_school (school_id),
        INDEX idx_discipline_student (student_id),
        INDEX idx_discipline_date (incident_date)
      );
    `);
    console.log('  ✓ Student Discipline table ready\n');

    // 7. Create student_suspensions table
    console.log('7️⃣  Creating student_suspensions table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_suspensions (
        id BIGSERIAL PRIMARY KEY,
        school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        reason VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        status VARCHAR(50) DEFAULT 'active',
        notes TEXT,
        suspended_by BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_suspensions_school (school_id),
        INDEX idx_suspensions_student (student_id),
        INDEX idx_suspensions_status (status)
      );
    `);
    console.log('  ✓ Student Suspensions table ready\n');

    // 8. Create student_transactions table (pocket money)
    console.log('8️⃣  Creating student_transactions table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_transactions (
        id BIGSERIAL PRIMARY KEY,
        school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        transaction_type VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        balance_before DECIMAL(10, 2),
        balance_after DECIMAL(10, 2),
        description TEXT,
        reference_number VARCHAR(100),
        performed_by BIGINT,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_transactions_school (school_id),
        INDEX idx_transactions_student (student_id),
        INDEX idx_transactions_date (transaction_date),
        INDEX idx_transactions_type (transaction_type)
      );
    `);
    console.log('  ✓ Student Transactions table ready\n');

    // 9. Create student_audit_log table
    console.log('9️⃣  Creating student_audit_log table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_audit_log (
        id BIGSERIAL PRIMARY KEY,
        school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        user_id BIGINT,
        entity_type VARCHAR(100) NOT NULL,
        entity_id BIGINT NOT NULL,
        action VARCHAR(50) NOT NULL,
        changes JSONB,
        reason TEXT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_audit_school (school_id),
        INDEX idx_audit_entity (entity_type, entity_id),
        INDEX idx_audit_action (action),
        INDEX idx_audit_date (created_at)
      );
    `);
    console.log('  ✓ Student Audit Log table ready\n');

    // 10. Create student_id_cards table
    console.log('🔟 Creating student_id_cards table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_id_cards (
        id BIGSERIAL PRIMARY KEY,
        school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        card_number VARCHAR(100) UNIQUE NOT NULL,
        issue_date DATE DEFAULT CURRENT_DATE,
        expiry_date DATE,
        photo_url VARCHAR(500),
        qr_code_url VARCHAR(500),
        barcode_url VARCHAR(500),
        generated_by BIGINT,
        generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        printed BOOLEAN DEFAULT FALSE,
        printed_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        UNIQUE(student_id),
        INDEX idx_id_cards_school (school_id),
        INDEX idx_id_cards_card_number (card_number)
      );
    `);
    console.log('  ✓ Student ID Cards table ready\n');

    // 11. Create import_logs table
    console.log('1️⃣1️⃣  Creating import_logs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS import_logs (
        id BIGSERIAL PRIMARY KEY,
        school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
        import_type VARCHAR(100) NOT NULL,
        file_name VARCHAR(255),
        file_size INT,
        total_rows INT,
        successful_rows INT,
        failed_rows INT,
        status VARCHAR(50) DEFAULT 'pending',
        errors JSONB,
        import_data JSONB,
        imported_by BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        
        INDEX idx_import_school (school_id),
        INDEX idx_import_status (status),
        INDEX idx_import_date (created_at)
      );
    `);
    console.log('  ✓ Import Logs table ready\n');

    // 12. Create student_balance view (current pocket money balance)
    console.log('1️⃣2️⃣  Creating student_balance view...');
    try {
      await client.query(`
        CREATE OR REPLACE VIEW student_balance AS
        SELECT 
          school_id,
          student_id,
          COALESCE(SUM(
            CASE 
              WHEN transaction_type = 'credit' THEN amount
              WHEN transaction_type = 'debit' THEN -amount
              ELSE 0
            END
          ), 0) as current_balance
        FROM student_transactions
        WHERE deleted_at IS NULL
        GROUP BY school_id, student_id;
      `);
      console.log('  ✓ Student Balance view ready\n');
    } catch (err) {
      console.log('  ⚠️  View creation note:', err.message.substring(0, 50));
    }

    // 13. Create indexes for performance
    console.log('1️⃣3️⃣  Creating performance indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_students_school_status ON students(school_id, status);',
      'CREATE INDEX IF NOT EXISTS idx_students_dob ON students(date_of_birth);',
      'CREATE INDEX IF NOT EXISTS idx_classes_school_name ON classes(school_id, name);',
      'CREATE INDEX IF NOT EXISTS idx_admissions_date ON student_admissions(admission_date);',
      'CREATE INDEX IF NOT EXISTS idx_promotions_date ON student_promotions(promotion_date);',
      'CREATE INDEX IF NOT EXISTS idx_discipline_severity ON student_discipline(severity);',
      'CREATE INDEX IF NOT EXISTS idx_suspensions_dates ON student_suspensions(start_date, end_date);',
      'CREATE INDEX IF NOT EXISTS idx_transactions_balance ON student_transactions(student_id, created_at);'
    ];

    for (const idx of indexes) {
      try {
        await client.query(idx);
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.log(`  ⚠️  Index: ${err.message.substring(0, 50)}`);
        }
      }
    }
    console.log('  ✓ Performance indexes created\n');

    console.log('✅ Students Module Schema Created Successfully!\n');
    console.log('📊 Tables created:');
    console.log('   - students (core)');
    console.log('   - classes (academic structure)');
    console.log('   - student_admissions (admission tracking)');
    console.log('   - student_promotions (promotion history)');
    console.log('   - student_discipline (disciplinary records)');
    console.log('   - student_suspensions (suspension tracking)');
    console.log('   - student_transactions (pocket money ledger)');
    console.log('   - student_audit_log (audit trail)');
    console.log('   - student_id_cards (ID card generation)');
    console.log('   - import_logs (bulk import tracking)');
    console.log('   - student_balance (current balance view)\n');

  } catch (error) {
    console.error('❌ Schema creation failed:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  createStudentsSchema()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { createStudentsSchema };
