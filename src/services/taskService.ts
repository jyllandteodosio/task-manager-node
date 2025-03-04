import { Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import { getDB } from "../db.ts";
import Task from '../models/taskModel.ts';

export const getTasksByListId = async (req: Request) => {
  try {
    const { listId } = req.params;
    const filter = {
      listId,
    }

    const db = getDB();
    const result = await db.collection("tasks").find(filter).toArray();

		if(!result.length) return null;

		const tasks = result.map((task: Task) => {
			return new Task(
				task.id,
        task.title,
        task.body,
        task.userId,
        task.listId,
        new Date(task.creationDate),
        task.prev
			)
		});

    return tasks;
  } catch (error) {
    console.log(error);
  }
};

export const getTaskByIdUnderList = async (req: Request) => {
  try {
    const { taskId, listId } = req.params;
    const filter = {
      id: taskId,
      listId: listId
    }

    const db = getDB();
    const result = await db.collection("tasks").findOne(filter);

    console.log({service_getTaskByIdUnderList: result.length});

		if(!result) return null;

		const task = new Task(
      result.id,
      result.title,
      result.body,
      result.userId,
      result.listId,
      new Date(result.creationDate),
      result.prev
    )

    return task;

  } catch (error) {
    console.log(error);
  }
};

export const addTaskUnderList = async (req: Request) => {
	try {
    const { listId } = req.params;
    const userId = req.session.userId;
		const newTask: Task = {
			...req.body,
      id: uuidv4(),
      userId,
      listId,
			creationDate: new Date()
		};

		const db = getDB();
		const query = await db.collection("tasks").insertOne({
			...newTask,
			creationDate: newTask.creationDate.toISOString(),
		});

		const addedTaskData = await db.collection("tasks").findOne({ _id: query.insertedId });
		return addedTaskData;

	} catch (error) {
		console.log(error);
	}
};

export const updateTaskUnderList = async (req: Request) => {
  try {
    const { taskId, listId } = req.params;
    const filter = {
      id: taskId,
      listId,
    };

    const { _id, id, ...taskToUpdate } = req.body;
   
    const db = getDB();
    const query = await db.collection("tasks").updateOne(filter, { $set: taskToUpdate });

		const updatedTaskData = await db.collection("tasks").findOne({ _id: query.insertedId });
    return updatedTaskData;

  } catch (error) {
    console.log(error);
  }
};

export const deleteTaskUnderList = async (req: Request) => {
  try {
    const { taskId, listId } = req.params;
    const filter = {
      id: taskId,
      listId
    };

    const db = getDB();
    const result = await db.collection("tasks").deleteOne(filter);

    return filter;

  } catch (error) {
    console.log(error);
  }
};

// Old task routes

export const getTasks = async () => {
  try {
    const db = getDB();
    const result = await db.collection("tasks").find({}).toArray();

    if(!result.length) return null;

		const tasks = result.map((task: Task) => {
			return new Task(
				task.id,
        task.title,
        task.body,
        task.userId,
        task.listId,
        new Date(task.creationDate),
        task.prev
			)
		})

    return tasks;
  } catch (error) {
    console.log(error);
  }
};

export const getTaskByUser = async (req: Request) => {
  try {
    const userId = req.session.userId;
    const filter = {
      userId,
    }

    const db = getDB();
    const result = await db.collection("tasks").find(filter).toArray();

		if(!result.length) return null;

		const tasks = result.map((task: Task) => {
			return new Task(
				task.id,
        task.title,
        task.body,
        task.userId,
        task.listId,
        new Date(task.creationDate),
        task.prev
			)
		})

    return tasks;
  } catch (error) {
    console.log(error);
  }
};

export const getTaskById = async (req: Request) => {
  try {
    const { taskId } = req.params;
    const filter = {
      id: taskId,
    }

    const db = getDB();
    const result = await db.collection("tasks").find(filter).toArray();

		if(!result.length) return null;

		const tasks = result.map((task: Task) => {
			return new Task(
				task.id,
        task.title,
        task.body,
        task.userId,
        task.listId,
        new Date(task.creationDate),
        task.prev
			)
		})

    return tasks;
  } catch (error) {
    console.log(error);
  }
};

export const addTask = async (req: Request) => {
	try {
		const newTask: Task = {
			...req.body,
      id: uuidv4(),
			creationDate: new Date()
		};

		const db = getDB();
		const query = await db.collection("tasks").insertOne({
			...newTask,
			creationDate: newTask.creationDate.toISOString(),
		});

		const addedTaskData = await db.collection("tasks").findOne({ _id: query.insertedId });
		return addedTaskData;

	} catch (error) {
		console.log(error);
	}
};

export const updateTask = async (req: Request) => {
  try {
    const { taskId } = req.params;
    const filter = {
      id: taskId
    };

    const { _id, id, ...taskToUpdate } = req.body;
   
    const db = getDB();
    const query = await db.collection("tasks").updateOne(filter, { $set: taskToUpdate });

		const updatedTaskData = await db.collection("tasks").findOne({ _id: query.insertedId });
    return updatedTaskData;

  } catch (error) {
    console.log(error);
  }
};

export const deleteTask = async (req: Request) => {
  try {
    const { taskId } = req.params;
    const filter = {
      id: taskId
    };

    const db = getDB();
    const result = await db.collection("tasks").deleteOne(filter);

    return filter;

  } catch (error) {
    console.log(error);
  }
};
