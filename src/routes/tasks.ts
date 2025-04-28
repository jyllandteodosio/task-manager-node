import express from "express";
import * as taskController from "../controllers/taskController.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.get('/', authMiddleware.isAuthenticated, taskController.getTasksByListId);				// GET /lists/:listId/tasks
router.get('/:taskId', authMiddleware.isAuthenticated, taskController.getTaskByIdUnderList);	// GET /lists/:listId/tasks/:taskId
router.post('/', authMiddleware.isAuthenticated, taskController.addTaskUnderList);				// POST /lists/:listId/tasks/:taskId
router.put('/:taskId', authMiddleware.isAuthenticated, taskController.updateTaskUnderList);     // PUT /lists/:listId/tasks/:taskId
router.delete('/:taskId', authMiddleware.isAuthenticated, taskController.deleteTaskUnderList);  // DELETE /lists/:listId/tasks/:taskId

export default router; 
