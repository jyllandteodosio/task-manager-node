import { Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";
import { getDB } from "../db.ts";
import User from '../models/userModel.ts';

declare module "express-session" {
	interface SessionData {
		userId: string;
		isAuthenticated: boolean;
	}
}

const saltRounds = 10;

const loginUser = async (req: Request) => {
	try {
		const { username, password: inputPassword } = req.body;
		const db = getDB();
		const result = await db.collection("users").findOne({ username: username });

		if (!result) {
			return null;
		} else {
			bcrypt.compare(inputPassword, result.password, (err, result) => {
				if (err) {
					console.error("Error comparing passwords:", err);
					return;
				}

				if (result) {
					console.log("Passwords match. User authenticated");
				} else {
					console.log("Passwords do not match. Authentication failed.");
					return null;
				}
			});
		}

		console.log({ session: req.session.id })

		// Save details on session
		req.session.userId = result.id;
		req.session.isAuthenticated = true;
		req.session.save();

		const newUser = new User(
			result.id,
			result.username,
			result.password,
			result.firstName,
			result.lastName,
			result.creationDate
		);

		return newUser.id;

	} catch (error) {
		console.log(error);
	}
};

export const authService = { loginUser }