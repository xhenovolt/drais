/**
 * Database Connection Test Endpoint
 * GET /api/test-db
 */

import db from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api/responses';

export async function GET(request) {
  try {
    const dbType = db.getType();
    
    // Test basic query
    if (dbType === 'mysql') {
      const result = await db.query('SELECT 1 as test');
      
      return successResponse({
        database: dbType,
        connected: true,
        testQuery: result,
        message: 'MySQL database connection successful',
      });
    } else if (dbType === 'mongodb') {
      // MongoDB test
      const result = await db.findMany('school', { limit: 1 });
      
      return successResponse({
        database: dbType,
        connected: true,
        testQuery: result,
        message: 'MongoDB database connection successful',
      });
    }
    
    return errorResponse('Unsupported database type', 500);
  } catch (error) {
    console.error('Database test error:', error);
    
    return errorResponse(
      'Database connection failed',
      500,
      {
        message: error.message,
        type: db.getType(),
      }
    );
  }
}
