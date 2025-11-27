import mongoose, { Document, Schema } from 'mongoose';

export interface IFriendship extends Document {
    requester: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted';
    createdAt: Date;
    updatedAt: Date;
}

const FriendshipSchema: Schema = new Schema({
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
}, { timestamps: true });

// Ensure unique friendship between two users
FriendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export default mongoose.model<IFriendship>('Friendship', FriendshipSchema);
