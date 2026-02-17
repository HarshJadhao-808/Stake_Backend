import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()
const protect = (req,res,next) => {
    const token = req.headers.authorization.split(" ")[1];

    if(!token) return res.status(500).json({message:"please login to perform the operation",token})

        try {
            const decoded = jwt.verify(token, process.env.secret_key);
            req.user = decoded
            console.log(req.user)
            next()
        } catch (error) {
            res.status(401).json({message:"invalid or expired token"})
        }
        }


export default protect