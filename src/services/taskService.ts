
import { Types } from 'mongoose';
import Task, { ITask } from '../models/taskModel.js';
import { listService } from './listService.js';

/**
 * Fetches all tasks for a specific list, ensuring the user has access.
 * Tasks are sorted by the 'order' field.
 * @param listId - The ID of the list.
 * @param userId - The ID of the user requesting the tasks.
 * @returns A promise resolving to an array of task documents or null if list access denied or error.
 */
const getTasksByListId = async (listId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<ITask[] | null> => {
    try {
        const list = await listService.getListById(listId, userId);
        if (!list) {
            console.log(`Access denied or list not found for listId: ${listId}, userId: ${userId}`);
            return null;
        }
        const tasks = await Task.find({ listId: listId })
            .sort({ order: 1 })
            .exec();
        return tasks;
    } catch (error: any) {
        console.error(`Error fetching tasks for list ${listId}:`, error.message);
        return null;
    }
};

/**
 * Fetches a single task by its ID within a specific list, ensuring user has list access.
 * @param taskId - The ID of the task.
 * @param listId - The ID of the list the task belongs to.
 * @param userId - The ID of the user requesting the task.
 * @returns A promise resolving to the task document or null if not found/no access.
 */
const getTaskByIdUnderList = async (taskId: string | Types.ObjectId, listId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<ITask | null> => {
    try {
        const list = await listService.getListById(listId, userId);
        if (!list) {
            console.log(`Access denied or list not found for listId: ${listId}, userId: ${userId}`);
            return null;
        }
        const task = await Task.findOne({ _id: taskId, listId: listId }).exec();
        return task;
    } catch (error: any) {
        console.error(`Error fetching task ${taskId} from list ${listId}:`, error.message);
        return null;
    }
};

/**
 * Adds a new task (with optional description) to a specific list, ensuring user has list access.
 * Assigns an order based on the current highest order + 1.
 * @param taskData - Object containing task properties (e.g., title, description).
 * @param listId - The ID of the list to add the task to.
 * @param userId - The ID of the user adding the task.
 * @returns A promise resolving to the newly created task document or null on error/no access.
 */
const addTaskUnderList = async (taskData: Partial<Pick<ITask, 'title' | 'description'>>, listId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<ITask | null> => {
    try {
        const list = await listService.getListById(listId, userId);
        if (!list) {
            console.log(`Access denied or list not found for listId: ${listId}, userId: ${userId}`);
            return null;
        }

        if (!taskData.title || taskData.title.trim() === '') {
            throw new Error("Task title cannot be empty.");
        }

        const lastTask = await Task.findOne({ listId }).sort({ order: -1 }).select('order').exec();
        const newOrder = lastTask ? lastTask.order + 1 : 0;

        const newTask = await Task.create({
            title: taskData.title.trim(),
            description: taskData.description?.trim(),
            listId: listId,
            createdBy: userId,
            order: newOrder,
            completed: false
        });

        console.log(`Task added successfully to list ${listId} with ID: ${newTask._id}`);
        return newTask;
    } catch (error: any) {
        console.error(`Error adding task to list ${listId} by user ${userId}:`, error.message);
        return null;
    }
};

/**
 * Updates an existing task (title, description, completed) within a specific list. Ensures user has list access.
 * Does not handle reordering; use a dedicated function for that.
 * @param taskId - The ID of the task to update.
 * @param listId - The ID of the list the task belongs to.
 * @param userId - The ID of the user attempting the update.
 * @param updateData - Object containing fields to update (e.g., title, description, completed).
 * @returns A promise resolving to the updated task document or null if not found/error/no access.
 */
const updateTaskUnderList = async (taskId: string | Types.ObjectId, listId: string | Types.ObjectId, userId: string | Types.ObjectId, updateData: Partial<Pick<ITask, 'title' | 'description' | 'completed'>>): Promise<ITask | null> => {
    try {
        const list = await listService.getListById(listId, userId);
        if (!list) {
            console.log(`Access denied or list not found for listId: ${listId}, userId: ${userId}`);
            return null;
        }

        const allowedUpdates: Partial<ITask> = {};
        if (updateData.title !== undefined) {
            if (updateData.title.trim() === '') throw new Error("Task title cannot be empty.");
            allowedUpdates.title = updateData.title.trim();
        }
        if (updateData.description !== undefined) {
            allowedUpdates.description = updateData.description.trim();
        }
        if (updateData.completed !== undefined) {
            allowedUpdates.completed = updateData.completed;
        }

        if (Object.keys(allowedUpdates).length === 0) {
            console.log("No valid fields provided for task update.");
            return await Task.findOne({ _id: taskId, listId: listId }).exec();
        }

        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, listId: listId },
            { $set: allowedUpdates },
            { new: true, runValidators: true }
        ).exec();

        if (!updatedTask) {
            console.log(`Task ${taskId} not found in list ${listId}.`);
            return null;
        }

        console.log(`Task ${taskId} updated successfully in list ${listId}`);
        return updatedTask;
    } catch (error: any) {
        console.error(`Error updating task ${taskId} in list ${listId}:`, error.message);
        return null;
    }
};

/**
 * Deletes a task from a specific list. Ensures user has list access.
 * @param taskId - The ID of the task to delete.
 * @param listId - The ID of the list the task belongs to.
 * @param userId - The ID of the user attempting the deletion.
 * @returns A promise resolving to the deleted task document or null if not found/error/no access.
 */
const deleteTaskUnderList = async (taskId: string | Types.ObjectId, listId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<ITask | null> => {
    try {
        const list = await listService.getListById(listId, userId);
        if (!list) {
            console.log(`Access denied or list not found for listId: ${listId}, userId: ${userId}`);
            return null;
        }

        const deletedTask = await Task.findOneAndDelete({
            _id: taskId,
            listId: listId
        }).exec();

        if (!deletedTask) {
            console.log(`Task ${taskId} not found in list ${listId}.`);
            return null;
        }

        console.log(`Task ${deletedTask._id} deleted successfully from list ${listId}`);
        return deletedTask;
    } catch (error: any) {
        console.error(`Error deleting task ${taskId} from list ${listId}:`, error.message);
        return null;
    }
};

/**
 * Deletes all tasks associated with a specific list ID.
 * Intended for internal use, e.g., when a list is deleted.
 * @param listId - The ID of the list whose tasks should be deleted.
 * @returns A promise resolving to the result of the deleteMany operation.
 */
const deleteTasksByListId = async (listId: string | Types.ObjectId): Promise<{ acknowledged: boolean; deletedCount: number }> => {
    try {
        const result = await Task.deleteMany({ listId: listId }).exec();
        console.log(`Deleted ${result.deletedCount} tasks for list ${listId}`);
        return result;
    } catch (error: any) {
        console.error(`Error deleting tasks for list ${listId}:`, error.message);
        throw error;
    }
};


export const taskService = {
    getTasksByListId,
    getTaskByIdUnderList,
    addTaskUnderList,
    updateTaskUnderList,
    deleteTaskUnderList,
    deleteTasksByListId
    // Add updateTaskOrder function here if needed later
};
