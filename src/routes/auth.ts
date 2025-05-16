import express, { NextFunction, Request, Response } from "express";
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";
import { IUser } from '../models/userModel.js';
import authMiddleware from "../middlewares/authMiddleware.js";
import passport from 'passport';

const CLIENT_URL = process.env.CLIENT_URL || "https://localhost:3000";
const router = express.Router();

export interface AuthenticatedRequest extends Request {
	user?: IUser;
}

router.get("/", (req: Request, res: Response) => {
	const authReq = req as AuthenticatedRequest;
	if (authReq.user) {
		res.send({ message: "Authenticated", user: authReq.user });
	} else {
		res.status(401).send({ message: "Unauthorized Access" });
	}
});

router.get("/auth/auth-status", [authMiddleware.isAuthenticated], (req: Request, res: Response) => {
	const { user } = req as AuthenticatedRequest;
	if (user) {
		const { _id, username, email, googleId, firstName, lastName } = user;
		res.status(200).json({ isAuthenticated: true, user: { _id, username, email, googleId, firstName, lastName } });
	} else {
		res.status(401).json({ isAuthenticated: false, user: null, message: "Authentication required" });
	}
});

router.post("/logout", [authMiddleware.isAuthenticated], (req: Request, res: Response, next: NextFunction) => {
	req.logout((err) => {
		if (err) {
			console.error('Error during Passport logout:', err);
			return next(err);
		}
		req.session.destroy((err) => {
			if (err) {
				console.error('Error destroying session after logout:', err);
				return next(err);
			}
			res.clearCookie('connect.sid');
			res.status(200).json({ message: "Logged out successfully" });
		});
	});
});

// --- Google OAuth Routes ---
router.get('/auth/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));
router.get('/auth/google/callback',
	passport.authenticate('google', { failureRedirect: `${CLIENT_URL}/login` }),
	(req: Request, res: Response) => {
		console.log('Google OAuth successful, redirecting to frontend dashboard...');
		res.redirect(`${CLIENT_URL}/dashboard`);
	}
);


export default router;
