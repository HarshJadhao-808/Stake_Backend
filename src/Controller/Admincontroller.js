import User from "../Models/Usermodel.js";

export const GetUsers = async (req,res)=>{
    try {
        const data = await User.find()
        res.status(200).json({message:"Users listed",data})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}