import { Request, Response } from "express";
import { authService } from "../services/authService.ts";

/**
 * Checks the authentication status based on the current session.
 * Responds with user data if authenticated, or 401 if not.
 */
const checkAuthStatus = async (req: Request, res: Response): Promise<void> => {
	try {
		const user = await authService.checkAuthStatus(req);

		if (user) {
			res.status(200).json({
				message: "User is authenticated",
				isAuthenticated: true,
				result: user,
			});
		} else {
			res.status(401).json({
				message: "User is not authenticated",
				isAuthenticated: false,
				result: null,
			});
		}
	} catch (error: any) {
		console.error("Error in checkAuthStatus controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};

/**
 * Handles user login attempts.
 * Responds with user data upon successful login, or 401 for invalid credentials.
 */
const login = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = await authService.loginUser(req);

		if (userId) {
			const user = await authService.checkAuthStatus(req);

			if (user) {
				res.status(200).json({
					message: "Successfully logged in user",
					isAuthenticated: true,
					result: user,
				});
			} else {
				console.error("Error fetching user details after successful login.");
				res.status(500).json({ message: "Login succeeded but failed to fetch user details." });
			}

		} else {
			res.status(401).json({
				message: "Login failed. Check username and password.",
				isAuthenticated: false,
				result: null,
			});
		}
	} catch (error: any) {
		console.error("Error in login controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};

/**
 * Handles user logout attempts by destroying the session.
 */
const logout = async (req: Request, res: Response): Promise<void> => {
	try {
		const success = await authService.logoutUser(req, res);

		if (success) {
			res.status(200).json({ message: "Successfully logged out" });
		} else {
			res.status(500).json({ message: "Logout failed due to server error" });
		}
	} catch (error: any) {
		console.error("Error in logout controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};

const authController = { checkAuthStatus, login, logout };

export default authController;
