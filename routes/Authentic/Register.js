require('dotenv').config()
var Pool = require("../dbconnection/db")
var {body, validateResult} = require("express-validator")
var bycrpt = require("bcrypt")
const router = require("express")

router.post("/register",[
body('firstname').notEmpty().withMessage("firstname is required"),
body('secondname').notEmpty().withMessage("secondname is required "),
body('email').isEmail().withMessage("Please Enter valid email format"),
body("password").isLength({min: 6}).withMessage("Please Enter password with minimum of six character")

], async(req,res)=>{

})