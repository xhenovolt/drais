import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();
const result = await client.query(`
  SELECT enum_range(NULL::user_role) AS roles
`);

console.log('Valid user_role enum values:', result.rows[0].roles);

await client.end();
