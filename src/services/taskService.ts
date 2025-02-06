const Task = require("../models/tasksexports.getTasks = async (req, res) => {
	try {
		const db = getDB();
		const tasks = await db.collection("tasks").find({}).toArray();

		const response = {
			message: "GET TASKS: Successfully fetched tasks",
			result: tasks.map(task => new TaskModel(task))
		};

		console.log(response);
		res.json(response);

	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getTaskWithId = async (req, res) => {
	try {
		const { id } = req.params;

		const db = getDB();
		const tasks = await db.collection("tasks").find({ id: id }).toArray();

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
		const uuid = uuidv4();
		const currentDate = new Date().toISOString();

		// const newTask = {
		// 	id: uuid, - generate in api
		// 	title: "Task 3", - from request
		// 	body: "Task description", - from request
		// 	dueDate: currentDate, - from request
		// 	status: "Pending", - from request
		// 	userId: "1", - from request
		// 	creationDate: currentDate, - generate in api
		// 	prev: "ec1a5f2c-20b3-4009-9c63-4fb021e69a48" - from request
		// };

		const newTask = req.body;
		newTask.id = uuid;
		newTask.creationDate = currentDate;
		console.log({ newTask: req.body });

		const db = getDB();
		const task = await db.collection("tasks").insertOne(newTask);

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
		const { id } = req.params;
		const filter = { id: id }

		const updatedTask = {
			$set : req.body,
		}
		console.log({ updatedTask: req.body });

		const db = getDB();
		const task = await db.collection("tasks").updateOne(filter, updatedTask);

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

		const { id } = req.params;
		const filter = { id: id }

		const db = getDB();
		const task = await db.collection("tasks").deleteOne(filter);

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

")