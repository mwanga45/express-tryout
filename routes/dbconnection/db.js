require('dotenv').config();
const { Pool, Client } = require('pg');
const { host, port, user, password, database } = process.env;

async function ensureDatabaseExists() {
  const adminClient = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres',
  });

  await adminClient.connect();
  const { rowCount } = await adminClient.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [database]
  );

  if (rowCount === 0) {
    console.log(`Creating database "${database}"…`);
    await adminClient.query(`CREATE DATABASE "${database}"`);
    console.log(`Database "${database}" created.`);
  } else {
    console.log(`Database "${database}" already exists.`);
  }

  await adminClient.end();
}

async function initPool() {
  await ensureDatabaseExists();

  const pool = new Pool({
    host,
    port,
    user,
    password,
    database,
    max: 20,               
    idleTimeoutMillis: 3000 
  });


  const { rows } = await pool.query('SELECT NOW()');
  console.log('Connected to database at', rows[0].now);

  return pool;
}

module.exports = initPool();
