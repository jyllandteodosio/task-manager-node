import bcrypt from "bcryptjs";
import User, { IUser } from '../models/userModel.js';

const saltRounds = 10;

/**
 * Finds a user by their MongoDB _id.
 * @param userId - The MongoDB _id of the user to find.
 * @returns A promise that resolves to the user document or null if not found.
 */
const getUserById = async (userId: string): Promise<IUser | null> => {
    try {
        const user = await User.findById(userId).exec();
        return user;
    } catch (error) {
        console.error(`Error fetching user by ID ${userId}:`, error);
        return null;
    }
};

/**
 * Finds users by their email using a case-insensitive regex search.
 * Optionally excludes a user by their MongoDB _id.
 * @param email - The email to search for.
 * @param excludeUserId - The MongoDB _id of the user to exclude from the search.
 * @returns A promise that resolves to an array of user documents or null on error.
 */
const findUsersByEmail = async (email: string, excludeUserId?: string) => {
    const query: any = {
        email: { $regex: new RegExp(email, "i") }
    };
    if (excludeUserId) {
        query._id = { $ne: excludeUserId };
    }
    return User.find(query);
};

/**
 * Creates a new user. Password hashing is handled by the pre-save hook in the User model.
 * @param userData - An object containing user data (username, password, etc.).
 * @returns A promise that resolves to the newly created user document or null on error.
 */
const addUser = async (userData: Partial<IUser>): Promise<IUser | null> => {
    try {
        if (!userData.username || !userData.password) {
            throw new Error("Username and password are required to create a user.");
        }

        const newUser = await User.create(userData);
        console.log(`User created successfully with ID: ${newUser._id}`);
        return newUser;
    } catch (error: any) {
        console.error("Error adding user:", error.message);

        if (error.code === 11000) {
            console.error("Username already exists.");
        }
        return null;
    }
};

/**
 * Updates an existing user by their MongoDB _id.
 * Hashes the password explicitly if it's included in the update data.
 * @param userId - The MongoDB _id of the user to update.
 * @param updateData - An object containing the fields to update.
 * @returns A promise that resolves to the updated user document or null if not found/error.
 */
const updateUser = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
    try {
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        } else {
            delete updateData.password;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).exec();

        if (!updatedUser) {
            console.log(`User with ID ${userId} not found for update.`);
            return null;
        }

        console.log(`User updated successfully: ${updatedUser._id}`);
        return updatedUser;
    } catch (error: any) {
        console.error(`Error updating user ${userId}:`, error.message);
        if (error.code === 11000) {
            console.error("Username already exists during update.");
        }
        return null;
    }
};

/**
 * Deletes a user by their MongoDB _id.
 * @param userId - The MongoDB _id of the user to delete.
 * @returns A promise that resolves to the deleted user document or null if not found/error.
 */
const deleteUser = async (userId: string): Promise<IUser | null> => {
    try {
        const deletedUser = await User.findByIdAndDelete(userId).exec();

        if (!deletedUser) {
            console.log(`User with ID ${userId} not found for deletion.`);
            return null;
        }

        console.log(`User deleted successfully: ${deletedUser._id}`);
        return deletedUser;
    } catch (error) {
        console.error(`Error deleting user ${userId}:`, error);
        return null;
    }
};

export const userService = {
    getUserById,
    findUsersByEmail,
    addUser,
    updateUser,
    deleteUser
};
