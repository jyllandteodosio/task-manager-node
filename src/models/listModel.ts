import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IList extends Document {
	title: string;
	description: string;
	ownerId: Types.ObjectId;
	collaborators: Types.ObjectId[];
}

const listSchema = new Schema<IList>({
	title: {
		type: String,
		required: [true, 'List title is required'],
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	ownerId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		index: true,
	},
	collaborators: [{
		type: Schema.Types.ObjectId,
		ref: 'User',
		index: true,
	}],
}, {
	timestamps: true,
});

const List = mongoose.model<IList>('List', listSchema);

export default List;
