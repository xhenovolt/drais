#!/usr/bin/env node

/**
 * Generate Secure JWT Secrets for DRAIS
 * Auto-generates cryptographically strong secrets and updates .env
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Generate a cryptographically secure random string
 */
function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('base64url');
}

/**
 * Update or create .env file with JWT secrets
 */
function updateEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');

  // Generate secrets
  const jwtAccessSecret = generateSecret(64);
  const jwtRefreshSecret = generateSecret(64);
  const sessionSecret = generateSecret(48);

  console.log('🔐 Generated Secure JWT Secrets\n');
  console.log('JWT_ACCESS_SECRET:', jwtAccessSecret);
  console.log('JWT_REFRESH_SECRET:', jwtRefreshSecret);
  console.log('SESSION_SECRET:', sessionSecret);
  console.log('');

  // Check if .env exists
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ Found existing .env file');
  } else if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf8');
    console.log('✅ Copying from .env.example');
  } else {
    console.log('⚠️  No .env or .env.example found, creating new file');
  }

  // Update JWT secrets
  const updates = {
    JWT_ACCESS_SECRET: jwtAccessSecret,
    JWT_REFRESH_SECRET: jwtRefreshSecret,
    ACCESS_TOKEN_EXPIRES: '15m',
    REFRESH_TOKEN_EXPIRES: '7d',
    SESSION_SECRET: sessionSecret,
  };

  // Apply updates
  Object.entries(updates).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      // Update existing
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      // Add new (in authentication section)
      if (envContent.includes('# Authentication & Security')) {
        envContent = envContent.replace(
          /(# Authentication & Security[\s\S]*?)(\n# |$)/,
          `$1${key}=${value}\n$2`
        );
      } else {
        // Add section if not exists
        envContent += `\n# Authentication & Security\n${key}=${value}\n`;
      }
    }
  });

  // Write updated .env
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Updated .env file with secure JWT secrets');
  console.log('📁 Location:', envPath);
  console.log('\n⚠️  IMPORTANT: Keep these secrets secure and never commit .env to version control!');
}

// Run
try {
  updateEnvFile();
  process.exit(0);
} catch (error) {
  console.error('❌ Error generating secrets:', error.message);
  process.exit(1);
}
