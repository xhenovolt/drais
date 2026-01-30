/**
 * Base CRUD Service
 * DRAIS v0.0.0044
 * 
 * Universal CRUD operations for all modules
 * Works with both MySQL and MongoDB
 */

import db from '../db/index.js';

/**
 * Create a new record
 * @param {string} table - Table/Collection name
 * @param {Object} data - Data to insert
 * @param {number} userId - User ID (for audit)
 * @returns {Promise<Object>} Created record
 */
export async function create(table, data, userId = null) {
  const dbType = db.getType();
  
  const record = {
    ...data,
    created_by: userId,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const result = await db.insert(table, record);

  return {
    success: true,
    message: 'Record created successfully',
    id: result.insertId || result.insertedId,
    data: { ...record, id: result.insertId || result.insertedId },
  };
}

/**
 * Get all records with optional filtering and pagination
 * @param {string} table - Table/Collection name
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Records and pagination info
 */
export async function getAll(table, options = {}) {
  const dbType = db.getType();
  const {
    where = {},
    orderBy = 'id',
    order = 'DESC',
    limit = 50,
    offset = 0,
    search = null,
    searchFields = [],
  } = options;

  if (dbType === 'mysql') {
    let sql = `SELECT * FROM ${table}`;
    let countSql = `SELECT COUNT(*) as total FROM ${table}`;
    const params = [];
    const countParams = [];

    // Build WHERE clause
    const whereClauses = [];
    
    // Add search if provided
    if (search && searchFields.length > 0) {
      const searchClauses = searchFields.map(field => `${field} LIKE ?`);
      whereClauses.push(`(${searchClauses.join(' OR ')})`);
      searchFields.forEach(() => {
        params.push(`%${search}%`);
        countParams.push(`%${search}%`);
      });
    }

    // Add custom where conditions
    Object.entries(where).forEach(([key, value]) => {
      whereClauses.push(`${key} = ?`);
      params.push(value);
      countParams.push(value);
    });

    if (whereClauses.length > 0) {
      const whereClause = ` WHERE ${whereClauses.join(' AND ')}`;
      sql += whereClause;
      countSql += whereClause;
    }

    // Add ORDER BY
    sql += ` ORDER BY ${orderBy} ${order}`;

    // Add LIMIT and OFFSET
    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    // Execute queries
    const [rows, countRows] = await Promise.all([
      db.query(sql, params),
      db.query(countSql, countParams),
    ]);

    const total = countRows[0].total;

    return {
      success: true,
      data: rows,
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit),
        currentPage: Math.floor(offset / limit) + 1,
      },
    };

  } else {
    // MongoDB
    const query = { ...where };
    
    if (search && searchFields.length > 0) {
      query.$or = searchFields.map(field => ({
        [field]: new RegExp(search, 'i'),
      }));
    }

    const [data, total] = await Promise.all([
      db.find(table, query)
        .sort({ [orderBy]: order === 'DESC' ? -1 : 1 })
        .skip(offset)
        .limit(limit)
        .toArray(),
      db.count(table, query),
    ]);

    return {
      success: true,
      data,
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit),
        currentPage: Math.floor(offset / limit) + 1,
      },
    };
  }
}

/**
 * Get a single record by ID
 * @param {string} table - Table/Collection name
 * @param {number|string} id - Record ID
 * @returns {Promise<Object>} Record
 */
export async function getById(table, id) {
  const dbType = db.getType();

  if (dbType === 'mysql') {
    const rows = await db.query(
      `SELECT * FROM ${table} WHERE id = ? LIMIT 1`,
      [id]
    );
    
    if (!rows || rows.length === 0) {
      throw new Error('Record not found');
    }

    return {
      success: true,
      data: rows[0],
    };
  } else {
    const record = await db.findOne(table, { id });
    
    if (!record) {
      throw new Error('Record not found');
    }

    return {
      success: true,
      data: record,
    };
  }
}

/**
 * Update a record by ID
 * @param {string} table - Table/Collection name
 * @param {number|string} id - Record ID
 * @param {Object} data - Data to update
 * @param {number} userId - User ID (for audit)
 * @returns {Promise<Object>} Update result
 */
export async function update(table, id, data, userId = null) {
  const dbType = db.getType();

  const updateData = {
    ...data,
    updated_by: userId,
    updated_at: new Date(),
  };

  if (dbType === 'mysql') {
    await db.update(table, updateData, 'id = ?', [id]);
    
    // Fetch updated record
    const rows = await db.query(
      `SELECT * FROM ${table} WHERE id = ? LIMIT 1`,
      [id]
    );

    return {
      success: true,
      message: 'Record updated successfully',
      data: rows[0],
    };
  } else {
    await db.update(table, updateData, { id });
    const record = await db.findOne(table, { id });

    return {
      success: true,
      message: 'Record updated successfully',
      data: record,
    };
  }
}

/**
 * Delete a record by ID (soft delete)
 * @param {string} table - Table/Collection name
 * @param {number|string} id - Record ID
 * @param {number} userId - User ID (for audit)
 * @returns {Promise<Object>} Delete result
 */
export async function softDelete(table, id, userId = null) {
  const dbType = db.getType();

  const deleteData = {
    deleted_at: new Date(),
    deleted_by: userId,
    updated_at: new Date(),
  };

  if (dbType === 'mysql') {
    await db.update(table, deleteData, 'id = ?', [id]);
  } else {
    await db.update(table, deleteData, { id });
  }

  return {
    success: true,
    message: 'Record deleted successfully',
  };
}

/**
 * Permanently delete a record by ID
 * @param {string} table - Table/Collection name
 * @param {number|string} id - Record ID
 * @returns {Promise<Object>} Delete result
 */
export async function hardDelete(table, id) {
  const dbType = db.getType();

  if (dbType === 'mysql') {
    await db.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
  } else {
    await db.delete(table, { id });
  }

  return {
    success: true,
    message: 'Record permanently deleted',
  };
}
