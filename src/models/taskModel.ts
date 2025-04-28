import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface ITask extends Document {
	_id: Types.ObjectId;
	text: string;
	description?: string;
	completed: boolean;
	listId: Types.ObjectId;
	createdBy: Types.ObjectId;
	order: number;

}

const taskSchema = new Schema<ITask>({
	text: {
		type: String,
		required: [true, 'Task text cannot be empty'],
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
	listId: {
		type: Schema.Types.ObjectId,
		ref: 'List',
		required: true,
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	order: {
		type: Number,
		required: true,
		default: 0,
	},
}, {
	timestamps: true,
});

taskSchema.index({ listId: 1, order: 1 });

const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);

export default Task;
