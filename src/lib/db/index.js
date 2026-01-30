/**
 * DRAIS Universal Database Adapter
 * Version: 0.0.0050
 * 
 * Supports MySQL, PostgreSQL, and MongoDB through a unified interface.
 * Switch providers by changing PRIMARY_DB in .env (.env.local takes precedence)
 * PRIMARY_DB supports: mysql | postgres | mongodb
 */

import mysql from 'mysql2/promise';
import { MongoClient } from 'mongodb';
import { getDatabaseConfig, isPrimaryDatabase } from './config.js';
import * as postgresDriver from './postgres.js';
import { buildWhere, buildInsert, buildUpdate, buildDelete, buildSelect } from './query-builder.js';

const PRIMARY_DB = process.env.PRIMARY_DB || 'postgres';

// MySQL Connection Pool
let mysqlPool = null;

// MongoDB Client
let mongoClient = null;
let mongoDb = null;

console.log(`🔄 Database Mode: ${PRIMARY_DB}`);

/**
 * Initialize MySQL Connection Pool
 */
async function initMySQL() {
  if (mysqlPool) return mysqlPool;

  mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'drais',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  // Test connection
  try {
    const connection = await mysqlPool.getConnection();
    console.log('✅ MySQL Connected Successfully');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error.message);
    throw error;
  }

  return mysqlPool;
}

/**
 * Initialize MongoDB Connection
 */
async function initMongoDB() {
  if (mongoClient) return mongoDb;

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/drais';
  const dbName = process.env.MONGODB_DATABASE || 'drais';

  try {
    mongoClient = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    await mongoClient.connect();
    mongoDb = mongoClient.db(dbName);
    console.log('✅ MongoDB Connected Successfully');
    return mongoDb;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
}

/**
 * Initialize PostgreSQL Connection (uses postgres driver)
 */
async function initPostgreSQL() {
  try {
    return await postgresDriver.initPostgres();
  } catch (error) {
    console.error('❌ PostgreSQL Connection Error:', error.message);
    throw error;
  }
}

/**
 * Get active database connection
 */
async function getConnection() {
  if (isPrimaryDatabase('postgres')) {
    return await initPostgreSQL();
  } else if (isPrimaryDatabase('mysql')) {
    return await initMySQL();
  } else if (isPrimaryDatabase('mongodb')) {
    return await initMongoDB();
  } else {
    throw new Error(`Unsupported PRIMARY_DB: ${PRIMARY_DB}. Use 'postgres', 'mysql', or 'mongodb'`);
  }
}

/**
 * Universal Database Adapter
 */
const db = {
  /**
   * Execute raw SQL query (MySQL) or find operation (MongoDB)
   * @param {string} sql - SQL query or collection name
   * @param {Array} params - Query parameters or MongoDB filter
   * @returns {Promise<Array>} Query results
   */
  async query(sql, params = []) {
    if (isPrimaryDatabase('postgres')) {
      return await postgresDriver.query(sql, params);
    } else if (isPrimaryDatabase('mysql')) {
      const pool = await getConnection();
      const [rows] = await pool.execute(sql, params);
      return rows;
    } else if (isPrimaryDatabase('mongodb')) {
      const database = await getConnection();
      const collection = database.collection(sql); // sql is collection name
      return await collection.find(params[0] || {}).toArray();
    }
  },

  /**
   * Insert a record
   * @param {string} table - Table/Collection name
   * @param {Object} data - Data to insert
   * @returns {Promise<Object>} Insert result with insertId or insertedId
   */
  async insert(table, data) {
    if (isPrimaryDatabase('postgres')) {
      try {
        const { sql, values } = buildInsert(table, data);
        const sqlWithReturning = sql.replace(/;?$/, ' RETURNING id');
        const result = await postgresDriver.query(sqlWithReturning, values);
        return {
          success: true,
          insertId: result[0]?.id,
          affectedRows: 1,
        };
      } catch (error) {
        console.error(`PostgreSQL insert error in ${table}:`, error.message);
        throw new Error(`Database insert failed for ${table}: ${error.message}`);
      }
    } else if (isPrimaryDatabase('mysql')) {
      try {
        const pool = await getConnection();
        const { sql, values } = buildInsert(table, data);
        const [result] = await pool.execute(sql, values);
        return {
          success: true,
          insertId: result.insertId,
          affectedRows: result.affectedRows,
        };
      } catch (error) {
        console.error(`MySQL insert error in ${table}:`, error.message);
        throw new Error(`Database insert failed for ${table}: ${error.message}`);
      }
    } else if (isPrimaryDatabase('mongodb')) {
      try {
        const database = await getConnection();
        const collection = database.collection(table);
        const result = await collection.insertOne(data);
        return {
          success: true,
          insertedId: result.insertedId,
          acknowledged: result.acknowledged,
        };
      } catch (error) {
        console.error(`MongoDB insert error in ${table}:`, error.message);
        throw new Error(`Database insert failed for ${table}: ${error.message}`);
      }
    }
  },

  /**
   * Update records - SAFE IMPLEMENTATION
   * @param {string} table - Table/Collection name
   * @param {Object} data - Data to update
   * @param {Object|string} where - WHERE conditions
   * @param {Array} whereParams - WHERE parameters (if where is string)
   * @returns {Promise<Object>} Update result
   */
  async update(table, data, where, whereParams = []) {
    if (isPrimaryDatabase('postgres')) {
      try {
        const { sql, values } = buildUpdate(table, data, where, whereParams);
        const result = await postgresDriver.update(sql, values);
        return result;
      } catch (error) {
        console.error(`PostgreSQL update error in ${table}:`, error.message);
        throw new Error(`Database update failed for ${table}: ${error.message}`);
      }
    } else if (isPrimaryDatabase('mysql')) {
      try {
        const { sql, values } = buildUpdate(table, data, where, whereParams);
        const pool = await getConnection();
        const [result] = await pool.execute(sql, values);
        return {
          success: true,
          affectedRows: result.affectedRows,
          changedRows: result.changedRows,
        };
      } catch (error) {
        console.error(`MySQL update error in ${table}:`, error.message);
        throw new Error(`Database update failed for ${table}: ${error.message}`);
      }
    } else if (isPrimaryDatabase('mongodb')) {
      try {
        const database = await getConnection();
        const collection = database.collection(table);
        const result = await collection.updateMany(where, { $set: data });
        return {
          success: true,
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
        };
      } catch (error) {
        console.error(`MongoDB update error in ${table}:`, error.message);
        throw new Error(`Database update failed for ${table}: ${error.message}`);
      }
    }
  },

  /**
   * Delete records - SAFE IMPLEMENTATION
   * @param {string} table - Table/Collection name
   * @param {Object|string} where - WHERE conditions
   * @param {Array} whereParams - WHERE parameters (if where is string)
   * @returns {Promise<Object>} Delete result
   */
  async delete(table, where, whereParams = []) {
    if (isPrimaryDatabase('postgres')) {
      try {
        const { sql, values } = buildDelete(table, where, whereParams);
        const result = await postgresDriver.deleteRecord(sql, values);
        return result;
      } catch (error) {
        console.error(`PostgreSQL delete error in ${table}:`, error.message);
        throw new Error(`Database delete failed for ${table}: ${error.message}`);
      }
    } else if (isPrimaryDatabase('mysql')) {
      try {
        const { sql, values } = buildDelete(table, where, whereParams);
        const pool = await getConnection();
        const [result] = await pool.execute(sql, values);
        return {
          success: true,
          affectedRows: result.affectedRows,
        };
      } catch (error) {
        console.error(`MySQL delete error in ${table}:`, error.message);
        throw new Error(`Database delete failed for ${table}: ${error.message}`);
      }
    } else if (isPrimaryDatabase('mongodb')) {
      try {
        const database = await getConnection();
        const collection = database.collection(table);
        const result = await collection.deleteMany(where);
        return {
          success: true,
          deletedCount: result.deletedCount,
        };
      } catch (error) {
        console.error(`MongoDB delete error in ${table}:`, error.message);
        throw new Error(`Database delete failed for ${table}: ${error.message}`);
      }
    }
  },

  /**
   * Find one record - SAFE IMPLEMENTATION
   * @param {string} table - Table/Collection name
   * @param {Object|string} where - WHERE conditions (object or string)
   * @param {Array} whereParams - WHERE parameters (if where is string)
   * @returns {Promise<Object|null>} Found record or null
   * 
   * @example
   * // Object-based (recommended - prevents SQL injection):
   * db.findOne('users', { email: 'test@example.com' })
   * 
   * // String-based (legacy support):
   * db.findOne('users', 'email = ?', ['test@example.com'])
   */
  async findOne(table, where, whereParams = []) {
    if (isPrimaryDatabase('postgres')) {
      try {
        const { sql, values } = buildSelect(table, {
          where,
          limit: 1,
        });
        const rows = await postgresDriver.query(sql, values);
        return rows[0] || null;
      } catch (error) {
        console.error(`PostgreSQL findOne error in ${table}:`, error.message);
        throw new Error(`Database query failed for ${table}: ${error.message}`);
      }
    } else if (isPrimaryDatabase('mysql')) {
      try {
        const { sql, values } = buildSelect(table, {
          where,
          limit: 1,
        });
        const pool = await getConnection();
        const [rows] = await pool.execute(sql, values);
        return rows[0] || null;
      } catch (error) {
        console.error(`MySQL findOne error in ${table}:`, error.message);
        throw new Error(`Database query failed for ${table}: ${error.message}`);
      }
    } else if (isPrimaryDatabase('mongodb')) {
      try {
        const database = await getConnection();
        const collection = database.collection(table);
        return await collection.findOne(where);
      } catch (error) {
        console.error(`MongoDB findOne error in ${table}:`, error.message);
        throw new Error(`Database query failed for ${table}: ${error.message}`);
      }
    }
  },

  /**
   * Find multiple records - SAFE IMPLEMENTATION
   * @param {string} table - Table/Collection name
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Found records
   */
  async findMany(table, options = {}) {
    const {
      where = null,
      whereString = null,
      whereParams = [],
      limit = 100,
      offset = 0,
      orderBy = null,
      columns = ['*'],
    } = options;

    if (isPrimaryDatabase('postgres')) {
      try {
        // Determine where clause - use explicit where object or legacy whereString
        const whereCondition = where || (whereString ? whereString : null);
        const params = whereString ? whereParams : [];

        const { sql, values } = buildSelect(table, {
          columns: Array.isArray(columns) ? columns : [columns],
          where: whereCondition,
          orderBy,
          limit,
          offset,
        });

        return await postgresDriver.query(sql, values);
      } catch (error) {
        console.error(`PostgreSQL findMany error in ${table}:`, error.message);
        throw new Error(`Database query failed for ${table}: ${error.message}`);
      }
    } else if (isPrimaryDatabase('mysql')) {
      try {
        const pool = await getConnection();
        const whereCondition = where || (whereString ? whereString : null);
        const params = whereString ? whereParams : [];

        const { sql, values } = buildSelect(table, {
          columns: Array.isArray(columns) ? columns : [columns],
          where: whereCondition,
          orderBy,
          limit,
          offset,
        });

        const [rows] = await pool.execute(sql, values);
        return rows;
      } catch (error) {
        console.error(`MySQL findMany error in ${table}:`, error.message);
        throw new Error(`Database query failed for ${table}: ${error.message}`);
      }
    } else if (isPrimaryDatabase('mongodb')) {
      try {
        const database = await getConnection();
        const collection = database.collection(table);
        
        let query = collection.find(where || {});
        
        if (orderBy) {
          query = query.sort(orderBy);
        }
        
        return await query.limit(limit).skip(offset).toArray();
      } catch (error) {
        console.error(`MongoDB findMany error in ${table}:`, error.message);
        throw new Error(`Database query failed for ${table}: ${error.message}`);
      }
    }
  },

  /**
   * Execute a transaction (MySQL only, MongoDB uses sessions)
   * @param {Function} callback - Transaction operations
   * @returns {Promise<any>} Transaction result
   */
  /**
   * Execute a transaction (MySQL, PostgreSQL, MongoDB)
   * @param {Function} callback - Transaction operations callback(client)
   * @returns {Promise<any>} Transaction result
   */
  async transaction(callback) {
    if (isPrimaryDatabase('postgres')) {
      // PostgreSQL transaction support
      const client = await postgresDriver.beginTransaction();
      try {
        const result = await callback(client);
        await postgresDriver.commitTransaction(client);
        return result;
      } catch (error) {
        await postgresDriver.rollbackTransaction(client);
        throw error;
      }
    } else if (isPrimaryDatabase('mysql')) {
      const pool = await getConnection();
      const connection = await pool.getConnection();
      
      try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } else if (isPrimaryDatabase('mongodb')) {
      const client = mongoClient;
      const session = client.startSession();
      
      try {
        let result;
        await session.withTransaction(async () => {
          result = await callback(session);
        });
        return result;
      } finally {
        await session.endSession();
      }
    }
  },

  /**
   * Count records
   * @param {string} table - Table/Collection name
   * @param {Object|string} where - WHERE conditions
   * @param {Array} whereParams - WHERE parameters (MySQL only)
   * @returns {Promise<number>} Count
   */
  async count(table, where = {}, whereParams = []) {
    if (isPrimaryDatabase('mysql')) {
      const pool = await getConnection();
      const whereClause = typeof where === 'string' ? where : '1=1';
      const sql = `SELECT COUNT(*) as count FROM ${table} WHERE ${whereClause}`;
      const [rows] = await pool.execute(sql, whereParams);
      return rows[0].count;
    } else if (isPrimaryDatabase('mongodb')) {
      const database = await getConnection();
      const collection = database.collection(table);
      return await collection.countDocuments(where);
    }
  },

  /**
   * Close all database connections
   */
  async close() {
    if (mysqlPool) {
      await mysqlPool.end();
      mysqlPool = null;
      console.log('MySQL connection pool closed');
    }
    
    if (mongoClient) {
      await mongoClient.close();
      mongoClient = null;
      mongoDb = null;
      console.log('MongoDB connection closed');
    }
  },

  /**
   * Get current database type
   */
  getType() {
    return PRIMARY_DB;
  },

  /**
   * Get database connection (for advanced use cases like transactions)
   */
  async getConnection() {
    if (isPrimaryDatabase('mysql')) {
      const pool = await initMySQL();
      const connection = await pool.getConnection();
      
      // Wrap to provide consistent API
      return {
        execute: (sql, params) => connection.execute(sql, params),
        query: async (sql, params = []) => {
          const [rows, metadata] = await connection.execute(sql, params);
          // Return rows with metadata attached for compatibility
          Object.assign(rows, { insertId: metadata.insertId, affectedRows: metadata.affectedRows });
          return rows;
        },
        beginTransaction: () => connection.beginTransaction(),
        commit: () => connection.commit(),
        rollback: () => connection.rollback(),
        release: () => connection.release(),
      };
    } else if (isPrimaryDatabase('mongodb')) {
      const client = mongoClient || await initMongoDB();
      return await client.startSession();
    }
  },
};

export default db;
