import { NextFunction, Request, Response } from "express";
import { IUser } from '../models/userModel.js';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as IUser | undefined;
	console.log("isAuthenticated middleware called");
	console.log("User in request:", user);
	console.log("Session data:", req.session);
	if (user) {
		next();
	} else {
		// User is not authenticated
		// Send a 401 Unauthorized response for API calls
		res.status(401).json({ message: "Authentication required" });
		// If this middleware is used for routes that render pages,
		// you might instead redirect: res.redirect('http://localhost:3000/login');
	}
};

const authMiddleware = { isAuthenticated };

export default authMiddleware;
