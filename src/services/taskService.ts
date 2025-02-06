import { Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import { getDB } from "../db.ts";
import Task from '../models/taskModel.ts';

const getTasks = async () => {
  try {
    const db = getDB();
    const result = await db.collection("tasks").find({}).toArray();

    if(!result.length) return null;

		const tasks = result.map((task: Task) => {
			return new Task(
				task.id,
        task.title,
        task.body,
        new Date(task.dueDate),
        task.status,
        task.userId,
        new Date(task.creationDate),
        task.prev
			)
		})

    return tasks;
  } catch (error) {
    console.log(error);
  }
};

const getTaskWithId = async (req: Request) => {
  try {
    const { id } = req.params;

    const db = getDB();
    const result = await db.collection("tasks").find({ id: id }).toArray();

		if(!result.length) return null;

		const tasks = result.map((task: Task) => {
			return new Task(
				task.id,
        task.title,
        task.body,
        new Date(task.dueDate),
        task.status,
        task.userId,
        new Date(task.creationDate),
        task.prev
			)
		})

    return tasks;
  } catch (error) {
    console.log(error);
  }
};

const addTask = async (req: Request) => {
	try {
		const newTask: Task = {
			...req.body,
      id: uuidv4(),
			creationDate: new Date()
		};

		const db = getDB();
		const result = await db.collection("tasks").insertOne({
			...newTask,
			creationDate: newTask.creationDate.toISOString(),
		});
		console.log(result);

		const addedTaskData = await db.collection("tasks").findOne({ _id: result.insertedId });
		return addedTaskData;

	} catch (error) {
		console.log(error);
	}
};

const updateTask = async (req: Request) => {
  try {
    const { id } = req.params;
    const filter = { id: id };

    const updatedTask: Task = {
      ...req.body,
    };
    console.log({ updatedTask });

    const db = getDB();
    const result = await db.collection("tasks").updateOne(filter, { $set: updatedTask });
		console.log(result);

		const updatedTaskData = await db.collection("tasks").findOne({ id: id });
    return updatedTaskData;

  } catch (error) {
    console.log(error);
  }
};

const deleteTask = async (req: Request) => {
  try {
    const { id } = req.params;
    const filter = { id: id };

    const db = getDB();
    const result = await db.collection("tasks").deleteOne(filter);

    return result;

  } catch (error) {
    console.log(error);
  }
};

export const taskService = { getTasks, getTaskWithId, addTask, updateTask, deleteTask }