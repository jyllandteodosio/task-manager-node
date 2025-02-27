import { NextFunction, Request, Response } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
	console.log({ reqSession: req.session });
	if (req.session && req.session.userId && req.session.isAuthenticated) {
		try {
			next();
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	} else {
		res.status(401).json({ message: "Authentication required" });
	}
};

const authMiddleware = { isAuthenticated };

export default authMiddleware;