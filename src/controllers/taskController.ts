import { Request, Response } from "express";
import { isValidObjectId } from 'mongoose';
import { taskService } from "../services/taskService.ts";
import { Server } from "socket.io";

/**
 * Gets all tasks for a specific list, checking user access.
 * Assumes listId is in req.params.
 */
export const getTasksByListId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;
    const { listId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User not logged in." });
      return;
    }
    if (!isValidObjectId(listId)) {
      res.status(400).json({ message: "Invalid list ID format." });
      return;
    }

    const tasks = await taskService.getTasksByListId(listId, userId);

    if (tasks === null) {
      res.status(404).json({ message: "List not found or access denied." });
      return;
    }

    res.status(200).json({
      message: "Successfully fetched tasks for list",
      result: tasks,
    });

  } catch (error: any) {
    console.error("Error in getTasksByListId controller:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * Gets a specific task within a list, checking user access.
 * Assumes listId and taskId are in req.params.
 */
export const getTaskByIdUnderList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;
    const { listId, taskId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User not logged in." });
      return;
    }
    if (!isValidObjectId(listId)) {
      res.status(400).json({ message: "Invalid list ID format." });
      return;
    }
    if (!isValidObjectId(taskId)) {
      res.status(400).json({ message: "Invalid task ID format." });
      return;
    }

    const task = await taskService.getTaskByIdUnderList(taskId, listId, userId);

    if (!task) {
      res.status(404).json({ message: "Task not found or access denied." });
      return;
    }

    res.status(200).json({
      message: "Successfully fetched task",
      result: task,
    });

  } catch (error: any) {
    console.error("Error in getTaskByIdUnderList controller:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * Adds a task to a specific list, checking user access.
 * Assumes listId is in req.params and task data (title, description) is in req.body.
 */
export const addTaskUnderList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;
    const { listId } = req.params;
    const taskData = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User not logged in." });
      return;
    }

    if (!isValidObjectId(listId)) {
      res.status(400).json({ message: "Invalid list ID format." });
      return;
    }
    if (!taskData.title || typeof taskData.title !== 'string' || taskData.title.trim() === '') {
      res.status(400).json({ message: "Task title is required and cannot be empty." });
      return;
    }

    const newTask = await taskService.addTaskUnderList(taskData, listId, userId);

    if (!newTask) {
      res.status(403).json({ message: "Failed to add task. Check list access or server logs." });
      return;
    }

    const io: Server = req.app.get('socketio');
    if (io) {
      io.to(listId).emit('taskAdded', { listId: listId, task: newTask, message: 'A task was added' });
      console.log(`Emitted 'taskAdded' for list ${listId} after adding task ${newTask._id}`);
    } else {
      console.warn("Socket.IO instance not found on app.");
    }

    res.status(201).json({
      message: "Successfully added task",
      result: newTask,
    });

  } catch (error: any) {
    console.error("Error in addTaskUnderList controller:", error);
    if (error.message === "Task title cannot be empty.") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }
};

/**
 * Updates a specific task within a list, checking user access.
 * Assumes listId and taskId are in req.params and update data is in req.body.
 */
export const updateTaskUnderList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;
    const { listId, taskId } = req.params;
    const updateData = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User not logged in." });
      return;
    }
    if (!isValidObjectId(listId)) {
      res.status(400).json({ message: "Invalid list ID format." });
      return;
    }
    if (!isValidObjectId(taskId)) {
      res.status(400).json({ message: "Invalid task ID format." });
      return;
    }
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: "No update data provided." });
    }

    const updatedTask = await taskService.updateTaskUnderList(taskId, listId, userId, updateData);

    if (!updatedTask) {
      res.status(404).json({ message: "Task not found, access denied, or update failed." });
      return;
    }

    const io: Server = req.app.get('socketio');
    if (io) {
      io.to(listId).emit('taskEdited', { listId: listId, task: updatedTask, message: 'A task was updated' });
      console.log(`Emitted 'taskEdited' for list ${listId} after updating task ${updatedTask._id}`);
    } else {
      console.warn("Socket.IO instance not found on app.");
    }

    res.status(200).json({
      message: "Successfully updated task",
      result: updatedTask,
    });

  } catch (error: any) {
    console.error("Error in updateTaskUnderList controller:", error);
    if (error.message === "Task title cannot be empty.") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }
};

/**
 * Deletes a specific task within a list, checking user access.
 * Assumes listId and taskId are in req.params.
 */
export const deleteTaskUnderList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;
    const { listId, taskId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User not logged in." });
      return;
    }
    if (!isValidObjectId(listId)) {
      res.status(400).json({ message: "Invalid list ID format." });
      return;
    }
    if (!isValidObjectId(taskId)) {
      res.status(400).json({ message: "Invalid task ID format." });
      return;
    }

    const deletedTask = await taskService.deleteTaskUnderList(taskId, listId, userId);

    if (!deletedTask) {
      res.status(404).json({ message: "Task not found or access denied." });
      return;
    }

    const io: Server = req.app.get('socketio');
    if (io) {
      io.to(listId).emit('taskDeleted', { listId: listId, taskId: deletedTask._id, message: 'A task was deleted' });
      console.log(`Emitted 'taskDeleted' for list ${listId} after deleting task ${deletedTask._id}`);
    } else {
      console.warn("Socket.IO instance not found on app.");
    }

    res.status(200).json({
      message: "Successfully deleted task",
      result: { taskId: deletedTask._id },
    });

  } catch (error: any) {
    console.error("Error in deleteTaskUnderList controller:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const taskController = {
  getTasksByListId,
  getTaskByIdUnderList,
  addTaskUnderList,
  updateTaskUnderList,
  deleteTaskUnderList
};

export default taskController;
