/**
 * DRAIS Universal Database Adapter
 * Version: 0.0.0040
 * 
 * Supports both MySQL and MongoDB through a unified interface.
 * Switch providers by changing DB_TYPE in .env
 */

import mysql from 'mysql2/promise';
import { MongoClient } from 'mongodb';

const DB_TYPE = process.env.DB_TYPE || 'mysql';

// MySQL Connection Pool
let mysqlPool = null;

// MongoDB Client
let mongoClient = null;
let mongoDb = null;

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
 * Get active database connection
 */
async function getConnection() {
  if (DB_TYPE === 'mysql') {
    return await initMySQL();
  } else if (DB_TYPE === 'mongodb') {
    return await initMongoDB();
  } else {
    throw new Error(`Unsupported DB_TYPE: ${DB_TYPE}. Use 'mysql' or 'mongodb'`);
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
    if (DB_TYPE === 'mysql') {
      const pool = await getConnection();
      const [rows] = await pool.execute(sql, params);
      return rows;
    } else if (DB_TYPE === 'mongodb') {
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
    if (DB_TYPE === 'mysql') {
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
    } else if (DB_TYPE === 'mongodb') {
      const database = await getConnection();
      const collection = database.collection(table);
      const result = await collection.insertOne(data);
      
      return {
        success: true,
        insertedId: result.insertedId,
        acknowledged: result.acknowledged,
      };
    }
  },

  /**
   * Update records
   * @param {string} table - Table/Collection name
   * @param {Object} data - Data to update
   * @param {Object|string} where - WHERE conditions (MySQL: string, MongoDB: object)
   * @param {Array} whereParams - WHERE parameters (MySQL only)
   * @returns {Promise<Object>} Update result
   */
  async update(table, data, where, whereParams = []) {
    if (DB_TYPE === 'mysql') {
      const pool = await getConnection();
      const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), ...whereParams];
      
      const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
      const [result] = await pool.execute(sql, values);
      
      return {
        success: true,
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } else if (DB_TYPE === 'mongodb') {
      const database = await getConnection();
      const collection = database.collection(table);
      const result = await collection.updateMany(where, { $set: data });
      
      return {
        success: true,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      };
    }
  },

  /**
   * Delete records
   * @param {string} table - Table/Collection name
   * @param {Object|string} where - WHERE conditions
   * @param {Array} whereParams - WHERE parameters (MySQL only)
   * @returns {Promise<Object>} Delete result
   */
  async delete(table, where, whereParams = []) {
    if (DB_TYPE === 'mysql') {
      const pool = await getConnection();
      const sql = `DELETE FROM ${table} WHERE ${where}`;
      const [result] = await pool.execute(sql, whereParams);
      
      return {
        success: true,
        affectedRows: result.affectedRows,
      };
    } else if (DB_TYPE === 'mongodb') {
      const database = await getConnection();
      const collection = database.collection(table);
      const result = await collection.deleteMany(where);
      
      return {
        success: true,
        deletedCount: result.deletedCount,
      };
    }
  },

  /**
   * Find one record
   * @param {string} table - Table/Collection name
   * @param {Object|string} where - WHERE conditions
   * @param {Array} whereParams - WHERE parameters (MySQL only)
   * @returns {Promise<Object|null>} Found record or null
   */
  async findOne(table, where, whereParams = []) {
    if (DB_TYPE === 'mysql') {
      const pool = await getConnection();
      const sql = `SELECT * FROM ${table} WHERE ${where} LIMIT 1`;
      const [rows] = await pool.execute(sql, whereParams);
      return rows[0] || null;
    } else if (DB_TYPE === 'mongodb') {
      const database = await getConnection();
      const collection = database.collection(table);
      return await collection.findOne(where);
    }
  },

  /**
   * Find multiple records
   * @param {string} table - Table/Collection name
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Found records
   */
  async findMany(table, options = {}) {
    const { where = {}, limit = 100, offset = 0, orderBy = null } = options;

    if (DB_TYPE === 'mysql') {
      const pool = await getConnection();
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

      sql += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [rows] = await pool.execute(sql, params);
      return rows;
    } else if (DB_TYPE === 'mongodb') {
      const database = await getConnection();
      const collection = database.collection(table);
      
      let query = collection.find(where);
      
      if (orderBy) {
        query = query.sort(orderBy);
      }
      
      return await query.limit(limit).skip(offset).toArray();
    }
  },

  /**
   * Execute a transaction (MySQL only, MongoDB uses sessions)
   * @param {Function} callback - Transaction operations
   * @returns {Promise<any>} Transaction result
   */
  async transaction(callback) {
    if (DB_TYPE === 'mysql') {
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
    } else if (DB_TYPE === 'mongodb') {
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
    if (DB_TYPE === 'mysql') {
      const pool = await getConnection();
      const whereClause = typeof where === 'string' ? where : '1=1';
      const sql = `SELECT COUNT(*) as count FROM ${table} WHERE ${whereClause}`;
      const [rows] = await pool.execute(sql, whereParams);
      return rows[0].count;
    } else if (DB_TYPE === 'mongodb') {
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
    return DB_TYPE;
  },
};

export default db;
