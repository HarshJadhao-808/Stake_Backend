import User from "../Models/Usermodel.js";
import bcrypt from 'bcrypt'
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config()
export const Signup = async(req,res) => {
    try {
        const { name, email, password, role , contact , address } = req.body;

		const exist_user = await User.findOne({ email });

		if (exist_user) {
			res.status(400).json({ message: "User already exists", exist_user });
		}


		const hashed_pass = await bcrypt.hash(password, 10);
		
        
        const user = await User.create({
			name,
			email,
			contact,
			address,
			password: hashed_pass,
			role,
		});


		res.json({ message: "User created ", user });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


export const Login = async (req,res) => {
    try {
        const { password, email } = req.body;

		const userexist = await User.findOne({ email });

		if (!userexist) return res.status(400).send("Invalid credentials");

		const ismatch = bcrypt.compare(password, userexist.password);

		if (!ismatch) return res.status(400).send("invalid credentials");

		const token = jwt.sign(
			{
				name: userexist.name,
				email: userexist.email,
				password: userexist.password,
				contact: userexist.contact,
				address: userexist.address,
				role: userexist.role,
			},
			process.env.secret_key,
			{ expiresIn: "3h" } 
		);

		res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}