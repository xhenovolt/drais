/**
 * Temporary Admin Endpoint to Apply Onboarding Migration
 * POST /api/admin/apply-migration
 * 
 * Only for development - applies the missing database columns
 */

import { NextResponse } from 'next/server';
import db from '@/lib/db/index.js';

export async function POST(request) {
  try {
    console.log('🔄 Applying onboarding_completed migration...');

    // Add onboarding_completed column
    await db.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
    `);
    console.log('✅ Column onboarding_completed added');

    // Add onboarding_completed_at column
    await db.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP;
    `);
    console.log('✅ Column onboarding_completed_at added');

    // Create index
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_users_onboarding_completed 
      ON users(onboarding_completed, school_id);
    `);
    console.log('✅ Index created');

    return NextResponse.json(
      { success: true, message: '✅ Migration applied successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
