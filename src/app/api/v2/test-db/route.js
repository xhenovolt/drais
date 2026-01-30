/**
 * Database Connection Test Endpoint
 * GET /api/v2/test-db
 * 
 * DRAIS v0.0.0050
 * Tests database connectivity - now with PostgreSQL Neon support
 */

import { NextResponse } from 'next/server';
import { getPrimaryDatabase, getDatabaseConfig } from '@/lib/db/config.js';
import db from '@/lib/db/index.js';

export async function GET(request) {
  try {
    const dbType = getPrimaryDatabase();
    const config = getDatabaseConfig();

    // Try a simple query
    const result = await db.query('SELECT 1 as test_value', []);

    // Get database info
    let dbInfo = {
      database: dbType,
      connected: true,
      timestamp: new Date().toISOString(),
      config: {
        host: config.host || config.connectionString?.split('@')[1]?.split(':')[0] || 'N/A',
        port: config.port || 'N/A',
        database: config.database || 'N/A',
      },
    };

    // Get table count
    let tableCount = 0;
    let tables = [];

    try {
      if (dbType === 'mysql' || dbType === 'postgres') {
        let tableQuery;
        if (dbType === 'mysql') {
          tableQuery = `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = '${config.database}' AND TABLE_TYPE = 'BASE TABLE'`;
        } else {
          tableQuery = `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`;
        }

        const tableResults = await db.query(tableQuery, []);
        tables = tableResults.map(row => {
          if (dbType === 'mysql') {
            return row.TABLE_NAME;
          } else {
            return row.table_name;
          }
        });
        tableCount = tables.length;
      }
    } catch (error) {
      console.warn('Could not retrieve table info:', error.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Database connection successful',
        ...dbInfo,
        tableCount,
        tables: tables.slice(0, 20), // Show first 20 tables
        totalTablesShown: Math.min(20, tableCount),
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Database test error:', error.message);

    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error.message,
        database: getPrimaryDatabase(),
        debugging: {
          message: 'Check .env.local configuration',
          hint: 'Make sure DATABASE_URL or individual database credentials are set correctly',
        },
      },
      { status: 500 }
    );
  }
}
