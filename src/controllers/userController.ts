import { Request, Response } from "express";
import { userService } from "../services/userService.ts"

const getUserById = async (req: Request, res: Response) => {
	try {
		const users = await userService.getUserById(req);

		const response = {
			message: "GET USER BY ID: Successfully fetched user",
			result: users,
		};

		console.log(response);
		res.json(response);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

const addUser = async (req: Request, res: Response) => {
	try {
		const user = await userService.addUser(req);
		const response = {
			message: "REGISTER USER: Successfully registered user",
			result: {},
		};

		if (user) {
			response.message = "REGISTER USER: Successfully registered user";
			response.result = { userId: user };
		}

		console.log(response);
		res.json(response);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

const updateUser = async (req: Request, res: Response) => {
	try {
		const user = await userService.updateUser(req);

		const response = {
			message: "UPDATE USER: Successfully updated user",
			result: user,
		};

		console.log(response);
		res.json(response);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

const deleteUser = async (req: Request, res: Response) => {
	try {
		const user = await userService.deleteUser(req);

		const response = {
			message: "DELETE USER: Successfully deleted user",
			result: user,
		};

		console.log(response);
		res.json(response);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

const userController = { getUserById, addUser, updateUser, deleteUser };

export default userController;