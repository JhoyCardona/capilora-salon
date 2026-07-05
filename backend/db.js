// db.js
// Creates a single reusable connection pool to the PostgreSQL database.
// Every other file that needs to query the database will import this pool
// instead of opening a new connection each time.

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;