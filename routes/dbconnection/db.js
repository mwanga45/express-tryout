require("dotenv").config()
const {Pool,Client} = require("pg")
const{
    host ,
    port ,
    user ,
    password, 
    database  
} =process.env

async function ensureDatabaseExist(){
    const AdiminClient = new Client({
        host: host,
        port:port,
        user:user,
        password:password,
        database :database
    });
    await AdiminClient.connect();
    const { rowCount } = await AdiminClient.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [database]
      );
    
      if (rowCount === 0) {
        // 3) If not, create it
        console.log(`Creating database "${PG_DATABASE}"…`);
        await AdiminClient.query(`CREATE DATABASE "${database}"`);
        console.log(`Database "${PG_DATABASE}" created.`);
      } else {
        console.log(`Database "${PG_DATABASE}" already exists.`);
      }
    
      await AdiminClient.end();
}



