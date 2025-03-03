import { Request, Response } from "express";
import { authService } from "../services/authService.ts";

const checkAuthStatus = async (req: Request, res: Response) => {
	try {
		const response = {
			message: "CHECK USER AUTH STATUS: User is authenticated",
			result: req.session,
		};

		console.log(response);
		res.json(response);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

const login = async (req: Request, res: Response) => {
	try {
		const user = await authService.loginUser(req);
		const response = {
			message: "LOGIN USER: Failed to login user. Check if username/password is correct",
			result: {}
		}

		if (user) {
			response.message = "LOGIN USER: Successfully logged in user";
			response.result = req.session;
		}

		console.log(response);
		res.json(response);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

// export const logout = async (req: Request, res: Response) => {
// 	try {
// 		req.session.destroy((err: any) => {
// 			if (err) return res.status(500).json({ message: "Logout failed" });
// 			res.clearCookie("connect.sid");
// 		});

// 		const response = {
// 			message: "Logged out successfully",
// 		};

// 		console.log(response);
// 		res.json(response);

// 	} catch (error: any) {
// 		res.status(500).json({ error: error.message });
// 	}
// };


const authController = { checkAuthStatus, login };

export default authController;