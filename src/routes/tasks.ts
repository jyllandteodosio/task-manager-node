import express from "express";
import * as taskController from "../controllers/taskController.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.get('/:listId/tasks', authMiddleware.isAuthenticated, taskController.getTasksByListId);					// GET /lists/:listId/tasks
router.get('/:listId/tasks/:taskId', authMiddleware.isAuthenticated, taskController.getTaskByIdUnderList);		// GET /lists/:listId/tasks/:taskId
router.post('/:listId/tasks', authMiddleware.isAuthenticated, taskController.addTaskUnderList);					// POST /lists/:listId/tasks
router.put('/:listId/tasks/:taskId', authMiddleware.isAuthenticated, taskController.updateTaskUnderList);		// PUT /lists/:listId/tasks/:taskId
router.delete('/:listId/tasks/:taskId', authMiddleware.isAuthenticated, taskController.deleteTaskUnderList);	// DELETE /lists/:listId/tasks/:taskId

export default router; 
