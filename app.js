require("dotenv").config();
const express = require("express")
const cors = require('cors')
const app = express()
const PORT = process.env.SERVER_PORT||8080
const { initializeDatabase } = require('./utils/database') 
const Register = require("./authentic/register")
const Login = require("./authentic/login")
const { verifyToken } = require('./middleware/auth')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.use("/register", Register)
app.use("/login", Login)

// Protected route example
app.get("/profile", verifyToken, (req, res) => {
  res.json({ 
    message: "This is a protected route", 
    user: req.user 
  });
});

// Initialize the database when the app starts
initializeDatabase()
  .then(() => console.log('Database initialized'))
  .catch(err => console.error('Failed to initialize database:', err));

app.get("/", (req,res)=>{
    res.send("It me issa")
})

// Create a route to test the database connection
app.get("/db/test", async (req, res) => {
  try {
    const { pool } = require('./utils/database');
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, timestamp: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT,()=>{
    console.log("server is running listen.... ")
})