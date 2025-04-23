var Pool = require("./db");

const Users =
  "CREATE TABLE IF NOT EXISTS Users(user_id SERIAL PRIMARY KEY, firstname VARCHAR(200), secondname VARCHAR(200), email VARCHAR(200), password VARCHAR(200))";
 
