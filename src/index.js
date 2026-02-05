import express from "express";
import dotenv from "dotenv";
import userRouter from "./Router/Userrouter.js";
import dbconnect from "./Config/db.js";
import adminRouter from "./Router/Adminrouter.js";
import cors from 'cors'
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
dbconnect(process.env.mongo_url);

app.use("/user",userRouter)

app.use("/admin",adminRouter)

app.get("/",(req,res)=>{
    res.send("It is working")
})

const port = process.env.PORT || 5000 
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})