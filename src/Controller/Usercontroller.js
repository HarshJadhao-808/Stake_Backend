import User from "../Models/Usermodel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { enableCompileCache } from "node:module";
dotenv.config();
export const Signup = async (req, res) => {
	try {
		const { name, email, password, role, contact, address } = req.body;

		const exist_user = await User.findOne({ email });

		if (exist_user)
			return res
				.status(400)
				.json({ message: "User already exists", exist_user });

		const hashed_pass = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			contact,
			address,
			password: hashed_pass,
			role,
		});

		res.json({
			message: "Account Created Successfully ! ",
			user,
			Wallet_status: "1000 HC added to wallet",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const ApplyInterest = (user) => {
	if (!user.stake || !user.lastStakeUpdated) {
		if (!user.stake) return `Stake not added`;
		if (!user.lastStakeUpdated) return "interval not completed";
	}

	const now = new Date();
	const last = new Date(user.lastStakeUpdated);

	const diff = now - last;
	const time = 10 * 60 * 1000;
	const intervals = Math.floor(diff / time);

	if (intervals <= 0) return `interval not completed`;

	const total_interest = user.stake * 0.01 * intervals;
	user.AvailableClaim += total_interest;

	user.lastStakeUpdated = new Date(last.getTime() + time * intervals);

	return `${total_interest} Added to AvailableClaim`;
};

export const Login = async (req, res) => {
	try {
		const { password, email } = req.body;

		const userexist = await User.findOne({ email });

		if (!userexist) return res.status(400).send("Invalid credentials");

		const ismatch = bcrypt.compare(password, userexist.password);

		if (!ismatch) return res.status(400).send("invalid credentials");

		const status = ApplyInterest(userexist);
		await userexist.save();
		const token = jwt.sign(
			{
				name: userexist.name,
				email: userexist.email,
				id: userexist._id,
				password: userexist.password,
				contact: userexist.contact,
				address: userexist.address,
				role: userexist.role,
			},
			process.env.secret_key,
			{ expiresIn: "3h" },
		);

		res.json({ message: "Login successful !", status, token });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const StakeHC = async (req, res) => {
	try {
		const { stake } = req.body;

		const userexist = await User.findById(req.params.id);

		if (!userexist) return res.status(400).send("Action not Possible");

        if(stake > userexist.wallet) return res.status(500).json({message:"Insufficient Balance !"});

		userexist.stake += stake;
		userexist.wallet = userexist.wallet - stake;
		let last = userexist.lastStakeUpdated;
		if (!last) userexist.lastStakeUpdated = new Date();

		const status = ApplyInterest(userexist);

		await userexist.save();

		res
			.status(200)
			.json({ message: "Stake placed Successful", userexist, status });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const rewardClaim = async (req, res) => {
	try {
		const userexist = await User.findById(req.params.id);

		if (!userexist) return res.status(400).send("Action not Possible");

		if(userexist.AvailableClaim == 0) return res.status(400).json({message:"No Rewards Available !"})

		const claimed = userexist.AvailableClaim;
		userexist.wallet += userexist.AvailableClaim;
		userexist.TotalClaimed += userexist.AvailableClaim;
		userexist.AvailableClaim = 0;
		await userexist.save();

		res.status(200).json({ message: `${claimed} HC deposited to Wallet` });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const Withdraw = async (req, res) => {
	try {
		const { stake } = req.body;

		const userexist = await User.findById(req.params.id);

		if (!userexist) return res.status(400).send("Action not Possible");

		userexist.stake = userexist.stake - stake;

		userexist.wallet += stake;

		await userexist.save();

		res.status(200).json({ message: `${stake} added to wallet`, userexist });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const UpdateState = async (req, res) => {
	try {
		const userexist = await User.findById(req.params.id);

		if (!userexist) return res.status(400).send("Action not Possible");

		const message = ApplyInterest(userexist);

        await userexist.save()

        res.json({data:userexist,message})
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getData = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) return res.status(400).send("Action not Possible");

        res.json({user})
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
