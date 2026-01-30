/**
 * Safe PostgreSQL/MySQL Query Builder
 * DRAIS v0.0.0050
 * 
 * Ensures no SQL injection, no object stringification, and proper parameterization
 * Handles both WHERE conditions and dynamic value insertion safely
 */

import { getPrimaryDatabase } from './config.js';

/**
 * Convert query condition object to SQL WHERE clause with parameterized values
 * 
 * @param {Object|string} where - Conditions object or pre-built WHERE string
 * @param {Array} params - Optional parameter array if where is a string
 * @returns {Object} { clause: string, values: array, paramCount: number }
 * 
 * @example
 * // Object-based (recommended):
 * buildWhere({ email: 'test@example.com', active: true })
 * // Returns: { clause: 'email = $1 AND active = $2', values: ['test@example.com', true], paramCount: 2 }
 * 
 * // String-based (legacy):
 * buildWhere('email = ? AND active = ?', ['test@example.com', true])
 * // Returns: { clause: 'email = $1 AND active = $2', values: ['test@example.com', true], paramCount: 2 }
 */
export function buildWhere(where, params = []) {
  // Reject invalid inputs
  if (!where) {
    throw new Error('WHERE clause cannot be empty');
  }

  if (typeof where === 'object' && !Array.isArray(where)) {
    // Object-based where conditions: { email: 'test@example.com', active: true }
    return buildWhereFromObject(where);
  } else if (typeof where === 'string') {
    // String-based where conditions with separate params
    return buildWhereFromString(where, params);
  } else {
    throw new Error(`Invalid WHERE clause type: ${typeof where}. Expected object or string.`);
  }
}

/**
 * Build WHERE clause from object
 * @private
 */
function buildWhereFromObject(conditions) {
  if (Object.keys(conditions).length === 0) {
    throw new Error('WHERE conditions object cannot be empty');
  }

  const values = [];
  const clauses = [];
  let paramCount = 1;

  for (const [column, value] of Object.entries(conditions)) {
    // Validate column name (alphanumeric, underscore, dot only)
    if (!/^[a-zA-Z0-9_.]+$/.test(column)) {
      throw new Error(`Invalid column name: ${column}`);
    }

    if (value === null) {
      // NULL handling
      clauses.push(`${column} IS NULL`);
    } else if (Array.isArray(value)) {
      // IN clause for arrays
      const placeholders = value.map(() => `$${paramCount++}`).join(',');
      clauses.push(`${column} IN (${placeholders})`);
      values.push(...value);
    } else {
      // Standard equality
      clauses.push(`${column} = $${paramCount++}`);
      values.push(value);
    }
  }

  return {
    clause: clauses.join(' AND '),
    values,
    paramCount: paramCount - 1,
  };
}

/**
 * Build WHERE clause from string
 * Converts MySQL-style ? placeholders to PostgreSQL $N style
 * @private
 */
function buildWhereFromString(whereString, params = []) {
  if (!whereString.trim()) {
    throw new Error('WHERE string cannot be empty');
  }

  let paramCount = 1;
  const convertedClause = whereString.replace(/\?/g, () => `$${paramCount++}`);

  return {
    clause: convertedClause,
    values: params || [],
    paramCount: paramCount - 1,
  };
}

/**
 * Build INSERT query safely
 * 
 * @param {string} table - Table name
 * @param {Object} data - Column-value pairs
 * @returns {Object} { sql: string, values: array }
 * 
 * @example
 * buildInsert('users', { email: 'test@example.com', password: 'hash' })
 * // Returns: { sql: 'INSERT INTO users (email, password) VALUES ($1, $2)', values: [...] }
 */
export function buildInsert(table, data) {
  if (!table || typeof table !== 'string') {
    throw new Error('Table name must be a non-empty string');
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Insert data must be an object');
  }

  const columns = Object.keys(data);
  if (columns.length === 0) {
    throw new Error('Insert data cannot be empty');
  }

  // Validate column names
  columns.forEach(col => {
    if (!/^[a-zA-Z0-9_.]+$/.test(col)) {
      throw new Error(`Invalid column name: ${col}`);
    }
  });

  const values = columns.map(col => data[col]);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(',');
  const columnList = columns.join(',');

  const sql = `INSERT INTO ${table} (${columnList}) VALUES (${placeholders})`;

  return {
    sql,
    values,
  };
}

/**
 * Build UPDATE query safely
 * 
 * @param {string} table - Table name
 * @param {Object} data - Column-value pairs to update
 * @param {Object|string} where - WHERE conditions
 * @param {Array} params - Parameters if where is string
 * @returns {Object} { sql: string, values: array }
 * 
 * @example
 * buildUpdate('users', { email: 'new@example.com' }, { id: 123 })
 * // Returns: { sql: 'UPDATE users SET email = $1 WHERE id = $2', values: [...] }
 */
export function buildUpdate(table, data, where, params = []) {
  if (!table || typeof table !== 'string') {
    throw new Error('Table name must be a non-empty string');
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Update data must be an object');
  }

  const dataColumns = Object.keys(data);
  if (dataColumns.length === 0) {
    throw new Error('Update data cannot be empty');
  }

  // Validate column names
  dataColumns.forEach(col => {
    if (!/^[a-zA-Z0-9_.]+$/.test(col)) {
      throw new Error(`Invalid column name: ${col}`);
    }
  });

  // Build WHERE clause
  const whereResult = buildWhere(where, params);
  
  // Build SET clause
  let paramCount = 1;
  const setClauses = dataColumns.map(col => `${col} = $${paramCount++}`);
  const setString = setClauses.join(', ');

  // Adjust WHERE placeholders to account for SET parameters
  const adjustedWhere = adjustPlaceholders(whereResult.clause, paramCount);

  const sql = `UPDATE ${table} SET ${setString} WHERE ${adjustedWhere}`;
  const values = [...Object.values(data), ...whereResult.values];

  return {
    sql,
    values,
  };
}

/**
 * Build DELETE query safely
 * 
 * @param {string} table - Table name
 * @param {Object|string} where - WHERE conditions
 * @param {Array} params - Parameters if where is string
 * @returns {Object} { sql: string, values: array }
 */
export function buildDelete(table, where, params = []) {
  if (!table || typeof table !== 'string') {
    throw new Error('Table name must be a non-empty string');
  }

  const whereResult = buildWhere(where, params);
  const sql = `DELETE FROM ${table} WHERE ${whereResult.clause}`;

  return {
    sql,
    values: whereResult.values,
  };
}

/**
 * Adjust placeholder numbers when combining multiple parameter sets
 * @private
 */
function adjustPlaceholders(clause, startFrom) {
  let count = startFrom;
  return clause.replace(/\$\d+/g, () => `$${count++}`);
}

/**
 * Build SELECT query with safe WHERE and OPTIONS
 * 
 * @param {string} table - Table name
 * @param {Object} options - Query options
 * @returns {Object} { sql: string, values: array }
 * 
 * @example
 * buildSelect('users', {
 *   columns: ['id', 'email', 'name'],
 *   where: { active: true },
 *   orderBy: 'created_at DESC',
 *   limit: 10,
 *   offset: 0
 * })
 */
export function buildSelect(table, options = {}) {
  if (!table || typeof table !== 'string') {
    throw new Error('Table name must be a non-empty string');
  }

  const {
    columns = ['*'],
    where = null,
    orderBy = null,
    limit = null,
    offset = 0,
  } = options;

  // Validate columns
  const columnList = Array.isArray(columns) ? columns.join(',') : columns;
  if (!/^[\w\s,*]+$/.test(columnList)) {
    throw new Error(`Invalid column specification: ${columnList}`);
  }

  let sql = `SELECT ${columnList} FROM ${table}`;
  const values = [];

  // Add WHERE clause
  if (where) {
    const whereResult = buildWhere(where);
    sql += ` WHERE ${whereResult.clause}`;
    values.push(...whereResult.values);
  }

  // Add ORDER BY
  if (orderBy) {
    // Validate orderBy (prevent injection)
    if (!/^[a-zA-Z0-9_,\s]+(\s+(ASC|DESC))?$/i.test(orderBy)) {
      throw new Error(`Invalid ORDER BY clause: ${orderBy}`);
    }
    sql += ` ORDER BY ${orderBy}`;
  }

  // Add LIMIT
  if (limit !== null) {
    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error(`Invalid LIMIT: ${limit}`);
    }
    sql += ` LIMIT ${limit}`;
  }

  // Add OFFSET
  if (offset > 0) {
    if (!Number.isInteger(offset) || offset < 0) {
      throw new Error(`Invalid OFFSET: ${offset}`);
    }
    sql += ` OFFSET ${offset}`;
  }

  return {
    sql,
    values,
  };
}

/**
 * Validate that database is PostgreSQL or throw
 * @throws {Error} if not using PostgreSQL
 */
export function requirePostgres() {
  const db = getPrimaryDatabase();
  if (db !== 'postgres') {
    throw new Error(
      `This query builder is optimized for PostgreSQL but ${db} is configured. ` +
      `Set PRIMARY_DB=postgres in .env.local`
    );
  }
}
