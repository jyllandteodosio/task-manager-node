import { Request, Response } from "express";
import { taskService } from "../services/taskService.ts";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getTasks();

    const response = {
      message: "GET TASKS: Successfully fetched tasks",
      result: tasks,
    };

    console.log(response);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskWithId = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getTaskWithId(req);

    const response = {
      message: "GET TASK WITH ID: Successfully fetched task",
      result: tasks,
    };

    console.log(response);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.addTask(req);

    const response = {
      message: "ADD TASK: Successfully added task",
      result: task,
    };

    console.log(response);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.updateTask(req);

    const response = {
      message: "UPDATE TASK: Successfully updated task",
      result: task,
    };

    console.log(response);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.deleteTask(req);

    const response = {
      message: "DELETE TASK: Successfully deleted task",
      result: task,
    };

    console.log(response);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
