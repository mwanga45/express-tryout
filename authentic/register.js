const { pool } = require("../utils/database");
const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.post(
  "/",
  [
    body("firstname")
      .notEmpty()
      .withMessage("Please make sure fill firstname field"),
    body("secondname")
      .notEmpty()
      .withMessage("Please make sure fill the Secondname"),
    body("email").isEmail().withMessage("Please  enter correct format email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Please we require password with minimum of six character"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { firstname, secondname, email, password } = req.body;
      
      // Check if user with this email already exists
      const result = await pool.query(
        "SELECT 1 FROM Users WHERE email = $1",
        [email]
      );
      
      if (result.rowCount > 0) {
        return res
          .status(409)
          .json({ message: "User with similar email already exists" });
      }
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      
      // Insert the new user
      const queryResult = await pool.query(
        "INSERT INTO Users(firstname, secondname, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [firstname, secondname, email, hashPassword]
      );
      
      return res.status(201).json({
        message: "Register successfully",
        userId: queryResult.rows[0].id
      });
    } catch (err) {
      console.log("Something went wrong here: ", err);
      return res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;
