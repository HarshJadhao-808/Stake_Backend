import express from "express";
import dotenv from "dotenv";
import userRouter from "./Router/Userrouter.js";
import dbconnect from "./Config/db.js";

dotenv.config()
const app = express()
app.use(express.json())

dbconnect(process.env.mongo_url);

app.use("/user",userRouter)

app.get("/",(req,res)=>{
    res.send("It is working")
})

const port = process.env.PORT || 5000 
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})