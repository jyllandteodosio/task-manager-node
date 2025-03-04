import { Request, Response } from "express";
import * as taskService from "../services/taskService.ts";

export const testConnect = (req: Request, res: Response) => {
  res.json({ message: "connected to taskController" });
};

export const getTasksByListId = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getTasksByListId(req);

    const response = {
      message: "GET TASKS BY LIST ID: Successfully fetched tasks",
      result: tasks,
    };

    console.log(response);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskByIdUnderList = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getTaskByIdUnderList(req);

    const response = {
      message: "GET TASK BY ID UNDER LIST: Successfully fetched tasks",
      result: tasks,
    };

    console.log(response);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addTaskUnderList = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.addTaskUnderList(req);

    const response = {
      message: "ADD TASK UNDER LIST: Successfully added task",
      result: tasks,
    };

    console.log(response);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTaskUnderList = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.updateTaskUnderList(req);

    const response = {
      message: "UPDATE TASK UNDER LIST: Successfully updated task",
      result: tasks,
    };

    console.log(response);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTaskUnderList = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.deleteTaskUnderList(req);

    const response = {
      message: "DELETE TASK UNDER LIST: Successfully deleted task",
      result: tasks,
    };

    console.log(response);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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

export const getTaskByUser = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getTaskByUser(req);

    const response = {
      message: "GET TASKS BY USER ID: Successfully fetched tasks",
      result: tasks,
    };

    console.log(response);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getTaskById(req);

    const response = {
      message: "GET TASK BY ID: Successfully fetched task",
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
