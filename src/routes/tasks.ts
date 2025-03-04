import express from "express";
import * as taskController from "../controllers/taskController.ts"; 
import authMiddleware from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.get('/lists/:listId/tasks', authMiddleware.isAuthenticated, taskController.getTasksByListId);                // GET /lists/:listId/tasks
router.get('/lists/:listId/tasks/:taskId', authMiddleware.isAuthenticated, taskController.getTaskByIdUnderList);    // GET /lists/:listId/tasks/:taskId
router.post('/lists/:listId/tasks', authMiddleware.isAuthenticated, taskController.addTaskUnderList);               // POST /lists/:listId/tasks/:taskId
router.put('/lists/:listId/tasks/:taskId', authMiddleware.isAuthenticated, taskController.updateTaskUnderList);     // PUT /lists/:listId/tasks/:taskId
router.delete('/lists/:listId/tasks/:taskId', authMiddleware.isAuthenticated, taskController.deleteTaskUnderList);  // DELETE /lists/:listId/tasks/:taskId


// to be deprecated
router.get('/tasks/', authMiddleware.isAuthenticated, taskController.getTasks);              // GET /tasks
router.get('/tasks/user/', authMiddleware.isAuthenticated, taskController.getTaskByUser);    // GET /tasks/user/
router.get('/tasks/:taskId', authMiddleware.isAuthenticated, taskController.getTaskById);    // GET /tasks/:taskId
router.post('/tasks/', authMiddleware.isAuthenticated, taskController.addTask);              // POST /tasks
router.put('/tasks/:taskId', authMiddleware.isAuthenticated, taskController.updateTask);     // PUT /tasks/:taskId
router.delete('/tasks/:taskId', authMiddleware.isAuthenticated, taskController.deleteTask);  // DELETE /tasks/:taskId

export default router; 
