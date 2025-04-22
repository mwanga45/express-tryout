var express  = require("express")
var router = express()
const {body, validationResult} = require("express-validator")
router.post("/register",[
    body('firstname').notEmpty().withMessage("Please firstname required"),
    body('lastname').notEmpty().withMessage("Please field lastname"),
    body("email").isEmail().withMessage("Please Enter correct email format")
],(req,res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }
    return res.status(200).json({message:"Successfully registered"})
    
})