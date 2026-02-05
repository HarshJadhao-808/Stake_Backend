import mongoose from "mongoose";

const userschema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, unique: true },
	contact: { type: String, unique: true },
	address: { type: String, unique: true },
	password: String,
	role: { type: String, enum: ["admin", "user"], default: "user" },
    AvailableClaim : {type:Number, default:0 },
    TotalClaimed : {type:Number, default:0 },
    stake : {type:Number, default:0 },
    wallet : {type:Number, default:1000},
    lastStakeUpdated : {type:Date , default:null}
});

const User = mongoose.model("Stake", userschema);

export default User;
