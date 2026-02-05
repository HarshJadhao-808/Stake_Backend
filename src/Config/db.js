import mongoose from "mongoose";

const dbconnect = async (url) => {
	let mongo_url = url;
	await mongoose.connect(mongo_url);
	console.log("db conected");
};

export default dbconnect;
