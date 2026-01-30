#!/usr/bin/env node

/**
 * Seed Database with Test Data
 * DRAIS v0.0.0050
 * 
 * Creates realistic test data for development and testing
 * 
 * Run: node scripts/seed-postgres-data.js
 */

import db from '../src/lib/db/index-new.js';
import { hashPassword } from '../src/lib/auth/jwt-enhanced.js';

const PASSWORD_HASH_PROMISE = hashPassword('TestPassword@123');

async function seedData() {
  console.log('🚀 Starting database seeding...');
  console.log('');

  try {
    const dbType = db.getType();
    console.log(`📊 Target Database: ${dbType.toUpperCase()}`);
    console.log('');

    // Step 1: Create School
    console.log('📍 Creating schools...');
    const schools = [];

    const schoolData = [
      {
        name: 'Test Academy',
        code: 'TAC001',
        country: 'Uganda',
        county: 'Kampala',
        email: 'admin@testacademy.com',
        phone: '+256700000001',
        principal_name: 'Dr. John Ssemakula',
        principal_email: 'john@testacademy.com',
        school_type: 'Secondary',
        year_established: 2010,
      },
      {
        name: 'Excellence Primary School',
        code: 'EPS001',
        country: 'Uganda',
        county: 'Kampala',
        email: 'admin@excellenceprimary.com',
        phone: '+256700000002',
        principal_name: 'Mrs. Grace Nakiguli',
        principal_email: 'grace@excellenceprimary.com',
        school_type: 'Primary',
        year_established: 2005,
      },
    ];

    for (const school of schoolData) {
      const result = await db.insert('schools', school);
      schools.push(result.insertId);
      console.log(`  ✓ Created school: ${school.name}`);
    }

    // Step 2: Create Users
    console.log('');
    console.log('👥 Creating users...');

    const passwordHash = await PASSWORD_HASH_PROMISE;
    const users = [];

    // Super Admin
    const superAdmin = await db.insert('users', {
      email: 'superadmin@drais.com',
      username: 'superadmin',
      first_name: 'Super',
      last_name: 'Admin',
      password_hash: passwordHash,
      role: 'super_admin',
      status: 'active',
      phone: '+256700000010',
    });
    users.push(superAdmin.insertId);
    console.log('  ✓ Created super admin: superadmin@drais.com');

    // School Admins
    for (let i = 0; i < schools.length; i++) {
      const admin = await db.insert('users', {
        email: `admin${i + 1}@testacademy.com`,
        username: `admin${i + 1}`,
        first_name: 'Admin',
        last_name: `School ${i + 1}`,
        password_hash: passwordHash,
        role: 'admin',
        school_id: schools[i],
        status: 'active',
        phone: `+25670000001${i}`,
      });
      users.push(admin.insertId);
      console.log(`  ✓ Created school admin: admin${i + 1}@testacademy.com`);
    }

    // Teachers
    const teacherNames = [
      { first: 'James', last: 'Kyagaba', subject: 'Mathematics' },
      { first: 'Sarah', last: 'Mukisa', subject: 'English' },
      { first: 'Peter', last: 'Ochieng', subject: 'Science' },
      { first: 'Mary', last: 'Namayanja', subject: 'History' },
    ];

    const teachers = [];
    for (const teacherName of teacherNames) {
      const teacher = await db.insert('users', {
        email: `${teacherName.first.toLowerCase()}@testacademy.com`,
        username: `${teacherName.first.toLowerCase()}teacher`,
        first_name: teacherName.first,
        last_name: teacherName.last,
        password_hash: passwordHash,
        role: 'teacher',
        school_id: schools[0],
        status: 'active',
        phone: `+256700${Math.random().toString().substring(2, 8)}`,
      });
      teachers.push(teacher.insertId);
      console.log(`  ✓ Created teacher: ${teacherName.first} ${teacherName.last}`);
    }

    // Students
    const studentNames = [
      { first: 'John', last: 'Banda' },
      { first: 'Alice', last: 'Mutesi' },
      { first: 'Charles', last: 'Kiplagat' },
      { first: 'Diana', last: 'Adeyemi' },
      { first: 'Emmanuel', last: 'Okonkwo' },
      { first: 'Fatima', last: 'Ahmed' },
      { first: 'George', last: 'Mwangi' },
      { first: 'Hope', last: 'Chimezie' },
      { first: 'Isaac', last: 'Duru' },
      { first: 'Jennifer', last: 'Mensah' },
    ];

    const students = [];
    for (const studentName of studentNames) {
      const student = await db.insert('users', {
        email: `${studentName.first.toLowerCase()}@student.com`,
        username: `${studentName.first.toLowerCase()}student`,
        first_name: studentName.first,
        last_name: studentName.last,
        password_hash: passwordHash,
        role: 'student',
        school_id: schools[0],
        status: 'active',
        date_of_birth: new Date(2006 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        phone: `+256700${Math.random().toString().substring(2, 8)}`,
      });
      students.push(student.insertId);
      console.log(`  ✓ Created student: ${studentName.first} ${studentName.last}`);
    }

    // Step 3: Create Classes
    console.log('');
    console.log('🎓 Creating classes...');

    const classes = [];
    const classData = [
      { name: 'S4A', level: 'Senior 4', stream: 'A', teacher_id: teachers[0] },
      { name: 'S4B', level: 'Senior 4', stream: 'B', teacher_id: teachers[1] },
      { name: 'S3A', level: 'Senior 3', stream: 'A', teacher_id: teachers[2] },
    ];

    for (const classInfo of classData) {
      const classRecord = await db.insert('classes', {
        school_id: schools[0],
        name: classInfo.name,
        level: classInfo.level,
        stream: classInfo.stream,
        capacity: 45,
        teacher_id: classInfo.teacher_id,
      });
      classes.push(classRecord.insertId);
      console.log(`  ✓ Created class: ${classInfo.name}`);
    }

    // Step 4: Create Subjects
    console.log('');
    console.log('📚 Creating subjects...');

    const subjects = [];
    const subjectData = [
      { name: 'Mathematics', code: 'MATH101' },
      { name: 'English Language', code: 'ENG101' },
      { name: 'Biology', code: 'BIO101' },
      { name: 'Chemistry', code: 'CHM101' },
      { name: 'Physics', code: 'PHY101' },
      { name: 'History', code: 'HST101' },
      { name: 'Geography', code: 'GEO101' },
      { name: 'Literature', code: 'LIT101' },
    ];

    for (const subject of subjectData) {
      const subjectRecord = await db.insert('subjects', {
        school_id: schools[0],
        name: subject.name,
        code: subject.code,
        description: `${subject.name} course for Senior students`,
      });
      subjects.push(subjectRecord.insertId);
      console.log(`  ✓ Created subject: ${subject.name}`);
    }

    // Step 5: Create Student Records
    console.log('');
    console.log('📋 Creating student records...');

    for (let i = 0; i < students.length; i++) {
      const studentRecord = await db.insert('students', {
        user_id: students[i],
        school_id: schools[0],
        admission_number: `ADM${String(i + 1).padStart(4, '0')}`,
        class_id: classes[i % classes.length],
        stream: classData[i % classes.length].stream,
        date_of_birth: new Date(2006 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        gender: i % 2 === 0 ? 'Male' : 'Female',
        mother_name: `Mother of ${studentNames[i].first}`,
        father_name: `Father of ${studentNames[i].first}`,
        guardian_phone: `+256700${Math.random().toString().substring(2, 8)}`,
      });
      console.log(`  ✓ Created student record: ${studentNames[i].first}`);
    }

    // Step 6: Create Teacher Records
    console.log('');
    console.log('👨‍🏫 Creating teacher records...');

    for (let i = 0; i < teachers.length; i++) {
      const teacherRecord = await db.insert('teachers', {
        user_id: teachers[i],
        school_id: schools[0],
        employee_number: `EMP${String(i + 1000).padStart(5, '0')}`,
        qualification: 'Bachelor of Education',
        specialization: teacherNames[i].subject,
        department: 'Academics',
        employment_date: new Date(2015 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 12), 1),
        status: 'active',
      });
      console.log(`  ✓ Created teacher record: ${teacherNames[i].first} ${teacherNames[i].last}`);
    }

    // Summary
    console.log('');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('');
    console.log('📊 Data Summary:');
    console.log(`  • Schools: ${schools.length}`);
    console.log(`  • Users: ${users.length + teachers.length + students.length}`);
    console.log(`  • Teachers: ${teachers.length}`);
    console.log(`  • Students: ${students.length}`);
    console.log(`  • Classes: ${classes.length}`);
    console.log(`  • Subjects: ${subjects.length}`);
    console.log('');
    console.log('🔐 Test Credentials:');
    console.log('  Email: superadmin@drais.com');
    console.log('  Password: TestPassword@123');
    console.log('');
    console.log('🚀 Ready to test! Start the server with: npm run dev');

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error('');
    console.error('Debug Info:');
    console.error('- Check database connection');
    console.error('- Ensure PRIMARY_DB is set correctly');
    console.error('- Verify all credentials in .env.local');
    console.error('');
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run seeding
seedData();
