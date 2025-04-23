require("dotenv").config();
var Pool = require("../dbconnection/db");
var { body, validateResult } = require("express-validator");
var bycrpt = require("bcrypt");
const router = require("express");

router.post(
  "/register",
  [
    body("firstname").notEmpty().withMessage("firstname is required"),
    body("secondname").notEmpty().withMessage("secondname is required "),
    body("email").isEmail().withMessage("Please Enter valid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Please Enter password with minimum of six character"),
  ],
  async (req, res) => {
    const error = validateResult(req);
    if (!error.isEmpty()) {
      return res.status(404).json({ error: error.array() });
    }
    const { firstname, secondname, email, password } = req.body;

    try {
      let query = "SELECT 1 FROM users  WHERE email = $1";
      const { rows: existing } = (await Pool).query(query, [email]);
      if (existing.lenght > 0){
        return res.status(409).json({message:"Please that email is already been used"})
      }
      const salt = await bycrpt.genSalt(10)
      const hashpassword = await bycrpt.hash(password, salt)
      const result = (await Pool).query("INSERT INTO 'users'(firstname, secondname, email, password) VALUES($1,$2,3$,4$)", [firstname, secondname, email, hashpassword])
    } catch (err) {
      console.error("Something went wrong in server", err);
      return res.status(500).json({message:"Server Error"})
    }
  }
);
