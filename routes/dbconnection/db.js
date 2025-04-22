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
        console.log(`Database "${database}" created.`);
      } else {
        console.log(`Database "${database}" already exists.`);
      }
    
      await AdiminClient.end();
}
async function initPool(){
    await ensureDatabaseExist()
    const Poolconnection  = new Pool({
        host:host,
        port:port,
        user:user,
        password:password,
        database:database,
        max:20,
        idleTimeoutMillis:3000
    });
    const { rows } = await pool.query('SELECT NOW()');
    console.log('Connected to database at', rows[0].now);
  
    return Pool;

}
module.exports = initPool()



