import Activity from '../models/Activity';
import mongoose from 'mongoose';

export const recordActivity = async (
    userId: mongoose.Types.ObjectId | string,
    relatedUsers: (mongoose.Types.ObjectId | string)[],
    type: string,
    data: any
) => {
    try {
        await Activity.create({
            user: userId,
            relatedUsers,
            type,
            data
        });
    } catch (error) {
        console.error('Error recording activity:', error);
    }
};
