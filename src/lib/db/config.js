/**
 * Database Configuration Manager
 * DRAIS v0.0.0050
 * 
 * Unified database configuration with support for MySQL, PostgreSQL, and MongoDB
 * Single PRIMARY_DB variable controls which database engine to use
 */

const PRIMARY_DB = process.env.PRIMARY_DB || 'mysql';

// Validate PRIMARY_DB value
const supportedDatabases = ['mysql', 'postgres', 'mongodb'];
if (!supportedDatabases.includes(PRIMARY_DB)) {
  throw new Error(
    `Invalid PRIMARY_DB: ${PRIMARY_DB}. Supported: ${supportedDatabases.join(', ')}`
  );
}

/**
 * Get database configuration based on PRIMARY_DB
 */
export function getDatabaseConfig() {
  switch (PRIMARY_DB) {
    case 'postgres':
      return {
        type: 'postgres',
        engine: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || '',
        database: process.env.POSTGRES_DATABASE || 'drais',
        // Connection pool settings - increased for Neon/serverless
        max: parseInt(process.env.POSTGRES_POOL_MAX || '5'),
        idleTimeoutMillis: parseInt(process.env.POSTGRES_IDLE_TIMEOUT || '10000'),
        connectionTimeoutMillis: parseInt(process.env.POSTGRES_CONNECTION_TIMEOUT || '15000'),
        statementTimeoutMillis: parseInt(process.env.POSTGRES_STATEMENT_TIMEOUT || '30000'),
        // For connection string (Neon support)
        connectionString: process.env.DATABASE_URL || null,
      };

    case 'mongodb':
      return {
        type: 'mongodb',
        engine: 'mongodb',
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/drais',
        database: process.env.MONGODB_DATABASE || 'drais',
      };

    case 'mysql':
    default:
      return {
        type: 'mysql',
        engine: 'mysql',
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'drais',
        // Connection pool settings
        connectionLimit: parseInt(process.env.MYSQL_POOL_LIMIT || '10'),
        waitForConnections: true,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      };
  }
}

/**
 * Get current primary database engine
 */
export function getPrimaryDatabase() {
  return PRIMARY_DB;
}

/**
 * Check if specific database is primary
 */
export function isPrimaryDatabase(dbType) {
  return PRIMARY_DB === dbType;
}

export { PRIMARY_DB, supportedDatabases };
