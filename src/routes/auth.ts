import express, { Request, Response } from "express";
import authController from "../controllers/authController.ts"; 
import userController from "../controllers/userController.ts"; 
import authMiddleware from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	res.send({ message: "Unauthorized Access" });
});
router.post("/login", authController.login);
router.post("/register", userController.addUser);
router.get("/auth-status", authMiddleware.isAuthenticated, authController.checkAuthStatus);
// router.post("/logout", isAuthenticated, authController.logout);

export default router;
