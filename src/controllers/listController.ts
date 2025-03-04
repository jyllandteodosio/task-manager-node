import { Request, Response } from "express";
import * as listService from "../services/listService.ts";

export const testConnect = (req: Request, res: Response) => {
	res.json({ message: "connected to listController" });
};

export const getLists = async (req: Request, res: Response) => {
	try {
		const lists = await listService.getLists();

		const response = {
			message: "GET LISTS: Successfully fetched lists",
			result: lists,
		};

		console.log(response);
		res.json(response);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const getListsByUser = async (req: Request, res: Response) => {
	try {
		const lists = await listService.getListsByUser(req);

		const response = {
			message: "GET LISTS BY USER ID: Successfully fetched lists",
			result: lists,
		};

		console.log(response);
		res.json(response);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const getListById = async (req: Request, res: Response) => {
	try {
		const lists = await listService.getListById(req);

		const response = {
			message: "GET LIST BY ID: Successfully fetched list",
			result: lists,
		};

		console.log(response);
		res.json(response);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const addList = async (req: Request, res: Response) => {
	try {
		const list = await listService.addList(req);

		const response = {
			message: "ADD LIST: Successfully added list",
			result: list,
		};

		console.log(response);
		res.json(response);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const updateList = async (req: Request, res: Response) => {
	try {
		const list = await listService.updateList(req);

		const response = {
			message: "UPDATE LIST: Successfully updated list",
			result: list,
		};

		console.log(response);
		res.json(response);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const deleteList = async (req: Request, res: Response) => {
	try {
		const list = await listService.deleteList(req);

		const response = {
			message: "DELETE LIST: Successfully deleted list",
			result: list,
		};

		console.log(response);
		res.json(response);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};
