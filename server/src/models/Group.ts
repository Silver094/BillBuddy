import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
    name: string;
    creator: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const GroupSchema: Schema = new Schema({
    name: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<IGroup>('Group', GroupSchema);
