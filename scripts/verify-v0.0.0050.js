#!/usr/bin/env node

/**
 * DRAIS v0.0.0050 - Verification Script
 * Checks that all new files and configurations are in place
 * 
 * Run: node scripts/verify-v0.0.0050.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function print(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.join(projectRoot, filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    const size = (stats.size / 1024).toFixed(2);
    print(`✅ ${filePath} (${size}KB)`, 'green');
    return true;
  } else {
    print(`❌ ${filePath} (MISSING)`, 'red');
    return false;
  }
}

function checkEnvVar(envFile, variable) {
  const fullPath = path.join(projectRoot, envFile);
  
  if (!fs.existsSync(fullPath)) {
    print(`⚠️  ${envFile} not found`, 'yellow');
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const hasVar = content.includes(`${variable}=`);
  
  if (hasVar) {
    const line = content.split('\n').find(l => l.startsWith(variable));
    const value = line.split('=')[1]?.substring(0, 30);
    print(`✅ ${envFile}: ${variable}=${value || '(empty)'}`, 'green');
    return true;
  } else {
    print(`⚠️  ${envFile}: ${variable} not found`, 'yellow');
    return false;
  }
}

async function main() {
  console.clear();
  print('╔════════════════════════════════════════════════════════╗', 'cyan');
  print('║      DRAIS v0.0.0050 - Verification Script            ║', 'cyan');
  print('╚════════════════════════════════════════════════════════╝', 'cyan');
  console.log('');

  let passedChecks = 0;
  const totalChecks = 25; // Update this as needed

  // Check 1: Required Package
  print('📦 Checking Dependencies', 'cyan');
  print('─────────────────────────────────────', 'cyan');
  
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
    
    if (pkg.dependencies.pg) {
      print(`✅ pg driver installed (${pkg.dependencies.pg})`, 'green');
      passedChecks++;
    } else {
      print('❌ pg driver not found in dependencies', 'red');
    }
    
    if (pkg.dependencies.mysql2) {
      print(`✅ mysql2 driver installed`, 'green');
      passedChecks++;
    }
    
    if (pkg.scripts['migrate:postgres']) {
      print(`✅ migrate:postgres script configured`, 'green');
      passedChecks++;
    } else {
      print('⚠️  migrate:postgres script not configured', 'yellow');
    }
  } catch (error) {
    print(`❌ Error reading package.json: ${error.message}`, 'red');
  }

  console.log('');

  // Check 2: Database Layer Files
  print('🗄️  Database Layer Files', 'cyan');
  print('─────────────────────────────────────', 'cyan');
  
  const dbFiles = [
    'src/lib/db/config.js',
    'src/lib/db/postgres.js',
    'src/lib/db/index-new.js',
  ];
  
  for (const file of dbFiles) {
    if (checkFile(file)) passedChecks++;
  }

  console.log('');

  // Check 3: Authentication Files
  print('🔐 Authentication Files', 'cyan');
  print('─────────────────────────────────────', 'cyan');
  
  if (checkFile('src/lib/auth/session.js')) passedChecks++;

  console.log('');

  // Check 4: API Endpoints
  print('📡 API Endpoint Files', 'cyan');
  print('─────────────────────────────────────', 'cyan');
  
  const apiFiles = [
    'src/app/api/v2/auth/login/route.js',
    'src/app/api/v2/auth/logout/route.js',
    'src/app/api/v2/auth/me/route.js',
    'src/app/api/v2/test-db/route.js',
  ];
  
  for (const file of apiFiles) {
    if (checkFile(file)) passedChecks++;
  }

  console.log('');

  // Check 5: Utility Scripts
  print('🛠️  Utility Scripts', 'cyan');
  print('─────────────────────────────────────', 'cyan');
  
  const scripts = [
    'scripts/migrate-to-postgres.js',
    'scripts/seed-postgres-data.js',
  ];
  
  for (const file of scripts) {
    if (checkFile(file)) passedChecks++;
  }

  console.log('');

  // Check 6: Documentation
  print('📖 Documentation Files', 'cyan');
  print('─────────────────────────────────────', 'cyan');
  
  const docs = [
    'IMPLEMENTATION_v0.0.0050_DATABASE_AUTH.md',
    'QUICK_REFERENCE_v0.0.0050.md',
    'DEPLOYMENT_v0.0.0050.md',
    'SUMMARY_v0.0.0050.md',
    'README_v0.0.0050.md',
  ];
  
  for (const doc of docs) {
    if (checkFile(doc)) passedChecks++;
  }

  console.log('');

  // Check 7: Environment Configuration
  print('⚙️  Environment Configuration', 'cyan');
  print('─────────────────────────────────────', 'cyan');
  
  if (checkEnvVar('.env.local', 'PRIMARY_DB')) passedChecks++;
  if (checkEnvVar('.env.local', 'SESSION_SECRET')) passedChecks++;

  console.log('');

  // Check 8: Project Structure
  print('📁 Project Structure', 'cyan');
  print('─────────────────────────────────────', 'cyan');
  
  const dirs = [
    'src/lib/db',
    'src/lib/auth',
    'src/app/api/v2',
  ];
  
  for (const dir of dirs) {
    const fullPath = path.join(projectRoot, dir);
    if (fs.existsSync(fullPath)) {
      print(`✅ ${dir}/ exists`, 'green');
      passedChecks++;
    } else {
      print(`❌ ${dir}/ not found`, 'red');
    }
  }

  console.log('');

  // Summary
  print('═════════════════════════════════════════════════════════', 'cyan');
  print('Summary', 'cyan');
  print('═════════════════════════════════════════════════════════', 'cyan');
  
  const percentage = Math.round((passedChecks / totalChecks) * 100);
  
  if (passedChecks === totalChecks) {
    print(`✅ All checks passed! (${passedChecks}/${totalChecks})`, 'green');
    print('', 'reset');
    print('You are ready to:', 'green');
    print('1. Configure database in .env.local', 'green');
    print('2. Run migration: npm run migrate:postgres', 'green');
    print('3. Seed data: node scripts/seed-postgres-data.js', 'green');
    print('4. Start server: npm run dev', 'green');
    print('5. Test endpoints', 'green');
  } else {
    print(`⚠️  Some checks failed (${passedChecks}/${totalChecks} - ${percentage}%)`, 'yellow');
    print('', 'reset');
    print('Please check the failed items above.', 'yellow');
    print('Refer to IMPLEMENTATION_v0.0.0050_DATABASE_AUTH.md for help.', 'yellow');
  }

  console.log('');
  print('═════════════════════════════════════════════════════════', 'cyan');
  print('Next Steps', 'cyan');
  print('═════════════════════════════════════════════════════════', 'cyan');
  print('', 'reset');
  print('📖 Read documentation:', 'bold');
  print('   • QUICK_REFERENCE_v0.0.0050.md - Quick start', 'cyan');
  print('   • IMPLEMENTATION_v0.0.0050_DATABASE_AUTH.md - Full guide', 'cyan');
  print('   • DEPLOYMENT_v0.0.0050.md - Deploy to production', 'cyan');
  console.log('');
  print('🚀 Start developing:', 'bold');
  print('   npm run dev', 'cyan');
  console.log('');
  print('🧪 Test endpoints:', 'bold');
  print('   curl http://localhost:3000/api/v2/test-db', 'cyan');
  console.log('');
}

main().catch(error => {
  print(`Error: ${error.message}`, 'red');
  process.exit(1);
});
