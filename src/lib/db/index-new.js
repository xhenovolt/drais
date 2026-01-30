/**
 * DRAIS Universal Database Adapter v0.0.0050
 * 
 * Unified database abstraction layer supporting:
 * - MySQL (mysql2/promise)
 * - PostgreSQL (pg) including Neon
 * - MongoDB (native driver)
 * 
 * Switches between databases using PRIMARY_DB environment variable
 * Only one file needs editing: src/lib/db/config.js
 */

import mysql from 'mysql2/promise';
import { MongoClient } from 'mongodb';
import * as postgresModule from './postgres.js';
import { PRIMARY_DB, getDatabaseConfig, isPrimaryDatabase } from './config.js';

// Connection pools/clients
let mysqlPool = null;
let mongoClient = null;
let mongoDb = null;

/**
 * Initialize MySQL Connection Pool
 */
async function initMySQL() {
  if (mysqlPool) return mysqlPool;

  const config = getDatabaseConfig();
  mysqlPool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: config.waitForConnections,
    connectionLimit: config.connectionLimit,
    queueLimit: config.queueLimit,
    enableKeepAlive: config.enableKeepAlive,
    keepAliveInitialDelay: config.keepAliveInitialDelay,
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
  if (mongoDb) return mongoDb;

  const config = getDatabaseConfig();
  const uri = config.uri;

  try {
    mongoClient = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    await mongoClient.connect();
    mongoDb = mongoClient.db(config.database);
    console.log('✅ MongoDB Connected Successfully');
    return mongoDb;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
}

/**
 * Initialize PostgreSQL Connection Pool (reuses postgres.js)
 */
async function initPostgres() {
  return await postgresModule.initPostgres();
}

/**
 * Get active database connection
 */
async function getConnection() {
  if (isPrimaryDatabase('mysql')) {
    return await initMySQL();
  } else if (isPrimaryDatabase('postgres')) {
    return await initPostgres();
  } else if (isPrimaryDatabase('mongodb')) {
    return await initMongoDB();
  } else {
    throw new Error(`Unsupported PRIMARY_DB: ${PRIMARY_DB}`);
  }
}

/**
 * Universal Database Adapter
 */
const db = {
  /**
   * Execute raw SQL query (MySQL/PostgreSQL) or find operation (MongoDB)
   * @param {string} sql - SQL query or collection name
   * @param {Array} params - Query parameters or MongoDB filter
   * @returns {Promise<Array>} Query results
   */
  async query(sql, params = []) {
    try {
      if (isPrimaryDatabase('mysql')) {
        const pool = await getConnection();
        const [rows] = await pool.execute(sql, params);
        return rows;
      } else if (isPrimaryDatabase('postgres')) {
        return await postgresModule.query(sql, params);
      } else if (isPrimaryDatabase('mongodb')) {
        const database = await getConnection();
        const collection = database.collection(sql); // sql is collection name
        return await collection.find(params[0] || {}).toArray();
      }
    } catch (error) {
      console.error(`Database Error (${PRIMARY_DB}):`, error.message);
      throw error;
    }
  },

  /**
   * Find one record
   * @param {string} table - Table/Collection name
   * @param {Object|string} where - WHERE conditions
   * @param {Array} whereParams - WHERE parameters (SQL databases only)
   * @returns {Promise<Object|null>} Found record or null
   */
  async findOne(table, where, whereParams = []) {
    try {
      if (isPrimaryDatabase('mysql') || isPrimaryDatabase('postgres')) {
        const sql = `SELECT * FROM ${table} WHERE ${where} LIMIT 1`;
        const results = await this.query(sql, whereParams);
        return results.length > 0 ? results[0] : null;
      } else if (isPrimaryDatabase('mongodb')) {
        const database = await getConnection();
        const collection = database.collection(table);
        return await collection.findOne(where);
      }
    } catch (error) {
      console.error(`findOne Error (${table}, ${PRIMARY_DB}):`, error.message);
      throw error;
    }
  },

  /**
   * Insert a record
   * @param {string} table - Table/Collection name
   * @param {Object} data - Data to insert
   * @returns {Promise<Object>} Insert result with insertId or insertedId
   */
  async insert(table, data) {
    try {
      if (isPrimaryDatabase('mysql')) {
        const pool = await getConnection();
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);

        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        const [result] = await pool.execute(sql, values);

        return {
          success: true,
          insertId: result.insertId,
          affectedRows: result.affectedRows,
        };
      } else if (isPrimaryDatabase('postgres')) {
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data)
          .map((_, i) => `$${i + 1}`)
          .join(', ');
        const values = Object.values(data);

        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING id`;
        const result = await postgresModule.query(sql, values);

        return {
          success: true,
          insertId: result[0]?.id || null,
          affectedRows: 1,
        };
      } else if (isPrimaryDatabase('mongodb')) {
        const database = await getConnection();
        const collection = database.collection(table);
        const result = await collection.insertOne(data);

        return {
          success: true,
          insertId: result.insertedId,
          affectedRows: 1,
        };
      }
    } catch (error) {
      console.error(`insert Error (${table}, ${PRIMARY_DB}):`, error.message);
      throw error;
    }
  },

  /**
   * Update records
   * @param {string} table - Table/Collection name
   * @param {Object} data - Data to update
   * @param {string|Object} where - WHERE conditions or filter object (MongoDB)
   * @param {Array} whereParams - WHERE parameters (SQL only)
   * @returns {Promise<Object>} Update result
   */
  async update(table, data, where, whereParams = []) {
    try {
      if (isPrimaryDatabase('mysql') || isPrimaryDatabase('postgres')) {
        const updates = Object.keys(data).map((key, i) => {
          if (isPrimaryDatabase('postgres')) {
            return `${key} = $${i + 1}`;
          } else {
            return `${key} = ?`;
          }
        });
        const values = Object.values(data);

        const sql = `UPDATE ${table} SET ${updates.join(', ')} WHERE ${where}`;
        const allParams = [...values, ...whereParams];

        const result = await this.query(sql, allParams);

        return {
          success: true,
          affectedRows: result?.affectedRows || 1,
        };
      } else if (isPrimaryDatabase('mongodb')) {
        const database = await getConnection();
        const collection = database.collection(table);
        const result = await collection.updateMany(where, { $set: data });

        return {
          success: true,
          affectedRows: result.modifiedCount,
        };
      }
    } catch (error) {
      console.error(`update Error (${table}, ${PRIMARY_DB}):`, error.message);
      throw error;
    }
  },

  /**
   * Delete records
   * @param {string} table - Table/Collection name
   * @param {string|Object} where - WHERE conditions or filter (MongoDB)
   * @param {Array} whereParams - WHERE parameters (SQL only)
   * @returns {Promise<Object>} Delete result
   */
  async delete(table, where, whereParams = []) {
    try {
      if (isPrimaryDatabase('mysql') || isPrimaryDatabase('postgres')) {
        const sql = `DELETE FROM ${table} WHERE ${where}`;
        const result = await this.query(sql, whereParams);

        return {
          success: true,
          affectedRows: result?.affectedRows || 1,
        };
      } else if (isPrimaryDatabase('mongodb')) {
        const database = await getConnection();
        const collection = database.collection(table);
        const result = await collection.deleteMany(where);

        return {
          success: true,
          affectedRows: result.deletedCount,
        };
      }
    } catch (error) {
      console.error(`delete Error (${table}, ${PRIMARY_DB}):`, error.message);
      throw error;
    }
  },

  /**
   * Find multiple records
   * @param {string} table - Table/Collection name
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Found records
   */
  async findMany(table, options = {}) {
    try {
      const { where = {}, limit = 100, offset = 0, orderBy = null } = options;

      if (isPrimaryDatabase('mysql') || isPrimaryDatabase('postgres')) {
        let sql = `SELECT * FROM ${table}`;
        const params = [];

        if (options.whereString) {
          sql += ` WHERE ${options.whereString}`;
          if (options.whereParams) {
            params.push(...options.whereParams);
          }
        }

        if (orderBy) {
          sql += ` ORDER BY ${orderBy}`;
        }

        sql += ` LIMIT ${limit} OFFSET ${offset}`;

        return await this.query(sql, params);
      } else if (isPrimaryDatabase('mongodb')) {
        const database = await getConnection();
        const collection = database.collection(table);

        let query = collection.find(where);

        if (orderBy) {
          const [field, direction] = orderBy.split(' ');
          query = query.sort(field, direction === 'DESC' ? -1 : 1);
        }

        query = query.limit(limit).skip(offset);
        return await query.toArray();
      }
    } catch (error) {
      console.error(
        `findMany Error (${table}, ${PRIMARY_DB}):`,
        error.message
      );
      throw error;
    }
  },

  /**
   * Count records
   * @param {string} table - Table/Collection name
   * @param {Object|string} where - WHERE conditions or filter
   * @param {Array} whereParams - WHERE parameters (SQL only)
   * @returns {Promise<number>} Count
   */
  async count(table, where = {}, whereParams = []) {
    try {
      if (isPrimaryDatabase('mysql') || isPrimaryDatabase('postgres')) {
        const sql = `SELECT COUNT(*) as count FROM ${table}${
          where ? ` WHERE ${where}` : ''
        }`;
        const result = await this.query(sql, whereParams);
        return result[0]?.count || 0;
      } else if (isPrimaryDatabase('mongodb')) {
        const database = await getConnection();
        const collection = database.collection(table);
        return await collection.countDocuments(where);
      }
    } catch (error) {
      console.error(`count Error (${table}, ${PRIMARY_DB}):`, error.message);
      throw error;
    }
  },

  /**
   * Execute a transaction (SQL) or session (MongoDB)
   * @param {Function} callback - Transaction operations
   * @returns {Promise<any>} Transaction result
   */
  async transaction(callback) {
    try {
      if (isPrimaryDatabase('mysql')) {
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
      } else if (isPrimaryDatabase('postgres')) {
        const client = await postgres.beginTransaction();

        try {
          const result = await callback(client);
          await postgres.commitTransaction(client);
          return result;
        } catch (error) {
          await postgres.rollbackTransaction(client);
          throw error;
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
    } catch (error) {
      console.error(`transaction Error (${PRIMARY_DB}):`, error.message);
      throw error;
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

    if (isPrimaryDatabase('postgres')) {
      await postgresModule.closePool();
    }

    if (mongoClient) {
      await mongoClient.close();
      mongoClient = null;
      mongoDb = null;
      console.log('MongoDB connection closed');
    }
  },

  /**
   * Get current primary database type
   */
  getType() {
    return PRIMARY_DB;
  },

  /**
   * Get database configuration
   */
  getConfig() {
    return getDatabaseConfig();
  },

  /**
   * Check if specific database is primary
   */
  isPrimary(dbType) {
    return isPrimaryDatabase(dbType);
  },

  /**
   * Get database connection (for advanced use cases like transactions)
   */
  async getConnection() {
    return await getConnection();
  },
};

export default db;
