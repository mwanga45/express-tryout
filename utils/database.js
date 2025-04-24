require('dotenv').config()
const { Pool } = require('pg');

// Debug environment variables
console.log('Environment variables:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'undefined');
console.log('DB_PORT:', process.env.DB_PORT);

const DB_NAME = 'medicadvicer';

// Create a new pool instance for our application database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Function to create the database if it doesn't exist
async function createDatabaseIfNotExists() {
  // Connect to the default postgres database first
  const defaultPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    // Check if our database exists
    const result = await defaultPool.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`
    );
    
    // If database doesn't exist, create it
    if (result.rows.length === 0) {
      await defaultPool.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Database ${DB_NAME} created successfully`);
      
      // Add a small delay to allow PostgreSQL to fully create the database
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    if (error.code !== '42P04') { // Ignore "database already exists" error
      console.error('Error creating database:', error);
    }
  } finally {
    await defaultPool.end();
  }
}

// Function to initialize the database and create tables
async function initializeDatabase() {
  // First ensure the database exists
  await createDatabaseIfNotExists();
  
  const client = await pool.connect();
  
  try {
    // Create Users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        firstname VARCHAR(100) NOT NULL,
        secondname VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
  }
}

// Export the pool and initialization function
module.exports = {
  pool,
  initializeDatabase
};
