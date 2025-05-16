import List, { IList } from '../models/listModel.js';
import { Types } from 'mongoose';

/**
 * Fetches all lists a specific user has access to (owned or collaborated on).
 * @param userId - The MongoDB _id of the user.
 * @returns A promise that resolves to an array of list documents or null if none found.
 */
const getListsByUser = async (userId: string | Types.ObjectId): Promise<IList[] | null> => {
	try {
		const lists = await List.find({ collaborators: userId })
			.sort({ createdAt: -1 })
			.exec();
		return lists.length > 0 ? lists : null;
	} catch (error: any) {
		console.error(`Error fetching lists for user ${userId}:`, error.message);
		return null;
	}
};

/**
 * Fetches a single list by its ID, ensuring the requesting user has access.
 * @param listId - The MongoDB _id of the list.
 * @param userId - The MongoDB _id of the user requesting the list.
 * @returns A promise that resolves to the list document or null if not found or no access.
 */
const getListById = async (listId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<IList | null> => {
	try {
		const list = await List.findOne({
			_id: listId,
			collaborators: userId
		}).exec();
		return list;
	} catch (error: any) {
		console.error(`Error fetching list ${listId} for user ${userId}:`, error.message);
		return null;
	}
};

/**
 * Creates a new list.
 * @param listData - Object containing list properties (e.g., title, description).
 * @param ownerId - The MongoDB _id of the user creating the list.
 * @returns A promise that resolves to the newly created list document or null on error.
 */
const addList = async (listData: Partial<IList>, ownerId: string | Types.ObjectId): Promise<IList | null> => {
	try {
		if (!listData.title) {
			throw new Error("List title is required.");
		}

		const newList = await List.create({
			...listData,
			ownerId: ownerId,
			collaborators: [ownerId]
		});
		console.log(`List created successfully with ID: ${newList._id} by owner ${ownerId}`);
		return newList;
	} catch (error: any) {
		console.error(`Error adding list for owner ${ownerId}:`, error.message);
		return null;
	}
};

/**
 * Updates an existing list. Requires owner or collaborator access.
 * @param listId - The MongoDB _id of the list to update.
 * @param updateData - An object containing the fields to update (e.g., title, description).
 * @param userId - The MongoDB _id of the user attempting the update.
 * @returns A promise that resolves to the updated list document or null if not found/error/no access.
 */
const updateList = async (listId: string | Types.ObjectId, updateData: Partial<IList>, userId: string | Types.ObjectId): Promise<IList | null> => {
	try {
		delete updateData.ownerId;
		delete updateData.collaborators;

		const updatedList = await List.findOneAndUpdate(
			{ _id: listId, collaborators: userId },
			{ $set: updateData },
			{ new: true, runValidators: true }
		).exec();

		if (!updatedList) {
			console.log(`List ${listId} not found or user ${userId} lacks permission for update.`);
			return null;
		}
		console.log(`List ${listId} updated successfully by user ${userId}`);
		return updatedList;
	} catch (error: any) {
		console.error(`Error updating list ${listId} by user ${userId}:`, error.message);
		return null;
	}
};

/**
 * Deletes a list. Requires owner access.
 * @param listId - The MongoDB _id of the list to delete.
 * @param userId - The MongoDB _id of the user attempting the deletion.
 * @returns A promise that resolves to the deleted list document or null if not found/error/no access.
 */
const deleteList = async (listId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<IList | null> => {
	try {
		const deletedList = await List.findOneAndDelete({
			_id: listId,
			ownerId: userId
		}).exec();

		if (!deletedList) {
			console.log(`List ${listId} not found or user ${userId} is not the owner.`);
			return null;
		}

		// TODO: Delete associated tasks when a list is deleted.
		// taskService.deleteTasksByListId(listId);

		console.log(`List ${deletedList._id} deleted successfully by owner ${userId}`);
		return deletedList;
	} catch (error: any) {
		console.error(`Error deleting list ${listId} by user ${userId}:`, error.message);
		return null;
	}
};


/**
 * Adds a collaborator to a list. Requires owner access.
 * @param listId - The ID of the list to share.
 * @param collaboratorId - The ID of the user to add as a collaborator.
 * @param ownerId - The ID of the user initiating the share (must be the owner).
 * @returns The updated list document or null on error/failure.
 */
const addCollaborator = async (listId: string | Types.ObjectId, collaboratorId: string | Types.ObjectId, ownerId: string | Types.ObjectId): Promise<IList | null> => {
	try {
		const list = await List.findOneAndUpdate(
			{
				_id: listId,
				ownerId: ownerId,
				collaborators: { $ne: collaboratorId }
			},
			{ $addToSet: { collaborators: collaboratorId } },
			{ new: true }
		).exec();

		if (!list) {
			console.log(`Failed to add collaborator ${collaboratorId} to list ${listId}. List not found, user ${ownerId} not owner, or collaborator already exists.`);
			return null;
		}
		console.log(`Collaborator ${collaboratorId} added to list ${listId} by owner ${ownerId}`);
		return list;
	} catch (error: any) {
		console.error(`Error adding collaborator to list ${listId}:`, error.message);
		return null;
	}
}

/**
 * Removes a collaborator from a list. Requires owner access.
 * Cannot remove the owner themselves via this method.
 * @param listId - The ID of the list.
 * @param collaboratorId - The ID of the user to remove.
 * @param ownerId - The ID of the user initiating the removal (must be the owner).
 * @returns The updated list document or null on error/failure.
 */
const removeCollaborator = async (listId: string | Types.ObjectId, collaboratorId: string | Types.ObjectId, ownerId: string | Types.ObjectId): Promise<IList | null> => {
	try {
		const ownerObjId = typeof ownerId === 'string' ? new Types.ObjectId(ownerId) : ownerId;
		const collabObjId = typeof collaboratorId === 'string' ? new Types.ObjectId(collaboratorId) : collaboratorId;

		if (ownerObjId.equals(collabObjId)) {
			console.log(`Cannot remove owner ${ownerId} from list ${listId} using this method.`);
			return null;
		}

		const list = await List.findOneAndUpdate(
			{
				_id: listId,
				ownerId: ownerId,
			},
			{ $pull: { collaborators: collaboratorId } },
			{ new: true }
		).exec();

		if (!list) {
			console.log(`Failed to remove collaborator ${collaboratorId} from list ${listId}. List not found or user ${ownerId} not owner.`);
			return null;
		}
		console.log(`Collaborator ${collaboratorId} removed from list ${listId} by owner ${ownerId}`);
		return list;
	} catch (error: any) {
		console.error(`Error removing collaborator from list ${listId}:`, error.message);
		return null;
	}
}


export const listService = {
	getListsByUser,
	getListById,
	addList,
	updateList,
	deleteList,
	addCollaborator,
	removeCollaborator
};
