import { Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import { getDB } from "../db.ts";
import List from '../models/listModel.ts';

export const getLists = async () => {
	try {
		const db = getDB();
		const result = await db.collection("lists").find({}).toArray();

		if (!result.length) return null;

		const lists = result.map((list: List) => {
			return new List(
				list.id,
				list.title,
				list.userId,
				new Date(list.creationDate),
			)
		})

		return lists;
	} catch (error) {
		console.log(error);
	}
};

export const getListsByUser = async (req: Request) => {
	try {
		const userId = req.session.userId;
		const filter = {
			userId
		}

		const db = getDB();
		const result = await db.collection("lists").find(filter).toArray();

		if (!result.length) return null;

		const lists = result.map((list: List) => {
			return new List(
				list.id,
				list.title,
				list.userId,
				new Date(list.creationDate),
			)
		})

		return lists;
	} catch (error) {
		console.log(error);
	}
};

export const getListById = async (req: Request) => {
	try {
		const { listId } = req.params;
		const filter = {
			id: listId
		}

		const db = getDB();
		const result = await db.collection("lists").find(filter).toArray();

		if (!result.length) return null;

		const lists = result.map((list: List) => {
			return new List(
				list.id,
				list.title,
				list.userId,
				new Date(list.creationDate),
			)
		})

		return lists;
	} catch (error) {
		console.log(error);
	}
};

export const addList = async (req: Request) => {
	try {
		const userId = req.session.userId;
		const newList: List = {
			...req.body,
			id: uuidv4(),
			userId,
			creationDate: new Date()
		};

		const db = getDB();
		const query = await db.collection("lists").insertOne({
			...newList,
			creationDate: newList.creationDate.toISOString(),
		});

		const addedListData = await db.collection("lists").findOne({ _id: query.insertedId });
		return addedListData;

	} catch (error) {
		console.log(error);
	}
};

export const updateList = async (req: Request) => {
	try {
		const { listId } = req.params;
		const filter = {
			id: listId
		};

		const { _id, id, ...listToUpdate } = req.body;

		const db = getDB();
		const query = await db.collection("lists").updateOne(filter, { $set: listToUpdate });

		const updatedListData = await db.collection("lists").findOne({ _id: query.insertedId });
		return updatedListData;

	} catch (error) {
		console.log(error);
	}
};

export const deleteList = async (req: Request) => {
	try {
		const { listId } = req.params;
		const filter = {
			id: listId
		};

		const db = getDB();
		const result = await db.collection("lists").deleteOne(filter);

		return filter;

	} catch (error) {
		console.log(error);
	}
};
