/**
 * Students Module Test Suite
 * DRAIS v0.0.0300 - Validation & Verification
 * 
 * Run: node test-students-module.mjs
 */

import http from 'http';

const BASE_URL = 'http://localhost:3000';
const SESSION_COOKIE = process.env.SESSION_COOKIE || 'test_session_value';

class TestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  async test(name, fn) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      this.passed++;
    } catch (err) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${err.message}`);
      this.failed++;
    }
  }

  report() {
    console.log('\n' + '='.repeat(50));
    console.log(`Tests Passed: ${this.passed}`);
    console.log(`Tests Failed: ${this.failed}`);
    console.log(`Total: ${this.passed + this.failed}`);
    console.log('='.repeat(50));
    process.exit(this.failed > 0 ? 1 : 0);
  }
}

async function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `jeton_session=${SESSION_COOKIE}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null,
            headers: res.headers
          });
        } catch (err) {
          resolve({
            status: res.statusCode,
            body: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  const runner = new TestRunner();

  console.log('Starting Students Module Test Suite...\n');

  // Test 1: Admissions API - List (empty)
  await runner.test('GET /api/modules/students/admissions returns 200', async () => {
    const res = await makeRequest('/api/modules/students/admissions');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });

  // Test 2: Admissions API - Create without required field
  await runner.test('POST /api/modules/students/admissions requires admission_number', async () => {
    const res = await makeRequest('/api/modules/students/admissions', 'POST', {
      first_name: 'John',
      last_name: 'Doe'
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // Test 3: Admissions API - Create with valid data
  let studentId = null;
  await runner.test('POST /api/modules/students/admissions creates student', async () => {
    const res = await makeRequest('/api/modules/students/admissions', 'POST', {
      admission_number: `ADM-2024-${Date.now()}`,
      first_name: 'Test',
      last_name: 'Student',
      gender: 'male',
      date_of_birth: '2010-01-15',
      guardian_name: 'Test Guardian'
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    if (!res.body?.data?.id) throw new Error('No student ID returned');
    studentId = res.body.data.id;
  });

  // Test 4: Admissions API - Get single student
  if (studentId) {
    await runner.test('GET /api/modules/students/admissions/[id] returns student', async () => {
      const res = await makeRequest(`/api/modules/students/admissions/${studentId}`);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      if (res.body?.data?.id !== studentId) throw new Error('Wrong student returned');
    });
  }

  // Test 5: Admissions API - Update student
  if (studentId) {
    await runner.test('PATCH /api/modules/students/admissions/[id] updates student', async () => {
      const res = await makeRequest(`/api/modules/students/admissions/${studentId}`, 'PATCH', {
        guardian_phone: '+256700000000'
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    });
  }

  // Test 6: Pocket Money API - Create transaction
  if (studentId) {
    await runner.test('POST /api/modules/students/pocket-money creates transaction', async () => {
      const res = await makeRequest('/api/modules/students/pocket-money', 'POST', {
        student_id: studentId,
        transaction_type: 'credit',
        amount: 50000,
        description: 'Test credit'
      });
      if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
      if (!res.body?.data?.balance_after) throw new Error('No balance returned');
    });
  }

  // Test 7: Pocket Money API - List transactions
  if (studentId) {
    await runner.test('GET /api/modules/students/pocket-money lists transactions', async () => {
      const res = await makeRequest(`/api/modules/students/pocket-money?student_id=${studentId}`);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      if (!Array.isArray(res.body?.data)) throw new Error('Data is not an array');
    });
  }

  // Test 8: Discipline API - Record incident
  if (studentId) {
    await runner.test('POST /api/modules/students/discipline records incident', async () => {
      const res = await makeRequest('/api/modules/students/discipline', 'POST', {
        student_id: studentId,
        incident_type: 'Late Arrival',
        description: 'Test incident',
        incident_date: new Date().toISOString().split('T')[0],
        severity: 'minor'
      });
      if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    });
  }

  // Test 9: Discipline API - List incidents
  if (studentId) {
    await runner.test('GET /api/modules/students/discipline lists incidents', async () => {
      const res = await makeRequest(`/api/modules/students/discipline?student_id=${studentId}`);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    });
  }

  // Test 10: ID Cards API - Generate card
  if (studentId) {
    await runner.test('POST /api/modules/students/id-cards generates ID card', async () => {
      const res = await makeRequest('/api/modules/students/id-cards', 'POST', {
        student_id: studentId,
        expiry_years: 1
      });
      if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
      if (!res.body?.data?.card_number) throw new Error('No card number returned');
    });
  }

  // Test 11: Suspensions API - Suspend student
  if (studentId) {
    await runner.test('POST /api/modules/students/suspended suspends student', async () => {
      const res = await makeRequest('/api/modules/students/suspended', 'POST', {
        student_id: studentId,
        reason: 'Test suspension',
        start_date: new Date().toISOString().split('T')[0]
      });
      if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    });
  }

  // Test 12: Admissions API - Delete student
  if (studentId) {
    await runner.test('DELETE /api/modules/students/admissions/[id] soft deletes', async () => {
      const res = await makeRequest(`/api/modules/students/admissions/${studentId}`, 'DELETE', {
        reason: 'Test deletion'
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    });
  }

  // Test 13: Missing authentication
  await runner.test('Requests without session return 401', async () => {
    // Make request without session cookie
    const url = new URL('/api/modules/students/admissions', BASE_URL);
    const options = {
      method: 'GET',
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname,
      headers: {
        'Content-Type': 'application/json'
        // No cookie
      }
    };

    const res = await new Promise((resolve) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null });
        });
      });
      req.on('error', () => resolve({ status: 0 }));
      req.end();
    });

    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // Test 14: Invalid JSON in request
  await runner.test('Invalid JSON returns 400', async () => {
    const url = new URL('/api/modules/students/admissions', BASE_URL);
    const options = {
      method: 'POST',
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `jeton_session=${SESSION_COOKIE}`
      }
    };

    const res = await new Promise((resolve) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({ status: res.statusCode });
        });
      });
      req.on('error', () => resolve({ status: 0 }));
      req.write('invalid json');
      req.end();
    });

    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // Summary
  console.log('\n');
  runner.report();
}

// Run tests
console.log(`\n🧪 Students Module Test Suite`);
console.log(`Base URL: ${BASE_URL}`);
console.log(`Session: ${SESSION_COOKIE}\n`);
console.log('Note: This test assumes the server is running and using the test session.\n');

runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
