/**
 * PostgreSQL Database Driver
 * DRAIS v0.0.0050
 * 
 * Provides PostgreSQL connectivity using pg library
 * Supports both standard PostgreSQL and PostgreSQL Neon
 */

let pgModule;
let Pool;
let postgresPool = null;

// Lazy load pg to avoid import issues if not needed
async function getPgModule() {
  if (!pgModule) {
    const pg = await import('pg');
    Pool = pg.Pool;
    pgModule = pg;
  }
  return pgModule;
}

/**
 * Initialize PostgreSQL Connection Pool
 */
export async function initPostgres() {
  if (postgresPool) return postgresPool;

  try {
    await getPgModule();
    const dbConfig = (await import('./config.js')).getDatabaseConfig();

    // Support connection string (for Neon) or individual params
    const poolConfig = dbConfig.connectionString
      ? { connectionString: dbConfig.connectionString }
      : {
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.database,
        };

    // Add connection pool settings
    poolConfig.max = dbConfig.max;
    poolConfig.idleTimeoutMillis = dbConfig.idleTimeoutMillis;
    poolConfig.connectionTimeoutMillis = dbConfig.connectionTimeoutMillis;

    postgresPool = new Pool(poolConfig);
    
    // Test connection - DISABLED DUE TO HANGING
    // const client = await postgresPool.connect();
    // const result = await client.query('SELECT NOW()');
    // client.release();
    // console.log('✅ PostgreSQL Connected Successfully:', result.rows[0]);
    console.log('✅ PostgreSQL Pool initialized');

    return postgresPool;
  } catch (error) {
    console.error('❌ PostgreSQL Connection Error:', error.message);
    throw error;
  }
}

/**
 * Execute query with prepared statements and timeout
 */
export async function query(sql, params = []) {
  const pool = await initPostgres();
  try {
    // Convert MySQL-style placeholders (?) to PostgreSQL style ($1, $2, etc)
    const convertedSql = convertSqlPlaceholders(sql);
    
    // Add query timeout (30 seconds)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout (30s)')), 30000)
    );
    
    const result = await Promise.race([
      pool.query(convertedSql, params),
      timeoutPromise
    ]);
    
    return result.rows;
  } catch (error) {
    console.error('PostgreSQL Query Error:', error.message);
    console.error('SQL:', sql.substring(0, 100));
    throw error;
  }
}

/**
 * Execute single row query
 */
export async function queryOne(sql, params = []) {
  const results = await query(sql, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Insert record
 */
export async function insert(sql, params = []) {
  const pool = await initPostgres();
  try {
    const convertedSql = convertSqlPlaceholders(sql);
    const result = await pool.query(convertedSql, params);
    
    return {
      success: true,
      insertId: result.rows[0]?.id || null,
      affectedRows: result.rowCount,
    };
  } catch (error) {
    console.error('PostgreSQL Insert Error:', error.message);
    throw error;
  }
}

/**
 * Update records
 */
export async function update(sql, params = []) {
  const pool = await initPostgres();
  try {
    const convertedSql = convertSqlPlaceholders(sql);
    const result = await pool.query(convertedSql, params);
    
    return {
      success: true,
      affectedRows: result.rowCount,
    };
  } catch (error) {
    console.error('PostgreSQL Update Error:', error.message);
    throw error;
  }
}

/**
 * Delete records
 */
export async function deleteRecord(sql, params = []) {
  const pool = await initPostgres();
  try {
    const convertedSql = convertSqlPlaceholders(sql);
    const result = await pool.query(convertedSql, params);
    
    return {
      success: true,
      affectedRows: result.rowCount,
    };
  } catch (error) {
    console.error('PostgreSQL Delete Error:', error.message);
    throw error;
  }
}

/**
 * Begin transaction
 */
export async function beginTransaction() {
  const client = await (await initPostgres()).connect();
  await client.query('BEGIN');
  return client;
}

/**
 * Commit transaction
 */
export async function commitTransaction(client) {
  try {
    await client.query('COMMIT');
  } finally {
    client.release();
  }
}

/**
 * Rollback transaction
 */
export async function rollbackTransaction(client) {
  try {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
}

/**
 * Convert MySQL-style SQL placeholders to PostgreSQL
 * MySQL: SELECT * FROM users WHERE id = ? AND email = ?
 * PostgreSQL: SELECT * FROM users WHERE id = $1 AND email = $2
 */
export function convertSqlPlaceholders(sql) {
  let count = 0;
  return sql.replace(/\?/g, () => {
    count++;
    return `$${count}`;
  });
}

/**
 * Execute raw SQL (for admin/setup operations)
 */
export async function rawQuery(sql) {
  const pool = await initPostgres();
  try {
    const result = await pool.query(sql);
    return result;
  } catch (error) {
    console.error('PostgreSQL Raw Query Error:', error.message);
    throw error;
  }
}

/**
 * Close pool
 */
export async function closePool() {
  if (postgresPool) {
    await postgresPool.end();
    postgresPool = null;
    console.log('PostgreSQL connection pool closed');
  }
}

/**
 * Get the pool instance (for direct use)
 */
export async function getPool() {
  if (!postgresPool) {
    await initPostgres();
  }
  return postgresPool;
}
