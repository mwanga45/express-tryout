var express  = require("express")
var router = express()
var bycrpt = require('bycrpt')
const connection = require('../dbconnection/db')
const {body, validationResult} = require("express-validator")
const Registeruser = router.post("/register",[
    body('firstname').notEmpty().withMessage("Please firstname required"),
    body('lastname').notEmpty().withMessage("Please field lastname"),
    body("email").isEmail().withMessage("Please Enter correct email format")
],async(req,res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }
    try{
        const checkuseremail = await body.findOne({message:body.email})
        let query = "SELECT email from User WHERE email = $1" 
        let isEmail = Boolean
        let err = (await connection).queryRow(query,checkuseremail).Scan(isEmail)
        if (err !== null){
         return res.status(404).json({message:"Email is already exists"})
        }
        const user = new body({
            fistname:firstname
        })

    }catch(err){
        console.error("Somethig went wrong", err)
    }
    const query = "INSERT INTO User (firstname, lastname , password, email) VALUE($1, $2, $3, $4)"
//   var  err  = 
    return res.status(200).json({message:"Successfully registered"})
    
})

module.exports(Registeruser)