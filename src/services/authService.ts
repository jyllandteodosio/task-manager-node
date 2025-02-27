import { Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import { getDB } from "../db.ts";
import User from '../models/userModel.ts';

declare module "express-session" {
	interface SessionData {
		userId: string;
		isAuthenticated: boolean;
	}
}

const loginUser = async (req: Request) => {
	try {
		const { username, password } = req.body;
		const db = getDB();
		const user = await db.collection("users").findOne({ username: username });

		if (!user) {
			return null;
		} else {
			if (user.password !== password) return null;
		}

		console.log({ session: req.session.id })
		// Save details on session
		req.session.userId = user.id;
		req.session.isAuthenticated = true;
		req.session.save();

		return new User(
			user.id,
			user.username,
			user.password,
			user.firstName,
			user.lastName,
			user.creationDate
		);

	} catch (error) {
		console.log(error);
	}
};

const registerUser = async (req: Request) => {
	try {
		const newUser: User = {
			...req.body,
      id: uuidv4(),
			creationDate: new Date()
		};

		const db = getDB();
		const result = await db.collection("users").insertOne({
			...newUser,
			creationDate: newUser.creationDate.toISOString(),
		});

		const addedUserData = await db.collection("users").findOne({ _id: result.insertedId });
		return addedUserData;

	} catch (error) {
		console.log(error);
	}
};

export const authService = { loginUser, registerUser }