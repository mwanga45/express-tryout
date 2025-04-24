const { pool } = require("../utils/database");
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.post(
  "/",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      
      // Check if user exists
      const result = await pool.query(
        "SELECT id, firstname, secondname, email, password FROM Users WHERE email = $1",
        [email]
      );
      
      if (result.rowCount === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      const user = result.rows[0];
      
      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          firstname: user.firstname,
          secondname: user.secondname
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Return user info and token
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          firstname: user.firstname,
          secondname: user.secondname,
          email: user.email
        },
        token
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;