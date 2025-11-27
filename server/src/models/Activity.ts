import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
    user: mongoose.Types.ObjectId;
    relatedUsers: mongoose.Types.ObjectId[];
    type: string;
    data: any;
    createdAt: Date;
}

const ActivitySchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    relatedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    type: { type: String, required: true }, // e.g., 'EXPENSE_ADDED', 'GROUP_CREATED'
    data: { type: Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
