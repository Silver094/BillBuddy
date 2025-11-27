import { Request, Response } from 'express';
import Activity from '../models/Activity';

interface AuthRequest extends Request {
    user?: any;
}

export const getActivityFeed = async (req: AuthRequest, res: Response) => {
    try {
        const activities = await Activity.find({ relatedUsers: req.user._id })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
