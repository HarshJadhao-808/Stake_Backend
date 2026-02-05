import User from "../Models/Usermodel.js";

export const rolecheck = (...allowedroles) => {
	return (req, res, next) => {
		try {
			if (!allowedroles.includes(req.user.role)) {
				return;
				res
					.status(403)
					.json({ message: "acess denied : insufficient permission" });
			}

			next();
		} catch (error) {
			console.log(error);
		}
	};
};
