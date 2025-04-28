import { Request, Response } from "express"; 
import bcrypt from "bcryptjs";
import User, { IUser } from '../models/userModel.ts';
import { userService } from './userService.ts';

declare module "express-session" {
    interface SessionData {
        userId: string;
        isAuthenticated: boolean;
    }
}

/**
 * Authenticates a user based on username and password.
 * Uses Mongoose User model for database interaction.
 * Compares hashed passwords securely using bcrypt.
 * Saves user ID and authentication status to the session upon success.
 * @param req - Express Request object containing username and password in the body.
 * @returns The user's ID (as a string) upon successful authentication, or null otherwise.
 */
const loginUser = async (req: Request): Promise<string | null> => {
    try {
        const { username, password: inputPassword } = req.body;

        if (!username || !inputPassword) {
            console.log("Login attempt with missing username or password.");
            return null;
        }

        const foundUser: IUser | null = await User.findOne({ username: username }).exec();

        if (!foundUser) {
            console.log(`Login attempt failed: User "${username}" not found.`);
            return null;
        }

        const isPasswordMatch: boolean = await bcrypt.compare(inputPassword, foundUser.password);

        if (!isPasswordMatch) {
            console.log(`Login attempt failed: Incorrect password for user "${username}".`);
            return null;
        }

        console.log(`User "${username}" authenticated successfully.`);

        await new Promise<void>((resolve, reject) => {
			req.session.regenerate((err: Error | null): void => {
				if (err) {
					console.error("Session regeneration error:", err);
					reject(new Error('Failed to regenerate session'));
				} else {
					req.session.userId = foundUser._id.toString();
					req.session.isAuthenticated = true;
					console.log(`Session regenerated and saved for user: ${foundUser._id.toString()}`);
					resolve();
				}
			});
        });

        return foundUser._id.toString();

    } catch (error) {
        console.error("Error during login process:", error);
        return null;
    }
};

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
    loginUser,
    checkAuthStatus,
    logoutUser
};
