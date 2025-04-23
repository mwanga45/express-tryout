const Pool = require("./db"); // This should be your actual Pool instance

async function initializeTable() {
  try {
    const PoolPromise = Pool
    const UsersQuery = `
      CREATE TABLE IF NOT EXISTS Users (
        user_id SERIAL PRIMARY KEY,
        firstname VARCHAR(200),
        secondname VARCHAR(200),
        email VARCHAR(200),
        password VARCHAR(200)
      );
    `;

    await PoolPromise.query(UsersQuery);
    console.log(" Table 'Users' created or already exists.");
  } catch (err) {
    console.error(" Error creating table:", err);
  }
}

module.exports = initializeTable;