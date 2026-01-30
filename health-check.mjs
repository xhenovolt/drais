#!/usr/bin/env node

/**
 * Minimal health check test
 */

async function test() {
  try {
    const response = await fetch('http://localhost:3000/', { signal: AbortSignal.timeout(3000) });
    console.log('✓ Server is running, status:', response.status);
    return true;
  } catch (err) {
    console.log('✗ Server not responding:', err.message);
    return false;
  }
}

test().then(ok => process.exit(ok ? 0 : 1));
