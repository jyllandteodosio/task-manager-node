import { Request, Response } from "express";
import { userService } from "../services/userService.ts"

export const getUserById = async (req: Request, res: Response) => {
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

export const addUser = async (req: Request, res: Response) => {
	try {
		const user = await userService.addUser(req);

		const response = {
			message: "ADD USER: Successfully added user",
			result: user,
		};

		console.log(response);
		res.json(response);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const updateUser = async (req: Request, res: Response) => {
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

export const deleteUser = async (req: Request, res: Response) => {
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
