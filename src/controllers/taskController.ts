const express = require("express");
const taskService = require("../services/taskService")


exports.getTasks = async (req, res) => {
	try {
		const tasks = await taskService.getTasks();

		const response = {
			message: "GET TASKS: Successfully fetched tasks",
			result: tasks
		};

		console.log(response);
		res.json(response);

	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getTaskWithId = async (req, res) => {
	try {
		const tasks = await taskService.getTaskWithId();

		const response = {
			message: "GET TASK WITH ID: Successfully fetched task",
			result: tasks
		};

		console.log(response);
		res.json(response);

	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.addTask = async (req, res) => {
	try {
		const task = await  taskService.addTask();

		const response = {
			message: "ADD TASK: Successfully added task",
			result: task
		};

		console.log(response)
		res.json(response);

	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.updateTask = async (req, res) => {
	try {
		const task = await taskService.updateTask();

		const response = {
			message: "UPDATE TASK: Successfully updated task",
			result: task
		};

		console.log(response) 
		res.json(response);

	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.deleteTask = async (req, res) => {
	try {
		const task = await taskService.deleteTask()

		const response = {
			message: "DELETE TASK: Successfully deleted task",
			result: task
		};

		console.log(response) 
		res.json(response);

	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

