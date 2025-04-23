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
    const error = validateResult(req)
    if (!error.isEmpty() ){
        return res.status(404).json({error : error.array()})
    }
    const {firstname, secondname, email , password} = req.body;

    try{
        

    }catch(err){
        console.error("Something went wrong in server", err)
    }


})