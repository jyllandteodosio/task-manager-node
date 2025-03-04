import { Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";
import { getDB } from "../db.ts";
import User from '../models/userModel.ts';

const saltRounds = 10;

const getUserById = async (req: Request) => {
  try {
    const { id } = req.params;

    const db = getDB();
    const result = await db.collection("users").find({ id: id }).toArray();

		if(!result.length) return null;

		const users = result.map((user: User) => {
			return new User(
				user.id,
				user.username,
				user.password,
				user.firstName,
				user.lastName,
				user.creationDate
			)
		})

    return users;
  } catch (error) {
    console.log(error);
  }
};

const addUser = async (req: Request) => {
	try {
		const newUser: User = {
			...req.body,
			id: uuidv4(),
			creationDate: new Date()
		};

		const password = req.body.password;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const db = getDB();
		const query = await db.collection("users").insertOne({
			...newUser,
			creationDate: newUser.creationDate.toISOString(),
			password: hashedPassword,
		});

		const result = await db.collection("users").findOne({ _id: query.insertedId });

		const user = new User(
			result.id,
			result.username,
			result.password,
			result.firstName,
			result.lastName,
			result.creationDate
		);

		return user.id;

	} catch (error) {
		console.log(error);
	}
};

const updateUser = async (req: Request) => {
  try {
    const { id } = req.params;
    const filter = { id: id };

    const { _id, id: userId, password, ...userToUpdate } = req.body;
		const hashedPassword = await bcrypt.hash(password, saltRounds);
   
    const db = getDB();
    const query = await db.collection("users").updateOne(filter, { $set: {
      ...userToUpdate,
      password: hashedPassword,
    } });

		const result = await db.collection("users").findOne({ _id: query.insertedId });

    const user = new User(
			result.id,
			result.username,
			result.password,
			result.firstName,
			result.lastName,
			result.creationDate
		);

		return user.id;

  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req: Request) => {
  try {
    const { id } = req.params;
    const filter = { id: id };

    const db = getDB();
    const result = await db.collection("users").deleteOne(filter);

    return filter;

  } catch (error) {
    console.log(error);
  }
};

export const userService = { getUserById, addUser, updateUser, deleteUser }