import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db/postgres.js';

export async function GET(request) {
  try {
    const pool = await getPool();
    
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name='students' 
      ORDER BY ordinal_position
    `);
    
    return NextResponse.json({
      columns: result.rows
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
