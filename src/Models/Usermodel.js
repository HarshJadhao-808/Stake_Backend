import mongoose from "mongoose";

const userschema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, unique: true },
	contact: { type: String, unique: true },
	address: { type: String, unique: true },
	password: String,
	role: { type: String, enum: ["admin", "user"], default: "user" },
});

const User = mongoose.model("Stake", userschema);

export default User;
