import express from "express";
import * as taskController from "../controllers/taskController.ts"; 

const router = express.Router();

router.get('/', taskController.getTasks);           // GET /tasks
router.get('/:id', taskController.getTaskWithId);   // GET /tasks/:id
router.post('/', taskController.addTask);           // POST /tasks
router.put('/:id', taskController.updateTask);      // PUT /tasks/:id
router.delete('/:id', taskController.deleteTask);   // DELETE /tasks/:id

export default router; 
