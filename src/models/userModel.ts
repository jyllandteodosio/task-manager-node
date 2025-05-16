import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
	_id: Types.ObjectId;
	username?: string;
	password?: string;
	email?: string | null;
	googleId?: string | null;
	firstName?: string;
	lastName?: string;
}

const userSchema = new Schema<IUser>({
	username: {
		type: String,
		required: function (this: IUser) {
			return !this.googleId;
		} as any,
		unique: true,
		sparse: true,
		trim: true,
		index: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: function (this: IUser) {
			return !this.googleId;
		} as any,
		minlength: [6, 'Password must be at least 6 characters long'],
	},
	email: {
		type: String,
		unique: true,
		sparse: true,
		index: true
	},
	googleId: {
		type: String,
		unique: true,
		sparse: true
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

	if (!user.isModified('password') || !user.password) {
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
