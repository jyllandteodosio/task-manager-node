import { Request, Response } from "express";
import { IUser } from '../models/userModel.ts';
import { userService } from './userService.ts';

declare module "express-session" {
    interface SessionData {
        userId: string;
        isAuthenticated: boolean;
    }
}

/**
 * Checks if the current session belongs to an authenticated user.
 * If authenticated, fetches and returns the user's data (excluding password).
 * @param req - Express Request object containing the session.
 * @returns A promise resolving to the user object (without password) if authenticated, or null otherwise.
 */
const checkAuthStatus = async (req: Request): Promise<Omit<IUser, 'password'> | null> => {
    try {
        if (req.session && req.session.isAuthenticated && req.session.userId) {
            const user = await userService.getUserById(req.session.userId);
            if (user) {
                const { password, ...userResponse } = user.toObject();
                return userResponse;
            }
        }
        return null;
    } catch (error) {
        console.error("Error checking auth status:", error);
        return null;
    }
};

/**
 * Logs out the current user by destroying their session.
 * @param req - Express Request object containing the session.
 * @param res - Express Response object (optional, used here for clearing cookie).
 * @returns A promise resolving to true if logout was successful, false otherwise.
 */
const logoutUser = async (req: Request, res: Response): Promise<boolean> => {
    return new Promise((resolve) => {
        req.session.destroy((err: Error | null): void => {
            if (err) {
                console.error("Error destroying session:", err);
                resolve(false);
            } else {
                res.clearCookie('connect.sid');
                console.log("Session destroyed successfully.");
                resolve(true);
            }
        });
    });
};


export const authService = {
    checkAuthStatus,
    logoutUser
};
