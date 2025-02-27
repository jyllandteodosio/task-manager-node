import express, { Request, Response } from "express";
import authController from "../controllers/authController.ts"; 

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	res.send({ message: "Unauthorized Access" });
});
router.post("/login", authController.login);
router.post("/register", authController.register);
// router.post("/logout", isAuthenticated, authController.logout);

export default router;
