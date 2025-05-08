import { Request, Response } from "express";
import { userService } from "../services/userService.ts";
import { isValidObjectId } from 'mongoose';

const getUserById = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			res.status(400).json({ message: "Invalid user ID format." });
			return;
		}

		const user = await userService.getUserById(id);

		if (!user) {
			res.status(404).json({ message: "User not found." });
			return;
		}

		const { password, ...userResponse } = user.toObject();

		res.status(200).json({
			message: "Successfully fetched user",
			result: userResponse,
		});

	} catch (error: any) {
		console.error("Error in getUserById controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};

const findUsersByUsername = async (req: Request, res: Response): Promise<void> => {
	try {
		const { username } = req.query;

		if (!username) {
			res.status(400).json({ message: "Username query parameter is required." });
			return;
		}

		const loggedInUserId = req.session.userId;

		const users = await userService.findUsersByUsername(username as string, loggedInUserId);

		if (!users || users.length === 0) {
			res.status(404).json({ message: "No users found." });
			return;
		}

		const usersResponse = users.map(user => {
			const { password, ...userResponse } = user.toObject();
			return userResponse;
		});

		res.status(200).json({
			message: "Successfully fetched users",
			result: usersResponse,
		});

	} catch (error: any) {
		console.error("Error in findUsersByUsername controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};

const addUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const userData = req.body;

		if (!userData.username || !userData.password) {
			res.status(400).json({ message: "Username and password are required." });
			return;
		}

		const newUser = await userService.addUser(userData);

		if (!newUser) {
			res.status(409).json({ message: "Failed to register user. Username might already exist." });
			return;
		}

		const { password, ...userResponse } = newUser.toObject();

		res.status(201).json({
			message: "Successfully registered user",
			result: userResponse,
		});

	} catch (error: any) {
		console.error("Error in addUser controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const updateData = req.body;

		if (!isValidObjectId(id)) {
			res.status(400).json({ message: "Invalid user ID format." });
			return;
		}

		delete updateData.username;
		delete updateData._id;

		if (Object.keys(updateData).length === 0) {
			res.status(400).json({ message: "No update data provided." });
			return;
		}

		const updatedUser = await userService.updateUser(id, updateData);

		if (!updatedUser) {
			res.status(404).json({ message: "User not found or update failed." });
			return;
		}

		const { password, ...userResponse } = updatedUser.toObject();

		res.status(200).json({
			message: "Successfully updated user",
			result: userResponse,
		});

	} catch (error: any) {
		console.error("Error in updateUser controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			res.status(400).json({ message: "Invalid user ID format." });
			return;
		}

		const deletedUser = await userService.deleteUser(id);

		if (!deletedUser) {
			res.status(404).json({ message: "User not found." });
			return;
		}

		res.status(200).json({
			message: "Successfully deleted user",
			result: { userId: deletedUser._id },
		});

	} catch (error: any) {
		console.error("Error in deleteUser controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};

const userController = { getUserById, findUsersByUsername, addUser, updateUser, deleteUser };

export default userController;
