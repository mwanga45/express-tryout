const express = require("express")
const app = express()
const Port = 3000

app.get("/", (req,res)=>{
    res.send("Hello world")

})

app.listen(Port, (err)=>{
    if(err !=null){
        console.error("something went wrong here",err)
    }else{
        console.log("Server running and listern at: ", Port)
    }
})