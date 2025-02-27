import express from "express";
import * as userController from "../controllers/userController.ts"; 
import authMiddleware from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.get('/:id', authMiddleware.isAuthenticated, userController.getUserById);   // GET /users/:id
router.post('/', authMiddleware.isAuthenticated, userController.addUser);         // POST /users
router.put('/:id', authMiddleware.isAuthenticated, userController.updateUser);    // PUT /users/:id
router.delete('/:id', authMiddleware.isAuthenticated, userController.deleteUser); // DELETE /users/:id

export default router;
