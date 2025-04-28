import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
	_id: Types.ObjectId;
	username: string;
	password: string;
	firstName?: string;
	lastName?: string;
}

const userSchema = new Schema<IUser>({
	username: {
		type: String,
		required: [true, 'Username is required'],
		unique: true,
		trim: true,
		index: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: [6, 'Password must be at least 6 characters long'],
	},
	firstName: {
		type: String,
		trim: true,
	},
	lastName: {
		type: String,
		trim: true,
	},
}, {
	timestamps: true,
});

userSchema.pre<IUser>('save', async function (next) {
	const user = this;

	if (!user.isModified('password')) {
		return next();
	}

	try {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(user.password, salt);
		user.password = hash;
		next();
	} catch (error: any) {
		console.error("Error hashing password:", error);
		next(error);
	}
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
