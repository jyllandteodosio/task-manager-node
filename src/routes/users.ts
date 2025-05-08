import express from "express";
import userController from "../controllers/userController.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.get('/:id', authMiddleware.isAuthenticated, userController.getUserById);			// GET /users/:id
router.get('/', authMiddleware.isAuthenticated, userController.findUsersByUsername);	// GET /users?username=...
router.put('/:id', authMiddleware.isAuthenticated, userController.updateUser);			// PUT /users/:id
router.delete('/:id', authMiddleware.isAuthenticated, userController.deleteUser);		// DELETE /users/:id

export default router;
