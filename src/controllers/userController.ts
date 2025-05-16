import { Request, Response } from "express";
import { userService } from "../services/userService.ts";
import { isValidObjectId } from 'mongoose';
import axios from 'axios';
import { AuthenticatedRequest } from "../routes/auth.ts";

const verifyRecaptcha = async (token: string | undefined): Promise<boolean> => {
	if (!token) {
		return false;
	}

	const secretKey = process.env.RECAPTCHA_SECRET_KEY;
	if (!secretKey) {
		console.error("RECAPTCHA_SECRET_KEY is not set in environment variables.");
		return false;
	}

	try {
		const response = await axios.post(
			`https://www.google.com/recaptcha/api/siteverify`,
			null,
			{
				params: {
					secret: secretKey,
					response: token,
				},
			}
		);

		const { success, score } = response.data;

		const scoreThreshold = 0.5;

		if (success && score >= scoreThreshold) {
			console.log(`Recaptcha verification successful with score: ${score}`);
			return true;
		} else {
			console.warn(`Recaptcha verification failed or score too low: success=${success}, score=${score}`);
			return false;
		}
	} catch (error) {
		console.error("Error verifying recaptcha token:", error);
		return false;
	}
};


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

const findUsersByEmail = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email } = req.query;

		if (!email) {
			res.status(400).json({ message: "Email query parameter is required." });
			return;
		}

		const { user } = req as AuthenticatedRequest;
		const loggedInUserId = user?._id;

		const users = await userService.findUsersByEmail(email as string, loggedInUserId?.toString());

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
		console.error("Error in findUsersByEmail controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};

const addUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const userData = req.body;
		const { recaptchaToken, ...restUserData } = userData;

		const isHuman = await verifyRecaptcha(recaptchaToken);

		if (!isHuman) {
			res.status(400).json({
				message: "reCAPTCHA verification failed. Please try again.",
			});
			return;
		}

		if (!restUserData.username || !restUserData.password) {
			res.status(400).json({ message: "Username and password are required." });
			return;
		}

		const newUser = await userService.addUser(restUserData);

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


const userController = { getUserById, findUsersByEmail, addUser, updateUser, deleteUser };

export default userController;