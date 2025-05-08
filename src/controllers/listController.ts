import { Request, Response } from "express";
import { listService } from "../services/listService.ts";
import { isValidObjectId } from 'mongoose';
import { Server } from "socket.io";

/**
 * Gets all lists accessible by the logged-in user.
 */
export const getListsByUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.session.userId;
		if (!userId) {
			res.status(401).json({ message: "Unauthorized: User not logged in." });
			return;
		}

		const lists = await listService.getListsByUser(userId);

		res.status(200).json({
			message: "Successfully fetched lists for user",
			result: lists || [],
		});

	} catch (error: any) {
		console.error("Error in getListsByUser controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};

/**
 * Gets a specific list by its ID, checking user access.
 */
export const getListById = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.session.userId;
		const { listId } = req.params;

		if (!userId) {
			res.status(401).json({ message: "Unauthorized: User not logged in." });
			return;
		}
		if (!isValidObjectId(listId)) {
			res.status(400).json({ message: "Invalid list ID format." });
			return;
		}

		const list = await listService.getListById(listId, userId);

		if (!list) {
			res.status(404).json({ message: "List not found or access denied." });
			return;
		}

		res.status(200).json({
			message: "Successfully fetched list",
			result: list,
		});

	} catch (error: any) {
		console.error("Error in getListById controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};

/**
 * Adds a new list for the logged-in user.
 */
export const addList = async (req: Request, res: Response): Promise<void> => {
	try {
		console.log("Request body for adding list:", req.body);
		const userId = req.session.userId;
		const listData = req.body;

		if (!userId) {
			res.status(401).json({ message: "Unauthorized: User not logged in." });
			return;
		}
		if (!listData.title || typeof listData.title !== 'string' || listData.title.trim() === '') {
			res.status(400).json({ message: "List title is required and cannot be empty." });
			return;
		}


		const newList = await listService.addList(listData, userId);

		if (!newList) {
			res.status(500).json({ message: "Failed to add list." });
			return;
		}

		res.status(201).json({
			message: "Successfully added list",
			result: newList,
		});

	} catch (error: any) {
		console.error("Error in addList controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};

/**
 * Updates a list by its ID, checking user access.
 */
export const updateList = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.session.userId;
		const { listId } = req.params;
		const updateData = req.body;

		if (!userId) {
			res.status(401).json({ message: "Unauthorized: User not logged in." });
			return;
		}
		if (!isValidObjectId(listId)) {
			res.status(400).json({ message: "Invalid list ID format." });
			return;
		}
		// Optional: Add validation for updateData fields

		const updatedList = await listService.updateList(listId, updateData, userId);

		if (!updatedList) {
			res.status(404).json({ message: "List not found, access denied, or update failed." });
			return;
		}

		res.status(200).json({
			message: "Successfully updated list",
			result: updatedList,
		});

	} catch (error: any) {
		console.error("Error in updateList controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};

/**
 * Deletes a list by its ID, requiring owner access.
 */
export const deleteList = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.session.userId;
		const { listId } = req.params;

		if (!userId) {
			res.status(401).json({ message: "Unauthorized: User not logged in." });
			return;
		}
		if (!isValidObjectId(listId)) {
			res.status(400).json({ message: "Invalid list ID format." });
			return;
		}

		const deletedList = await listService.deleteList(listId, userId);

		if (!deletedList) {
			res.status(404).json({ message: "List not found or user is not the owner." });
			return;
		}

		res.status(200).json({
			message: "Successfully deleted list",
			result: { listId: deletedList._id },
		});

	} catch (error: any) {
		console.error("Error in deleteList controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};


/**
 * Adds a collaborator to a specific list. Requires owner access.
 */
export const addCollaborator = async (req: Request, res: Response): Promise<void> => {
	try {
		const ownerId = req.session.userId;
		const { listId } = req.params;
		const { collaboratorId } = req.params;

		if (!ownerId) {
			res.status(401).json({ message: "Unauthorized: User not logged in." });
			return;
		}
		if (!isValidObjectId(listId)) {
			res.status(400).json({ message: "Invalid list ID format." });
			return;
		}
		if (!collaboratorId || !isValidObjectId(collaboratorId)) {
			res.status(400).json({ message: "Invalid or missing collaborator ID." });
			return;
		}

		const updatedList = await listService.addCollaborator(listId, collaboratorId, ownerId);

		if (!updatedList) {
			res.status(403).json({ message: "List is already shared with this user." });
			return;
		}

		const io: Server = req.app.get('socketio');
		if (io) {
			const sockets = await io.fetchSockets();
			const collaboratorSocket = sockets.find((socket) => socket.data.userId === collaboratorId);

			if (collaboratorSocket) {
				collaboratorSocket.join(listId);
				console.log(`User ${collaboratorId} joined room ${listId}`);
			}

			io.to(listId).emit('addCollaborator', { listId: listId, collaboratorId: collaboratorId, ownerId: ownerId });
			console.log(`Emitted 'addCollaborator' for list ${listId} after adding collaborator ${collaboratorId}`);
		} else {
			console.warn("Socket.IO instance not found on app.");
		}

		res.status(200).json({
			message: "Successfully added collaborator",
			result: updatedList,
		});

	} catch (error: any) {
		console.error("Error in addCollaborator controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};

/**
 * Removes a collaborator from a specific list. Requires owner access.
 */
export const removeCollaborator = async (req: Request, res: Response): Promise<void> => {
	try {
		const ownerId = req.session.userId;
		const { listId, collaboratorId } = req.params;

		if (!ownerId) {
			res.status(401).json({ message: "Unauthorized: User not logged in." });
			return;
		}
		if (!isValidObjectId(listId)) {
			res.status(400).json({ message: "Invalid list ID format." });
			return;
		}
		if (!collaboratorId || !isValidObjectId(collaboratorId)) {
			res.status(400).json({ message: "Invalid or missing collaborator ID in URL parameters." });
			return;
		}

		const updatedList = await listService.removeCollaborator(listId, collaboratorId, ownerId);

		if (!updatedList) {
			res.status(403).json({ message: "Failed to remove collaborator. Check permissions or collaborator status." });
			return;
		}

		const io: Server = req.app.get('socketio');
		if (io) {
			const sockets = await io.fetchSockets();
			const collaboratorSocket = sockets.find((socket) => socket.data.userId === collaboratorId);

			if (collaboratorSocket) {
				collaboratorSocket.join(listId);
				console.log(`User ${collaboratorId} joined room ${listId}`);
			}

			io.to(listId).emit('removeCollaborator', { listId: listId, collaboratorId: collaboratorId, ownerId: ownerId });
			console.log(`Emitted 'removeCollaborator' for list ${listId} after removing collaborator ${collaboratorId}`);
		} else {
			console.warn("Socket.IO instance not found on app.");
		}

		res.status(200).json({
			message: "Successfully removed collaborator",
			result: updatedList,
		});

	} catch (error: any) {
		console.error("Error in removeCollaborator controller:", error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
};


const listController = {
	getListsByUser,
	getListById,
	addList,
	updateList,
	deleteList,
	addCollaborator,
	removeCollaborator
};

export default listController;
