import express from "express";
import * as taskController from "../controllers/taskController.ts"; 
import authMiddleware from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.get('/', authMiddleware.isAuthenticated, taskController.getTasks);					// GET /tasks
router.get('/:id', authMiddleware.isAuthenticated, taskController.getTaskById);   // GET /tasks/:id
router.post('/', authMiddleware.isAuthenticated, taskController.addTask);         // POST /tasks
router.put('/:id', authMiddleware.isAuthenticated, taskController.updateTask);    // PUT /tasks/:id
router.delete('/:id', authMiddleware.isAuthenticated, taskController.deleteTask); // DELETE /tasks/:id

export default router; 
